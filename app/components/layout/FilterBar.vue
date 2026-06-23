<script setup lang="ts">
defineProps<{ view: 'list' | 'map' }>()
const emit = defineEmits<{ 'update:view': [view: 'list' | 'map'] }>()
</script>

<template>
  <div class="flex flex-wrap gap-2 px-4 py-3">
    <button class="flex items-center gap-1 rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
      Filters
    </button>
    <button class="flex items-center gap-1 rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
      Sort
    </button>
    <button
      class="flex items-center gap-1 rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
      @click="emit('update:view', view === 'list' ? 'map' : 'list')"
    >
      {{ view === 'list' ? 'Map View' : 'List View' }}
    </button>
  </div>
</template>
