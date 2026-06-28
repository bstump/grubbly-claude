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

### `menu_categories`
| field | type | notes |
|---|---|---|
| id | int | PK |
| food_truck_id | int | FK -> food_trucks |
| name | text | e.g. "Burgers", "Drinks" |
| sort_order | int | display order within the truck's menu |

### `menu_items`
| field | type | notes |
|---|---|---|
| id | int | PK |
| category_id | int | FK -> menu_categories |
| name | text | |
| price | decimal | |
| image_url | text | |
| description | text | |
| sort_order | int | display order within the category |

### `menu_item_ingredients`
| field | type | notes |
|---|---|---|
| id | int | PK |
| menu_item_id | int | FK -> menu_items |
| name | text | key ingredient, e.g. "Beef Patty" |
| sort_order | int | display order within the item |

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
| GET | `/food_trucks/{id}/menu` | none | returns `menu_categories` for the truck, each with a nested `items: MenuItem[]` (addon joining `menu_items` by `category_id`), each item's `ingredients` field populated by a further addon joining `menu_item_ingredients` by `menu_item_id` and flattening to a plain `string[]` of names, all ordered by `sort_order` |
| POST | `/menu_categories` | bearer, manager/admin | body `{ food_truck_id, name }`; if Manager/Worker, restrict to trucks where `manager_id == auth user id` |
| PATCH | `/menu_categories/{id}` | bearer, manager/admin | body `{ name }` |
| DELETE | `/menu_categories/{id}` | bearer, manager/admin | also deletes its `menu_items` |
| POST | `/menu_items` | bearer, manager/admin | body `{ category_id, name, price, image_url, description, ingredients }`; `ingredients` is a plain `string[]` — insert one `menu_item_ingredients` row per entry |
| PATCH | `/menu_items/{id}` | bearer, manager/admin | body any subset of the above; if `ingredients` is present, delete the item's existing `menu_item_ingredients` rows and re-insert the provided list |
| DELETE | `/menu_items/{id}` | bearer, manager/admin | also deletes its `menu_item_ingredients` |

The frontend expects `GET /auth/me` to return roles as plain lowercase strings (`"admin"`, `"food_truck_manager"`, `"food_truck_worker"`) in a `roles` array — add an Xano addon/function stack step that joins `user_roles` -> `roles` and flattens to names.

The frontend's `MenuItem.ingredients` is always a flat `string[]` regardless of this storage change — the request/response contract for `/menu_items` and `/food_trucks/{id}/menu` is unchanged, only the underlying Xano table layout moved from an array column to a child table. No frontend code needs to change.
