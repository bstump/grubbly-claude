<script setup lang="ts">
const auth = useAuthStore()
</script>

<template>
  <header class="flex items-center justify-between border-b border-gray-200 px-4 py-3">
    <div class="flex items-center gap-2">
      <span class="text-lg font-semibold text-orange-600">Curb.ly</span>
    </div>
    <nav class="flex items-center gap-4 text-sm">
      <NuxtLink v-if="isWorker(auth.user)" to="/manager/trucks" class="text-gray-600 hover:text-orange-600">
        My Truck
      </NuxtLink>
      <NuxtLink v-if="isAdmin(auth.user)" to="/admin/users" class="text-gray-600 hover:text-orange-600">
        Admin
      </NuxtLink>
      <NuxtLink v-if="!auth.token" to="/login" class="text-gray-600 hover:text-orange-600">
        Log in
      </NuxtLink>
      <button v-else class="text-gray-600 hover:text-orange-600" @click="auth.logout()">
        Log out
      </button>
    </nav>
  </header>
</template>
