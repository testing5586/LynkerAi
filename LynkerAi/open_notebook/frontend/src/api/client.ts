export async function fetchJson<T>(url: string, init?: RequestInit, fallback?: T): Promise<T> {
  try {
    const res = await fetch(url, init)
    if (!res.ok) throw new Error(String(res.status))
    return await res.json()
  } catch (e) {
    if (fallback !== undefined) return fallback
    throw e
  }
}

export async function postJson<T>(url: string, body: any): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

