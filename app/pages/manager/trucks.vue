<script setup lang="ts">
import type { FoodTruck } from '~/types'

definePageMeta({ middleware: 'manager' })

const auth = useAuthStore()
const { list, update } = useFoodTrucks()
const saved = ref(false)

const { data } = await useAsyncData('manager_trucks', () => list())
const myTruck = computed(() =>
  (data.value ?? []).find(t => t.manager_id === auth.user?.id) ?? null
)
const form = ref<Partial<FoodTruck>>({ ...myTruck.value })

watch(myTruck, t => { if (t) form.value = { ...t } }, { immediate: true })

async function save() {
  if (!myTruck.value) return
  saved.value = false
  await update(myTruck.value.id, form.value)
  saved.value = true
}
</script>

<template>
  <div class="px-4 py-6">
    <h1 class="text-xl font-bold text-orange-600">My Truck</h1>
    <p v-if="!myTruck" class="mt-4 text-sm text-gray-600">
      No truck is assigned to your account yet. Ask an admin to set you as the manager on a truck in Xano.
    </p>
    <form v-else class="mt-4 flex max-w-md flex-col gap-3" @submit.prevent="save">
      <label class="text-sm text-gray-600">Name
        <input v-model="form.name" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
      </label>
      <label class="text-sm text-gray-600">Description
        <textarea v-model="form.description" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
      </label>
      <label class="text-sm text-gray-600">Hours Open
        <input v-model="form.hours_open" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
      </label>
      <label class="text-sm text-gray-600">Hours Close
        <input v-model="form.hours_close" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
      </label>
      <label class="text-sm text-gray-600">Menu URL
        <input v-model="form.menu_url" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
      </label>
      <button type="submit" class="rounded-full bg-orange-600 py-2 text-sm font-medium text-white">Save</button>
      <p v-if="saved" class="text-sm text-green-600">Saved.</p>
    </form>
  </div>
</template>
