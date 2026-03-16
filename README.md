## Order Management Dashboard

Simple full‑stack order management dashboard built with **React + Vite + TailwindCSS + TypeScript** on the frontend and **Node.js + Express + TypeScript + Sequelize + MySQL** on the backend.

### Tech Stack

- **Frontend**: Vite, React, React Router, TypeScript, TailwindCSS, Axios  
- **Backend**: Node.js, Express, TypeScript, Sequelize ORM, MySQL  
- **Other**: dotenv for configuration, Sequelize migrations, simple service/controller routing structure

### Project Structure

- **`backend`** – REST API for managing orders  
  - `src/config` – environment + database configuration  
  - `src/models` – Sequelize models (`Order`)  
  - `src/migrations` – database migrations for `orders` table  
  - `src/services` – business logic (`orderService`)  
  - `src/controllers` – request handlers (`orderController`)  
  - `src/routes` – Express routes (`orderRoutes`)  
  - `src/middleware` – error handling and request validation  
  - `src/app.ts` – Express app setup  
  - `src/server.ts` – server bootstrap (DB connection + app start)

- **`frontend`** – dashboard UI  
  - `src/pages` – `OrdersPage`, `OrderDetailsPage`  
  - `src/components` – reusable UI pieces (layout card, status badge, etc.)  
  - `src/services` – API client with Axios  
  - `src/types` – shared TypeScript types  
  - `src/App.tsx` / `src/main.tsx` – routing and app shell

---

## Backend – Setup & Usage

### 1. Prerequisites

- Node.js 18+  
- MySQL server running locally (or reachable remotely)

### 2. Configure Environment

In the `backend` folder, create a `.env` file:

```bash
PORT=4000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=order_dashboard
```

Create the database in MySQL:

```sql
CREATE DATABASE order_dashboard CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Install Dependencies

From the `backend` directory:

```bash
npm install
```

### 4. Run Migrations

Still in the `backend` directory, run:

```bash
npx sequelize-cli db:migrate
```

This creates the `orders` table using the migration under `src/migrations`.

### 5. Start the Backend

Development:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm start
```

The API will be available at `http://localhost:4000`.

### 6. API Overview

Base URL: `http://localhost:4000`

- **GET `/orders`**
  - Returns list of orders.
  - Optional query params:
    - `status` – `Pending` or `Completed`
    - `search` – substring match on `customerName`

- **GET `/orders/:id`**
  - Returns a single order by numeric `id`.

- **POST `/orders`**
  - Creates a new order.
  - Body:
    ```json
    {
      "orderId": "ORD-1001",
      "customerName": "Jane Doe",
      "status": "Pending",
      "totalPrice": 123.45
    }
    ```

- **PATCH `/orders/:id`**
  - Partially updates an order (`status`, `totalPrice`, etc.).
  - Example body:
    ```json
    {
      "status": "Completed",
      "totalPrice": 150.0
    }
    ```

All responses follow the shape:

```json
{
  "success": true,
  "data": { }
}
```

Errors follow:

```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "details": "More info if available"
  }
}
```

Input validation is done in simple validator functions under `src/validation`, wired via middleware.

---

## Frontend – Setup & Usage

### 1. Configure Environment

In the `frontend` folder, create a `.env` file:

```bash
VITE_API_BASE_URL=http://localhost:4000
```

### 2. Install Dependencies

From the `frontend` directory:

```bash
npm install
```

### 3. Start the Frontend

```bash
npm run dev
```

The app will be served at `http://localhost:5173`.

Make sure the backend is running on port `4000` (or adjust `VITE_API_BASE_URL` accordingly).

---

## Frontend Features

- **Orders Dashboard Page**
  - Table of all orders with columns:
    - Order ID  
    - Customer Name  
    - Status (with colored badge)  
    - Total Price  
    - Action (View details)
  - **Filters**
    - Status dropdown: `All`, `Pending`, `Completed`
    - Free‑text search by customer name
  - Uses Axios service (`src/services/api.ts`) with a consistent `ApiResponse<T>` type.

- **Order Details Page**
  - Accessed via `/orders/:id`.
  - Shows:
    - Order ID  
    - Customer name  
    - Status  
    - Total price  
    - Created at / Updated at timestamps
  - Back link to the main orders table.

The UI is built with TailwindCSS and uses a dark, card‑based layout for clarity and simplicity.

---

## Design & Code Structure Notes

- **Separation of concerns**
  - Controllers handle HTTP/Express logic only.
  - Services (`orderService`) encapsulate data access and business rules using Sequelize.
  - Models are defined once and reused in services/controllers.
  - Validation is handled via dedicated validator functions plus `validateRequest` middleware.

- **Error handling**
  - Centralized `errorHandler` middleware normalizes API error responses.
  - Known validation errors return `400`, missing entities return `404`, and unexpected issues bubble to `500`.

- **Environment configuration**
  - Backend `env.ts` wraps `dotenv` and provides typed configuration.
  - Frontend reads `VITE_API_BASE_URL` for easy switching between environments.

- **Optional Extensions**
  - Add authentication middleware and protect the `/orders` routes.
  - Implement pagination by extending the `GET /orders` endpoint and adjusting the UI.
  - Deploy backend (e.g., on a Node hosting provider) and frontend (e.g., static hosting) and point `VITE_API_BASE_URL` to the deployed API URL.

