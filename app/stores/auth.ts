import { defineStore } from 'pinia'
import type { User } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  const token = useCookie<string | null>('curbly_token', { default: () => null, sameSite: 'lax' })
  const user = useCookie<User | null>('curbly_user', { default: () => null, sameSite: 'lax' })

  async function login(email: string, password: string) {
    const config = useRuntimeConfig()
    const { authToken } = await $fetch<{ authToken: string }>('/auth/login', {
      baseURL: config.public.xanoBaseUrl,
      method: 'POST',
      body: { email, password }
    })
    token.value = authToken
    await fetchMe()
  }

  async function signup(email: string, password: string, name: string) {
    const config = useRuntimeConfig()
    const { authToken } = await $fetch<{ authToken: string }>('/auth/signup', {
      baseURL: config.public.xanoBaseUrl,
      method: 'POST',
      body: { email, password, name }
    })
    token.value = authToken
    await fetchMe()
  }

  async function fetchMe() {
    if (!token.value) return
    const config = useRuntimeConfig()
    user.value = await $fetch<User>('/auth/me', {
      baseURL: config.public.xanoBaseUrl,
      headers: { Authorization: `Bearer ${token.value}` }
    })
  }

  function logout() {
    token.value = null
    user.value = null
  }

  return { token, user, login, signup, fetchMe, logout }
})
