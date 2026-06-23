export function useXano() {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  function request<T>(path: string, opts: Parameters<typeof $fetch>[1] = {}) {
    return $fetch<T>(path, {
      baseURL: config.public.xanoBaseUrl,
      ...opts,
      headers: {
        ...(auth.token ? { Authorization: `Bearer ${auth.token}` } : {}),
        ...(opts?.headers || {})
      }
    })
  }

  return { request }
}
