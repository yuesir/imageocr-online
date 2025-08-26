'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import type { ChangeEvent } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/components/providers/ThemeProvider'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { ArrowLeft, Save, User, Palette, Globe } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

type UserPreferences = {
  theme: 'light' | 'dark' | 'system'
  language: 'en' | 'zh'
  auto_save_results: boolean
  default_ocr_language: 'eng' | 'chi_sim' | 'auto'
}

export default function PreferencesPage() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'system',
    language: 'en',
    auto_save_results: true,
    default_ocr_language: 'auto'
  })

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    loadPreferences()
  }, [user, router])

  const loadPreferences = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setPreferences({
          theme: data.theme || 'system',
          language: data.language || 'en',
          auto_save_results: data.auto_save_results ?? true,
          default_ocr_language: data.default_ocr_language || 'auto'
        })
      }
    } catch (error) {
      console.error('Error loading preferences:', error)
      toast.error('Failed to load preferences')
    }
  }

  const savePreferences = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          theme: preferences.theme,
          language: preferences.language,
          auto_save_results: preferences.auto_save_results,
          default_ocr_language: preferences.default_ocr_language,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      // Apply theme change immediately
      setTheme(preferences.theme)
      
      toast.success('Preferences saved successfully!')
    } catch (error) {
      console.error('Error saving preferences:', error)
      toast.error('Failed to save preferences')
    } finally {
      setLoading(false)
    }
  }

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
          <ThemeToggle />
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              User Preferences
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Customize your OCR365 experience
            </p>
          </div>

          <div className="space-y-6">
            {/* Theme Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Theme Settings
                </CardTitle>
                <CardDescription>
                  Choose your preferred theme appearance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="flex gap-2">
                    {(['light', 'dark', 'system'] as const).map((themeOption) => (
                      <Button
                        key={themeOption}
                        variant={preferences.theme === themeOption ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updatePreference('theme', themeOption)}
                        className="capitalize"
                      >
                        {themeOption}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Language Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Language Settings
                </CardTitle>
                <CardDescription>
                  Set your preferred language and OCR defaults
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Interface Language</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={preferences.language === 'en' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updatePreference('language', 'en')}
                    >
                      English
                    </Button>
                    <Button
                      variant={preferences.language === 'zh' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updatePreference('language', 'zh')}
                    >
                      Chinese
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Default OCR Language</Label>
                  <div className="flex gap-2">
                    {[
                      { value: 'auto', label: 'Auto Detect' },
                      { value: 'eng', label: 'English' },
                      { value: 'chi_sim', label: 'Chinese' }
                    ].map((option) => (
                      <Button
                        key={option.value}
                        variant={preferences.default_ocr_language === option.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updatePreference('default_ocr_language', option.value as any)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  General Settings
                </CardTitle>
                <CardDescription>
                  Configure general application behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-save OCR Results</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically save OCR results to your history
                    </p>
                  </div>
                  <Button
                    variant={preferences.auto_save_results ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updatePreference('auto_save_results', !preferences.auto_save_results)}
                  >
                    {preferences.auto_save_results ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                onClick={savePreferences}
                disabled={loading}
                className="min-w-32"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Preferences
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}