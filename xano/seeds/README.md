# Seed data for Curb.ly

Import order matters — `user_roles.csv` references row IDs created by the two imports before it. Import each CSV into its matching table via Xano's Database -> select table -> Import -> CSV, **in this order, into empty tables**:

1. **`roles.csv`** -> `roles`. 3 rows, becomes ids 1-3: `food_truck_worker`, `food_truck_manager`, `admin`.
2. **`users.csv`** -> `users`. 4 rows, becomes ids 1-4: `customer@curbly.test`, `worker@curbly.test`, `manager@curbly.test`, `admin@curbly.test` — all password `changeme123`. Xano's `password` field type hashes the value on write regardless of import method, so login works immediately.
3. **`food_trucks.csv`** -> `food_trucks`. 4 sample trucks (placeholder photos via picsum.photos) with `manager_id` left blank.
4. **`user_roles.csv`** -> `user_roles`. Maps `worker`(2) -> `food_truck_worker`(1), `manager`(3) -> `food_truck_manager`(2), `admin`(4) -> `admin`(3). `customer` gets no row, making it the Customer by default.
5. **`favorites.csv`** -> `favorites`. `customer`(1) favorites Lobsta Truck(1) and Taco Fiesta(3); `worker`(2) favorites Izzy's Cheesesteaks(2).
6. **`menu_categories.csv`** -> `menu_categories`. 9 rows, becomes ids 1-9, 2-3 categories per truck (e.g. Lobsta Truck gets "Lobster Rolls"(1), "Sides"(2), "Drinks"(3)).
7. **`menu_items.csv`** -> `menu_items`. 14 sample items referencing the category ids above by position.

If `roles`, `users`, `food_trucks`, or `menu_categories` already had rows before importing (so the new rows don't start at id 1), open `user_roles.csv`, `favorites.csv`, and `menu_items.csv` and update the id columns to match the actual ids Xano assigned.

`menu_items.ingredients` is a list-type field — its CSV cell uses JSON array syntax (e.g. `["Lobster","Butter"]`). If Xano's CSV importer doesn't auto-parse that for list columns, paste the items in manually for the first row to confirm the expected format, then adjust the rest of the CSV to match before importing.
