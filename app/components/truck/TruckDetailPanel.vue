<script setup lang="ts">
import type { FoodTruck } from '~/types'

defineProps<{ truck: FoodTruck }>()
defineEmits<{ close: [] }>()
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-end justify-center bg-black/40" @click.self="$emit('close')">
    <div class="w-full max-w-md rounded-t-2xl bg-white p-4 shadow-xl">
      <div class="mx-auto mb-3 h-1.5 w-12 rounded-full bg-gray-300" />
      <img :src="truck.photo_url" :alt="truck.name" class="h-44 w-full rounded-xl object-cover" />
      <h2 class="mt-3 text-xl font-semibold text-orange-600">{{ truck.name }}</h2>
      <p class="mt-1 text-sm text-gray-600">{{ truck.description }}</p>
      <div class="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
        <span class="rounded-full bg-gray-100 px-2 py-0.5">★ {{ truck.rating.toFixed(2) }} ({{ truck.review_count }})</span>
        <span class="rounded-full bg-gray-100 px-2 py-0.5">{{ truck.hours_open }} - {{ truck.hours_close }}</span>
      </div>
      <p class="mt-2 text-sm text-gray-600">📍 {{ truck.address }}</p>
      <a :href="truck.menu_url" class="mt-1 block text-sm text-orange-600 underline">{{ truck.menu_url }}</a>
      <button class="mt-4 w-full rounded-full border border-gray-300 py-2 text-sm font-medium text-gray-700" @click="$emit('close')">
        Close
      </button>
    </div>
  </div>
</template>
