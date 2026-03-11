### Overview

This project implements **both parts** of the assignment:

- A **Nest.js microservice backend** with separate Product and Order services that talk to each other.
- A **Next.js + TypeScript + Material UI frontend** with a dynamic, JSON‑driven signup form and localStorage persistence.

---

### Backend – Nest.js Microservices

**What the assignment asked**

1. Setup a Nest.js project with microservice capabilities.  
2. Create **two microservices**:
   - Product management
   - Order management  
3. Design schemas to cover realistic use cases.  
4. Add **CRUD operations** for products and orders.  
5. Make the two services **communicate** and use that to create orders.

**What is implemented**

- Two separate Nest.js apps under `backend/`:
  - `product-service`
  - `order-service`

- **Microservice capability**
  - `product-service` runs:
    - An HTTP REST API on port `3001`.
    - A **TCP microservice listener** on port `8877` (configurable with `PRODUCT_MICROSERVICE_PORT`).
  - `order-service` runs:
    - An HTTP REST API on port `3002`.
    - A **TCP client** using `ClientsModule` to call the product microservice.

- **Schemas**
  - Product:
    - `id`, `name`, `description`, `price`, `stock`, `active`, `createdAt`, `updatedAt`.
  - Order:
    - `id`, `customerName`, `customerEmail`, `items[]`, `status`, `totalAmount`, `createdAt`, `updatedAt`.
    - Each `item` has `productId` and `quantity`.

- **CRUD APIs**
  - Product service:
    - `POST /products`
    - `GET /products`
    - `GET /products/:id`
    - `PATCH /products/:id`
    - `DELETE /products/:id`
  - Order service:
    - `POST /orders`
    - `GET /orders`
    - `GET /orders/:id`
    - `PATCH /orders/:id`
    - `DELETE /orders/:id`

- **Inter‑service communication**
  - Product service exposes a microservice handler:
    - `@MessagePattern({ cmd: 'get-product-by-id' })`
  - Order service, when creating an order:
    - Uses the TCP client to call `get-product-by-id` for each `productId`.
    - Uses the product **price** to compute the `totalAmount`.
  - This satisfies:
    - “Create a product and create the order with the product created.”
    - “Create a GET API where we can see the created orders and products of orders”:
      - Products: `GET /products`
      - Orders: `GET /orders` (shows `items` with `productId` and totals).

All validation is done with `class-validator` (DTOs) + Nest global `ValidationPipe`.

---

### Frontend – Next.js + TypeScript + Material UI

**What the assignment asked**

1. Create a **Signup form** with fields:
   - Full Name
   - Email
   - Gender
2. Use **React Hook Form** for proper validation.  
3. Make fields **dynamic from JSON** (given in the assignment).  
4. Components must change automatically when:
   - `fieldType` changes between `"TEXT"`, `"LIST"`, `"RADIO"`.
   - Label / default value / required flag changes.
5. Use **Material UI** for a clean, responsive UI.  
6. Use **local storage or JSON** for data persistence.

**What is implemented**

- Tech stack:
  - Next.js App Router (TypeScript).
  - Material UI (`@mui/material`, icons, emotion).
  - `react-hook-form` for form state and validation.

- **Dynamic JSON config**
  - In `frontend/src/app/page.tsx`, there is a `FORM_CONFIG` object that uses the same shape as the provided JSON:
    - Each field has: `id`, `name`, `fieldType`, `minLength`, `maxLength`, `defaultValue`, `required`, `listOfValues1`.
  - Fields are rendered by looping over `FORM_CONFIG.data`.
  - If you change:
    - `"Full Name"` → `"Name"`,
    - `required: true/false`,
    - `fieldType: "TEXT" | "LIST" | "RADIO"`,
    - `listOfValues1` options,
    the UI will update automatically.

- **Component behaviour by `fieldType`**
  - `"TEXT"` → MUI `TextField`.
  - `"LIST"` → MUI `Select` with `MenuItem`s from `listOfValues1`.
  - `"RADIO"` → MUI `RadioGroup` with `FormControlLabel`s from `listOfValues1`.

- **Validation (React Hook Form)**
  - Uses `Controller` for each field.
  - `required` from JSON → `rules.required` with a message.
  - `minLength`, `maxLength` from JSON → length validation and messages.
  - Error text is shown under each field using `helperText` / `FormHelperText`.

- **Styling and responsiveness**
  - Layout uses `Container`, `Box`, `Paper`, `Stack`, `Typography`.
  - Full‑height, centered layout with a modern card UI for the form.
  - Buttons use primary/secondary MUI styles; colors and spacing are tuned for a clean look.

- **Data persistence and “Previous Submissions” UI**
  - After submit:
    - Form values + a timestamp are saved to `localStorage` with key `dynamic-signup-submissions`.
    - The form resets to default values from the JSON.
  - “Recent Submissions (from localStorage)” section:
    - Reads all saved submissions from localStorage.
    - Shows them in reverse order (most recent first).
    - Each entry card shows:
      - Submitted time and day (e.g., `Submitted: 3:45 PM – Today`).
      - Full Name, Email, Gender, Love React? in a clean layout similar to the provided screenshot.

This covers:

- Required fields: **Full Name, Email, Gender**.  
- Extra field: **Love React?** using `"RADIO"`, as shown in the example JSON.
- Validation, dynamic rendering, Material UI styling, and localStorage persistence.

---

### How to read/modify quickly

- To change the form behaviour (labels, required, field type, options), edit only the `FORM_CONFIG` object in `frontend/src/app/page.tsx`.  
- To test microservice communication:
  - Start both backend services.
  - `POST /products` to create a product.
  - `POST /orders` with that `productId`.
  - `GET /orders` and `GET /products` to see the data.

