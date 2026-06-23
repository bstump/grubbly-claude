<script setup lang="ts">
import type { FoodTruck } from '~/types'

const props = defineProps<{ truck: FoodTruck; index: number }>()
defineEmits<{ select: [truck: FoodTruck] }>()
const favorited = ref(false)
</script>

<template>
  <div class="block w-full cursor-pointer text-left" role="button" tabindex="0" @click="$emit('select', props.truck)">
    <div class="relative">
      <img :src="truck.photo_url" :alt="truck.name" class="h-44 w-full rounded-xl object-cover" />
      <button
        class="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow"
        @click.stop="favorited = !favorited"
      >
        <span :class="favorited ? 'text-red-500' : 'text-gray-400'">♥</span>
      </button>
    </div>
    <h3 class="mt-2 text-lg font-semibold text-orange-600">{{ index }}. {{ truck.name }}</h3>
    <div class="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600">
      <span class="rounded-full bg-gray-100 px-2 py-0.5">2 Mi</span>
      <span class="rounded-full bg-gray-100 px-2 py-0.5">★ {{ truck.rating.toFixed(2) }} ({{ truck.review_count }})</span>
      <span class="rounded-full bg-gray-100 px-2 py-0.5">{{ truck.hours_open }} - {{ truck.hours_close }}</span>
    </div>
    <p class="mt-1 text-sm text-gray-600">📍 {{ truck.address }}</p>
    <a :href="truck.menu_url" class="mt-1 block text-sm text-orange-600 underline" @click.stop>
      {{ truck.menu_url }}
    </a>
  </div>
</template>
