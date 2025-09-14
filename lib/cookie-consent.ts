/**
 * Cookie consent utility functions
 */

/**
 * Check user's cookie consent status
 * @returns {'accepted' | 'declined' | null} Consent status
 */
export function getCookieConsent(): 'accepted' | 'declined' | null {
  if (typeof window === 'undefined') return null
  
  const consent = localStorage.getItem('cookie-consent')
  return consent as 'accepted' | 'declined' | null
}

/**
 * Reset cookie consent status (for settings page)
 */
export function resetCookieConsent(): void {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('cookie-consent')
  localStorage.removeItem('cookie-consent-date')
  
  // Reload page to show consent dialog
  window.location.reload()
}

/**
 * Get cookie consent date
 * @returns {Date | null} Consent date
 */
export function getCookieConsentDate(): Date | null {
  if (typeof window === 'undefined') return null
  
  const dateStr = localStorage.getItem('cookie-consent-date')
  return dateStr ? new Date(dateStr) : null
}