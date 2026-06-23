<script setup lang="ts">
const auth = useAuthStore()
const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

async function submit() {
  error.value = ''
  try {
    await auth.login(email.value, password.value)
    router.push('/')
  } catch {
    error.value = 'Invalid email or password.'
  }
}
</script>

<template>
  <div class="mx-auto max-w-sm px-4 py-10">
    <h1 class="text-xl font-bold text-orange-600">Log in to Curb.ly</h1>
    <form class="mt-6 flex flex-col gap-3" @submit.prevent="submit">
      <input v-model="email" type="email" placeholder="Email" class="rounded-lg border border-gray-300 px-3 py-2" required />
      <input v-model="password" type="password" placeholder="Password" class="rounded-lg border border-gray-300 px-3 py-2" required />
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <button type="submit" class="rounded-full bg-orange-600 py-2 text-sm font-medium text-white">Log in</button>
    </form>
    <p class="mt-4 text-sm text-gray-600">
      No account? <NuxtLink to="/signup" class="text-orange-600 underline">Sign up</NuxtLink>
    </p>
  </div>
</template>
