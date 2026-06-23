import type { FoodTruck } from '~/types'

export function useFoodTrucks() {
  const { request } = useXano()

  function list() {
    return request<FoodTruck[]>('/food_trucks')
  }

  function get(id: number) {
    return request<FoodTruck>(`/food_trucks/${id}`)
  }

  function update(id: number, payload: Partial<FoodTruck>) {
    return request<FoodTruck>(`/food_trucks/${id}`, { method: 'PATCH', body: payload })
  }

  function create(payload: Partial<FoodTruck>) {
    return request<FoodTruck>('/food_trucks', { method: 'POST', body: payload })
  }

  return { list, get, update, create }
}
