export function useFavorites() {
  const { request } = useXano()

  function add(foodTruckId: number) {
    return request<{ id: number }>('/favorites', { method: 'POST', body: { food_truck_id: foodTruckId } })
  }

  function remove(favoriteId: number) {
    return request(`/favorites/${favoriteId}`, { method: 'DELETE' })
  }

  return { add, remove }
}
