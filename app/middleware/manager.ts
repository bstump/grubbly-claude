export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()
  if (!auth.token) return navigateTo('/login')
  if (!isWorker(auth.user)) return navigateTo('/')
})
