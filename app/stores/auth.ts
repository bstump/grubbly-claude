import { defineStore } from 'pinia'
import type { User } from '~/types'

const STORAGE_KEY = 'curbly.auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as User | null
  }),
  actions: {
    hydrate() {
      if (!import.meta.client) return
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      try {
        const parsed = JSON.parse(raw)
        this.token = parsed.token ?? null
        this.user = parsed.user ?? null
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    },
    persist() {
      if (!import.meta.client) return
      if (this.token) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: this.token, user: this.user }))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    },
    async login(email: string, password: string) {
      const config = useRuntimeConfig()
      const { authToken } = await $fetch<{ authToken: string }>('/auth/login', {
        baseURL: config.public.xanoBaseUrl,
        method: 'POST',
        body: { email, password }
      })
      this.token = authToken
      await this.fetchMe()
      this.persist()
    },
    async signup(email: string, password: string, name: string) {
      const config = useRuntimeConfig()
      const { authToken } = await $fetch<{ authToken: string }>('/auth/signup', {
        baseURL: config.public.xanoBaseUrl,
        method: 'POST',
        body: { email, password, name }
      })
      this.token = authToken
      await this.fetchMe()
      this.persist()
    },
    async fetchMe() {
      if (!this.token) return
      const config = useRuntimeConfig()
      this.user = await $fetch<User>('/auth/me', {
        baseURL: config.public.xanoBaseUrl,
        headers: { Authorization: `Bearer ${this.token}` }
      })
      this.persist()
    },
    logout() {
      this.token = null
      this.user = null
      this.persist()
    }
  }
})
