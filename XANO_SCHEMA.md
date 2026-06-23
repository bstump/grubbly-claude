# Xano Schema for Curb.ly

Create these tables and endpoints in your Xano workspace, then point `NUXT_PUBLIC_XANO_BASE_URL` (in `.env`) at your API group's base URL.

## Tables

### `users` (Xano's built-in Auth table)
| field | type | notes |
|---|---|---|
| id | int | PK |
| email | text | unique, used for login |
| password | password | managed by Xano auth |
| name | text | |
| created_at | timestamp | auto |

### `roles`
| field | type | notes |
|---|---|---|
| id | int | PK |
| name | text | one of `food_truck_worker`, `food_truck_manager`, `admin` |

Seed with three rows, one per role above.

### `user_roles` (join table)
| field | type | notes |
|---|---|---|
| id | int | PK |
| user_id | int | FK -> users |
| role_id | int | FK -> roles |

A user with **no rows** in `user_roles` is a **Customer**.

### `food_trucks`
| field | type | notes |
|---|---|---|
| id | int | PK |
| name | text | |
| description | text | |
| photo_url | text | |
| latitude | decimal | |
| longitude | decimal | |
| address | text | |
| rating | decimal | e.g. 4.00 |
| review_count | int | |
| hours_open | text | e.g. "7:00 PM" |
| hours_close | text | e.g. "12:00 AM" |
| menu_url | text | |
| tag | text | category label shown on card |
| manager_id | int, nullable | FK -> users; the Manager/Worker who owns this truck |

### `favorites`
| field | type | notes |
|---|---|---|
| id | int | PK |
| user_id | int | FK -> users |
| food_truck_id | int | FK -> food_trucks |

## Endpoints

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/auth/signup` | none | body `{ email, password, name }` -> `{ authToken }` |
| POST | `/auth/login` | none | body `{ email, password }` -> `{ authToken }` |
| GET | `/auth/me` | bearer | returns user + `roles: string[]` |
| GET | `/food_trucks` | none | list all trucks |
| GET | `/food_trucks/{id}` | none | single truck |
| POST | `/food_trucks` | bearer, manager/admin | create truck |
| PATCH | `/food_trucks/{id}` | bearer, manager/admin | update truck; if Manager/Worker, restrict to rows where `manager_id == auth user id` |
| GET | `/users` | bearer, admin | list users with their roles |
| PATCH | `/users/{id}/roles` | bearer, admin | body `{ role_ids: number[] }`, replaces the user's `user_roles` rows |
| POST | `/favorites` | bearer | body `{ food_truck_id }` |
| DELETE | `/favorites/{id}` | bearer | |

The frontend expects `GET /auth/me` to return roles as plain lowercase strings (`"admin"`, `"food_truck_manager"`, `"food_truck_worker"`) in a `roles` array — add an Xano addon/function stack step that joins `user_roles` -> `roles` and flattens to names.
