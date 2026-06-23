<script setup lang="ts">
const route = useRoute()
const truckId = Number(route.params.id)

const { get } = useFoodTrucks()
const { getMenu } = useMenu()

const { data: truck } = await useAsyncData(`truck-${truckId}`, () => get(truckId))
const { data: categories } = await useAsyncData(`truck-menu-${truckId}`, () => getMenu(truckId))

const search = ref('')
const activeCategoryId = ref<number | null>(null)
const favorited = ref(false)

const filteredCategories = computed(() => {
  const list = categories.value ?? []
  const byActive = activeCategoryId.value
    ? list.filter(c => c.id === activeCategoryId.value)
    : list
  const query = search.value.trim().toLowerCase()
  if (!query) return byActive
  return byActive
    .map(c => ({ ...c, items: c.items.filter(i => i.name.toLowerCase().includes(query)) }))
    .filter(c => c.items.length > 0)
})

function selectCategory(id: number) {
  activeCategoryId.value = activeCategoryId.value === id ? null : id
}
</script>

<template>
  <div v-if="truck" class="flex flex-1 flex-col">
    <div class="flex items-center justify-between border-b border-gray-200 px-4 py-3">
      <button class="text-xl text-gray-600" aria-label="Back" @click="$router.back()">←</button>
      <h1 class="truncate text-lg font-semibold text-gray-900">{{ truck.name }}</h1>
      <button class="text-xl" :class="favorited ? 'text-red-500' : 'text-gray-400'" aria-label="Favorite" @click="favorited = !favorited">
        ♥
      </button>
    </div>

    <img :src="truck.photo_url" :alt="truck.name" class="h-44 w-full object-cover" />

    <div class="px-4 py-3">
      <div class="flex flex-wrap items-center gap-2 text-sm text-gray-600">
        <span class="rounded-full bg-gray-100 px-2 py-0.5">★ {{ truck.rating.toFixed(2) }} ({{ truck.review_count }})</span>
        <span class="rounded-full bg-gray-100 px-2 py-0.5">{{ truck.hours_open }} - {{ truck.hours_close }}</span>
      </div>
      <p class="mt-2 text-sm text-gray-600">📍 {{ truck.address }}</p>
      <p v-if="truck.description" class="mt-2 text-sm text-gray-600">{{ truck.description }}</p>
    </div>

    <div class="px-4">
      <input
        v-model="search"
        type="search"
        placeholder="Search the menu"
        class="w-full rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-orange-600 focus:outline-none"
      />
    </div>

    <div v-if="categories?.length" class="flex gap-2 overflow-x-auto px-4 py-4">
      <button
        v-for="category in categories"
        :key="category.id"
        class="shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium"
        :class="activeCategoryId === category.id
          ? 'border-orange-600 bg-orange-600 text-white'
          : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
        @click="selectCategory(category.id)"
      >
        {{ category.name }}
      </button>
    </div>

    <div class="flex-1 overflow-y-auto px-4 pb-6">
      <div v-if="!filteredCategories.length" class="py-10 text-center text-sm text-gray-500">
        No menu items found.
      </div>
      <div v-for="category in filteredCategories" :key="category.id" class="mb-6">
        <h2 class="mb-3 text-base font-semibold text-gray-900">{{ category.name }}</h2>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="item in category.items" :key="item.id" class="rounded-xl border border-gray-200 p-2">
            <img :src="item.image_url" :alt="item.name" class="h-28 w-full rounded-lg object-cover" />
            <h3 class="mt-2 text-sm font-semibold text-gray-900">{{ item.name }}</h3>
            <p class="mt-1 text-sm font-bold text-orange-600">${{ item.price.toFixed(2) }}</p>
            <p v-if="item.description" class="mt-1 text-xs text-gray-600">{{ item.description }}</p>
            <div v-if="item.ingredients?.length" class="mt-2 flex flex-wrap gap-1">
              <span
                v-for="ingredient in item.ingredients"
                :key="ingredient"
                class="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
              >
                {{ ingredient }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="px-4 py-10 text-center text-sm text-gray-500">Food truck not found.</div>
</template>
