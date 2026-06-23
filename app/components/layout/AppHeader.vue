<script setup lang="ts">
const auth = useAuthStore()
const menuOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

function onClickOutside(event: MouseEvent) {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    menuOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))

function logout() {
  auth.logout()
  menuOpen.value = false
}

const initials = computed(() => {
  const name = auth.user?.name?.trim()
  if (!name) return 'U'
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0]!.toUpperCase())
    .join('')
})
</script>

<template>
  <header class="flex items-center justify-between border-b border-gray-200 px-4 py-3">
    <div class="flex items-center gap-2">
      <NuxtLink to="/" class="text-lg font-semibold text-orange-600">Curb.ly</NuxtLink>
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

      <div v-else ref="menuRef" class="relative">
        <button
          type="button"
          class="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2"
          aria-haspopup="true"
          :aria-expanded="menuOpen"
          @click="menuOpen = !menuOpen"
        >
          <span class="sr-only">Open user menu</span>
          <span
            class="flex h-9 w-9 items-center justify-center rounded-full bg-orange-600 text-sm font-medium text-white"
          >
            {{ initials }}
          </span>
        </button>
        <div
          v-if="menuOpen"
          class="absolute right-0 top-full z-10 mt-2 w-48 origin-top-right overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
          role="menu"
        >
          <p class="truncate border-b border-gray-100 px-4 py-2 text-sm text-gray-500">
            {{ auth.user?.email }}
          </p>
          <NuxtLink
            to="/dashboard"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            role="menuitem"
            @click="menuOpen = false"
          >
            Dashboard
          </NuxtLink>
          <button
            class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
            role="menuitem"
            @click="logout"
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>
