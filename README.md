# ProfitFlow Shop Manager

Production-ready JavaScript full-stack SaaS starter for small shop owners to track sales, expenses, inventory, profits, reports, analytics, and alerts.

## Stack

- Frontend: Next.js 15 App Router, JavaScript, Tailwind CSS, Axios, React Hook Form, Recharts, Context API
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, Bcrypt, REST APIs

## Setup

```bash
cd backend && npm install
cd ../frontend && npm install
```

Copy env files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Seed demo data:

```bash
cd backend
npm run seed
```

Demo login: `demo@profitflow.app` / `password123`

Run:

```bash
cd backend && npm run dev
cd frontend && npm run dev
```

Frontend: http://localhost:3000
Backend health: http://localhost:5000/health

## API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `GET /api/dashboard/summary`
- `GET|POST /api/sales`
- `PUT|DELETE /api/sales/:id`
- `GET|POST /api/expenses`
- `PUT|DELETE /api/expenses/:id`
- `GET|POST /api/products`
- `PUT|DELETE /api/products/:id`
- `PATCH /api/products/:id/stock`
- `GET /api/reports/sales`
- `GET /api/reports/expenses`
- `GET /api/reports/profit`
- `GET /api/reports/inventory`
- `GET /api/analytics`
- `GET /api/notifications`

## Profit Formulas

- `profit = sales - expenses`
- `grossProfit = sales - purchaseCost`
- `netProfit = grossProfit - expenses`
- `profitMargin = (netProfit / sales) * 100`
- `expensePercentage = (expenses / sales) * 100`

## Security

The backend uses Helmet, CORS allow-listing, MongoDB sanitization, rate limiting, JWT auth middleware, bcrypt hashing, Mongoose validation, and centralized error handling. Set a strong `JWT_SECRET` before production deployment.
