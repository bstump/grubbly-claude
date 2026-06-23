export type Role = 'food_truck_worker' | 'food_truck_manager' | 'admin'

export interface User {
  id: number
  email: string
  name: string
  roles: Role[]
}

export interface FoodTruck {
  id: number
  name: string
  description: string
  photo_url: string
  latitude: number
  longitude: number
  address: string
  rating: number
  review_count: number
  hours_open: string
  hours_close: string
  menu_url: string
  tag: string
  manager_id: number | null
}
