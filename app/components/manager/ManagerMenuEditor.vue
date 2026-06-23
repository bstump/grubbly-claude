<script setup lang="ts">
import type { MenuCategory, MenuItem } from '~/types'

const props = defineProps<{ foodTruckId: number }>()

const { getMenu, createCategory, updateCategory, deleteCategory, createItem, updateItem, deleteItem } = useMenu()

const categories = ref<MenuCategory[]>([])
const newCategoryName = ref('')
const addingItemFor = ref<number | null>(null)
const newItem = reactive({ name: '', price: 0, image_url: '', description: '', ingredientsText: '' })

async function refresh() {
  categories.value = await getMenu(props.foodTruckId)
}

onMounted(refresh)

async function addCategory() {
  if (!newCategoryName.value.trim()) return
  await createCategory(props.foodTruckId, newCategoryName.value.trim())
  newCategoryName.value = ''
  await refresh()
}

async function renameCategory(category: MenuCategory) {
  await updateCategory(category.id, category.name)
}

async function removeCategory(category: MenuCategory) {
  await deleteCategory(category.id)
  await refresh()
}

function startAddItem(categoryId: number) {
  addingItemFor.value = categoryId
  newItem.name = ''
  newItem.price = 0
  newItem.image_url = ''
  newItem.description = ''
  newItem.ingredientsText = ''
}

async function saveNewItem(categoryId: number) {
  if (!newItem.name.trim()) return
  await createItem(categoryId, {
    name: newItem.name,
    price: Number(newItem.price),
    image_url: newItem.image_url,
    description: newItem.description,
    ingredients: newItem.ingredientsText.split(',').map(s => s.trim()).filter(Boolean)
  })
  addingItemFor.value = null
  await refresh()
}

async function saveItem(item: MenuItem & { ingredientsText?: string }) {
  await updateItem(item.id, {
    name: item.name,
    price: Number(item.price),
    image_url: item.image_url,
    description: item.description,
    ingredients: (item.ingredientsText ?? item.ingredients.join(', ')).split(',').map(s => s.trim()).filter(Boolean)
  })
  await refresh()
}

async function removeItem(item: MenuItem) {
  await deleteItem(item.id)
  await refresh()
}
</script>

<template>
  <div>
    <h2 class="text-lg font-bold text-orange-600">Menu</h2>

    <div class="mt-4 flex gap-2">
      <input
        v-model="newCategoryName"
        type="text"
        placeholder="New category name"
        class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
        @keyup.enter="addCategory"
      />
      <button class="rounded-full bg-orange-600 px-4 py-2 text-sm font-medium text-white" @click="addCategory">
        Add Category
      </button>
    </div>

    <div v-for="category in categories" :key="category.id" class="mt-6 rounded-xl border border-gray-200 p-4">
      <div class="flex items-center gap-2">
        <input
          v-model="category.name"
          class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold"
          @change="renameCategory(category)"
        />
        <button class="text-sm text-red-600" @click="removeCategory(category)">Delete</button>
      </div>

      <div v-for="item in category.items" :key="item.id" class="mt-3 flex flex-col gap-2 rounded-lg border border-gray-100 p-3">
        <div class="flex flex-wrap gap-2">
          <input v-model="item.name" placeholder="Name" class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <input v-model.number="item.price" type="number" step="0.01" placeholder="Price" class="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <input v-model="item.image_url" placeholder="Image URL" class="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <textarea v-model="item.description" placeholder="Description" class="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input
          :value="item.ingredients.join(', ')"
          placeholder="Ingredients, comma separated"
          class="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          @input="item.ingredients = ($event.target as HTMLInputElement).value.split(',').map(s => s.trim()).filter(Boolean)"
        />
        <div class="flex gap-2">
          <button class="rounded-full bg-orange-600 px-4 py-1.5 text-sm font-medium text-white" @click="saveItem(item)">
            Save
          </button>
          <button class="text-sm text-red-600" @click="removeItem(item)">Delete</button>
        </div>
      </div>

      <div v-if="addingItemFor === category.id" class="mt-3 flex flex-col gap-2 rounded-lg border border-gray-100 p-3">
        <div class="flex flex-wrap gap-2">
          <input v-model="newItem.name" placeholder="Name" class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <input v-model.number="newItem.price" type="number" step="0.01" placeholder="Price" class="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <input v-model="newItem.image_url" placeholder="Image URL" class="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <textarea v-model="newItem.description" placeholder="Description" class="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <input v-model="newItem.ingredientsText" placeholder="Ingredients, comma separated" class="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <div class="flex gap-2">
          <button class="rounded-full bg-orange-600 px-4 py-1.5 text-sm font-medium text-white" @click="saveNewItem(category.id)">
            Save Item
          </button>
          <button class="text-sm text-gray-600" @click="addingItemFor = null">Cancel</button>
        </div>
      </div>

      <button
        v-else
        class="mt-3 text-sm font-medium text-orange-600"
        @click="startAddItem(category.id)"
      >
        + Add Item
      </button>
    </div>
  </div>
</template>
