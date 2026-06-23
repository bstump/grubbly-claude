import type { MenuCategory, MenuItem } from '~/types'

export function useMenu() {
  const { request } = useXano()

  function getMenu(foodTruckId: number) {
    return request<MenuCategory[]>(`/food_trucks/${foodTruckId}/menu`)
  }

  function createCategory(foodTruckId: number, name: string) {
    return request<MenuCategory>('/menu_categories', {
      method: 'POST',
      body: { food_truck_id: foodTruckId, name }
    })
  }

  function updateCategory(id: number, name: string) {
    return request<MenuCategory>(`/menu_categories/${id}`, { method: 'PATCH', body: { name } })
  }

  function deleteCategory(id: number) {
    return request(`/menu_categories/${id}`, { method: 'DELETE' })
  }

  function createItem(categoryId: number, payload: Partial<MenuItem>) {
    return request<MenuItem>('/menu_items', {
      method: 'POST',
      body: { category_id: categoryId, ...payload }
    })
  }

  function updateItem(id: number, payload: Partial<MenuItem>) {
    return request<MenuItem>(`/menu_items/${id}`, { method: 'PATCH', body: payload })
  }

  function deleteItem(id: number) {
    return request(`/menu_items/${id}`, { method: 'DELETE' })
  }

  return { getMenu, createCategory, updateCategory, deleteCategory, createItem, updateItem, deleteItem }
}
