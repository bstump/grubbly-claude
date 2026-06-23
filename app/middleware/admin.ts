export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()
  if (!auth.token) return navigateTo('/login')
  if (!isAdmin(auth.user)) return navigateTo('/')
})
