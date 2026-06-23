import type { User } from '~/types'

export function isAdmin(user: User | null): boolean {
  return !!user?.roles?.includes('admin')
}

export function isManager(user: User | null): boolean {
  return !!user?.roles?.includes('food_truck_manager') || isAdmin(user)
}

export function isWorker(user: User | null): boolean {
  return !!user?.roles?.includes('food_truck_worker') || isManager(user)
}

export function isCustomer(user: User | null): boolean {
  return !!user && (user.roles?.length ?? 0) === 0
}
