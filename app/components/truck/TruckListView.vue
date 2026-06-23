<script setup lang="ts">
import type { FoodTruck } from '~/types'

defineProps<{ trucks: FoodTruck[] }>()
defineEmits<{ select: [truck: FoodTruck] }>()
</script>

<template>
  <div class="flex flex-col gap-6 px-4 pb-6">
    <TruckCard
      v-for="(truck, i) in trucks"
      :key="truck.id"
      :truck="truck"
      :index="i + 1"
      @select="$emit('select', truck)"
    />
  </div>
</template>
