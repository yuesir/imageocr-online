/** A bounded worker pool. Every item keeps its original index in the UI. */
export async function runImageBatch<T>(items: readonly T[], concurrency: number, process: (item: T, index: number) => Promise<void>) {
  const limit = Math.min(items.length, Math.max(1, Math.floor(concurrency) || 1))
  let next = 0
  await Promise.all(Array.from({ length: limit }, async () => {
    while (next < items.length) {
      const index = next++
      await process(items[index], index)
    }
  }))
}

/** Retry only a rejected admission, using the exact same request/key each time.
 * Provider throttling and ambiguous network failures are never retried here. */
export async function fetchQueuedOCR(url: string, init: RequestInit, options: {
  fetch?: typeof fetch; wait?: (ms: number) => Promise<void>; maxWaitMs?: number
} = {}) {
  const send = options.fetch ?? fetch
  const wait = options.wait ?? (ms => new Promise(resolve => setTimeout(resolve, ms)))
  let remaining = options.maxWaitMs ?? 180000
  while (true) {
    const response = await send(url, init)
    if (response.status !== 429) return response
    const payload = await response.clone().json().catch(() => null)
    if (payload?.errorCode !== 'OCR_CONCURRENCY_LIMIT') return response
    const seconds = Number(response.headers.get('Retry-After') || 2)
    const delay = Number.isFinite(seconds) ? Math.min(5000, Math.max(500, seconds * 1000)) : 2000
    if (remaining < delay) return response
    remaining -= delay
    await wait(delay)
  }
}
