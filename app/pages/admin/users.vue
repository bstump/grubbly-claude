<script setup lang="ts">
import type { Role } from '~/types'

definePageMeta({ middleware: 'admin' })

interface AdminUser {
  id: number
  name: string
  email: string
  roles: Role[]
}

const ALL_ROLES: Role[] = ['food_truck_worker', 'food_truck_manager', 'admin']
const { request } = useXano()

const { data, refresh } = await useAsyncData('admin_users', () => request<AdminUser[]>('/users'))
const users = computed(() => data.value ?? [])
const saving = ref<number | null>(null)

async function toggleRole(user: AdminUser, role: Role) {
  const roleIds = ALL_ROLES.filter(r => ((user.roles ?? []).includes(r) ? r !== role : r === role))
  saving.value = user.id
  try {
    await request(`/users/${user.id}/roles`, { method: 'PATCH', body: { role_ids: roleIds } })
    await refresh()
  } finally {
    saving.value = null
  }
}
</script>

<template>
  <div class="px-4 py-6">
    <h1 class="text-xl font-bold text-orange-600">Manage Roles</h1>
    <table class="mt-4 w-full text-left text-sm">
      <thead>
        <tr class="border-b border-gray-200 text-gray-500">
          <th class="py-2">Name</th>
          <th class="py-2">Email</th>
          <th v-for="role in ALL_ROLES" :key="role" class="py-2">{{ role }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id" class="border-b border-gray-100">
          <td class="py-2">{{ user.name }}</td>
          <td class="py-2">{{ user.email }}</td>
          <td v-for="role in ALL_ROLES" :key="role" class="py-2">
            <input
              type="checkbox"
              :checked="(user.roles ?? []).includes(role)"
              :disabled="saving === user.id"
              @change="toggleRole(user, role)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
