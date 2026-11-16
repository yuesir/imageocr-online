/** Only allow local paths; never allow an OAuth return URL to leave this site. */
export function safeAuthRedirect(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\') || Array.from(value).some(char => char.charCodeAt(0) <= 0x20)) return '/ocr'
  const url = new URL(value, 'https://local.invalid')
  if (url.origin !== 'https://local.invalid' || /^\/(auth|login|signup)(\/|$)/.test(url.pathname)) return '/ocr'
  return url.pathname + url.search + url.hash
}
