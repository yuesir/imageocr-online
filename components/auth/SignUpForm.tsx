'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { FormEvent, ChangeEvent } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import Link from 'next/link'

export function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      return
    }
    
    if (password.length < 6) {
      return
    }

    setLoading(true)

    const { error } = await signUp(email, password, fullName)
    
    if (!error) {
      router.push('/login?message=Check your email to confirm your account')
    }
    
    setLoading(false)
  }

  const passwordsMatch = password === confirmPassword
  const passwordValid = password.length >= 6

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
        <CardDescription className="text-center">
          Sign up to start using OCR365
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
                disabled={loading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {password && !passwordValid && (
              <p className="text-sm text-destructive">Password must be at least 6 characters</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 pr-10"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="text-sm text-destructive">Passwords do not match</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full"
            disabled={loading || !email || !password || !passwordValid || !passwordsMatch}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}