# Seed data for Curb.ly

Import order matters — `user_roles.csv` references row IDs created by the two imports before it. Import each CSV into its matching table via Xano's Database -> select table -> Import -> CSV, **in this order, into empty tables**:

1. **`roles.csv`** -> `roles`. 3 rows, becomes ids 1-3: `food_truck_worker`, `food_truck_manager`, `admin`.
2. **`users.csv`** -> `users`. 4 rows, becomes ids 1-4: `customer@curbly.test`, `worker@curbly.test`, `manager@curbly.test`, `admin@curbly.test` — all password `changeme123`. Xano's `password` field type hashes the value on write regardless of import method, so login works immediately.
3. **`food_trucks.csv`** -> `food_trucks`. 4 sample trucks (placeholder photos via picsum.photos) with `manager_id` left blank.
4. **`user_roles.csv`** -> `user_roles`. Maps `worker`(2) -> `food_truck_worker`(1), `manager`(3) -> `food_truck_manager`(2), `admin`(4) -> `admin`(3). `customer` gets no row, making it the Customer by default.
5. **`favorites.csv`** -> `favorites`. `customer`(1) favorites Lobsta Truck(1) and Taco Fiesta(3); `worker`(2) favorites Izzy's Cheesesteaks(2).

If `roles`, `users`, or `food_trucks` already had rows before importing (so the new rows don't start at id 1), open `user_roles.csv` and `favorites.csv` and update the id columns to match the actual ids Xano assigned.
