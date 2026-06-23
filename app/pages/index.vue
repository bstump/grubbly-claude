<script setup lang="ts">
import type { FoodTruck } from '~/types'

const { list } = useFoodTrucks()
const trucks = ref<FoodTruck[]>([])
const view = ref<'list' | 'map'>('list')

const { data } = await useAsyncData('food_trucks', () => list())
trucks.value = data.value ?? []

function openTruck(truck: FoodTruck) {
  navigateTo(`/trucks/${truck.id}`)
}
</script>

<template>
  <div class="flex flex-1 flex-col">
    <div class="mx-4 mt-4 flex shrink-0 items-center gap-4 rounded-xl bg-gray-50 p-4">
      <div>
        <h1 class="text-lg font-bold text-orange-600">Find Food Trucks</h1>
        <p class="text-sm text-gray-500">Browse trucks near you in San Francisco</p>
      </div>
    </div>

    <FilterBar class="shrink-0" :view="view" @update:view="view = $event" />

    <div class="flex flex-1 flex-col overflow-hidden">
      <TruckMapView v-if="view === 'map'" :trucks="trucks" @select="openTruck" />
      <TruckListView v-else class="flex-1 overflow-y-auto" :trucks="trucks" @select="openTruck" />
    </div>
  </div>
</template>
