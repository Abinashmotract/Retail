## Microservice Assignment – Products, Orders & Dynamic Signup UI

### Backend – Nest.js Microservices

- **Product Service**
  - Location: `backend/product-service`
  - Runs an HTTP REST API on **port 3001**.
  - Also exposes a Nest **TCP microservice** on **port 8877** (configurable with `PRODUCT_MICROSERVICE_PORT`).
  - In‑memory product model with fields: `id`, `name`, `description`, `price`, `stock`, `active`, `createdAt`, `updatedAt`.
  - CRUD endpoints:
    - `POST /products`
    - `GET /products`
    - `GET /products/:id`
    - `PATCH /products/:id`
    - `DELETE /products/:id`
  - Microservice pattern:
    - `{ cmd: 'get-product-by-id' }` – used by the order service to fetch product details when creating orders.

- **Order Service**
  - Location: `backend/order-service`
  - HTTP REST API on **port 3002**.
  - In‑memory order model with fields: `id`, `customerName`, `customerEmail`, `items[]`, `status`, `totalAmount`, `createdAt`, `updatedAt`.
  - Each order item has `productId` and `quantity`.
  - Uses Nest **`ClientsModule` TCP client** to talk to the product microservice for product lookups and pricing.
  - CRUD endpoints:
    - `POST /orders` – validates product IDs with product microservice and calculates total.
    - `GET /orders`
    - `GET /orders/:id`
    - `PATCH /orders/:id`
    - `DELETE /orders/:id`

#### Running the backend

```bash
cd backend

# 1. Product service
cd product-service
npm install
npm run start:dev

# 2. Order service (in a separate terminal)
cd ../order-service
npm install
npm run start:dev
```

- Product API base URL: `http://localhost:3001`
- Order API base URL: `http://localhost:3002`

You can test with tools like Postman / curl:

```bash
# Create product
curl -X POST http://localhost:3001/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Sample Product","price":99.99,"stock":10}'

# Create order using productId returned above
curl -X POST http://localhost:3002/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Jane Doe",
    "items": [{ "productId": 1, "quantity": 2 }]
  }'
```

---

### Frontend – Next.js, TypeScript, Material UI

- Location: `frontend`
- Tech stack:
  - **Next.js (App Router)**
  - **TypeScript**
  - **Material UI (MUI)** for a modern responsive UI
  - **React Hook Form** for validation and form state
  - **LocalStorage** for simple persistence of submissions

#### Dynamic Signup Form

- Configuration‑driven via JSON:

```ts
const FORM_CONFIG = {
  data: [
    {
      id: 1,
      name: "Full Name",
      fieldType: "TEXT",
      minLength: 1,
      maxLength: 100,
      defaultValue: "John Doe",
      required: true,
    },
    {
      id: 2,
      name: "Email",
      fieldType: "TEXT",
      minLength: 1,
      maxLength: 50,
      defaultValue: "hello@mail.com",
      required: true,
    },
    {
      id: 6,
      name: "Gender",
      fieldType: "LIST",
      defaultValue: "Male",
      required: true,
      listOfValues1: ["Male", "Female", "Others"],
    },
    {
      id: 7,
      name: "Love React?",
      fieldType: "RADIO",
      defaultValue: "Yes",
      required: true,
      listOfValues1: ["Yes", "No"],
    },
  ],
};
```

- **Dynamic field rendering** based on `fieldType`:
  - `"TEXT"` → `TextField`
  - `"LIST"` → `Select` + `MenuItem` (dropdown)
  - `"RADIO"` → `RadioGroup` + `FormControlLabel`
- If you change:
  - `name` → label updates automatically.
  - `fieldType` (`TEXT` → `LIST` / `RADIO`) → component type changes accordingly.
  - `required`, `minLength`, `maxLength` → React Hook Form validation rules update.

- **Persistence**:
  - On submit, values are saved to `localStorage` under `dynamic-signup-submissions`.
  - A “Previous Submissions” panel renders nice chips showing all saved records.

- **Styling & UX**:
  - Centered responsive layout using `Container`, `Paper`, `Stack`, `Box`.
  - Clear section headers, helper texts, and error messages.
  - Primary / secondary actions with `Submit` and `Reset` buttons.

#### Running the frontend

```bash
cd frontend
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

---

### Notes for Reviewers

- The backend is intentionally in‑memory for simplicity, but the structure (modules, DTOs, services) is ready for plugging in a database (e.g., Prisma / TypeORM).
- Microservice communication is done via Nest’s TCP transport:
  - Order service is a REST app that uses a microservice client.
  - Product service exposes both REST endpoints and a TCP microservice listener.
- The UI is **fully JSON‑driven**, making it easy to extend the signup form or repurpose the mechanism for other forms.

# Retail
