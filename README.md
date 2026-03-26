# SkillBridge — Backend Server

<p align="center">
  <strong>A production-grade REST API for connecting students with expert tutors.</strong><br/>
  Built with Node.js · Express · TypeScript · Prisma · PostgreSQL
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat-square&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" />
</p>

---

## 📖 Overview

SkillBridge is an online tutoring marketplace that allows students to discover, book, and review expert tutors. This repository is the **backend API server** powering the entire platform — handling authentication, user role management, tutor profiles, bookings, and reviews.

**Live API:** [https://skillbridge-server-nu.vercel.app](https://skillbridge-server-nu.vercel.app)  
**Frontend Client:** [https://skillbridge-client-coral.vercel.app](https://skillbridge-client-coral.vercel.app)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (v18+) |
| Framework | Express.js |
| Language | TypeScript 5.x |
| ORM | Prisma 7.x |
| Database | PostgreSQL (Neon) |
| Auth | Better Auth |
| Validation | Zod |
| Security | CORS, HTTP-only Cookies |
| Deployment | Vercel (Serverless) |

---

## ✨ Features

- 🔐 **Secure Authentication** — Email/password sign-up & sign-in via Better Auth with HTTP-only session cookies
- 👥 **Role-Based Access Control** — Three roles: `STUDENT`, `TUTOR`, and `ADMIN` with route-level enforcement
- 🧑‍🏫 **Tutor Profiles** — Bio, headline, subjects, hourly rate, experience, and availability schedule
- 📅 **Booking System** — Full lifecycle management: `PENDING → CONFIRMED → COMPLETED / CANCELLED`
- ⭐ **Reviews & Ratings** — Students rate completed sessions; tutor average ratings computed dynamically
- 🛡️ **Admin Dashboard** — Platform-wide stats, user management, ban/unban, and category control
- 🌐 **Production-Ready** — Centralized error handling, structured JSON responses, serverless-compatible build

---

## 📁 Project Structure

```
SkillBridge-server/
├── api/
│   └── index.ts              # Vercel serverless entry point
├── prisma/
│   └── schema.prisma         # Database schema (User, TutorProfile, Booking, Review, Category)
├── src/
│   ├── server.ts             # Local HTTP server bootstrap
│   ├── app.ts                # Express app config (CORS, parsers, routes)
│   ├── lib/
│   │   ├── auth.ts           # Better Auth instance & trustedOrigins
│   │   └── prisma.ts         # Prisma client singleton
│   ├── middlewares/
│   │   ├── auth.ts           # requireAuth middleware (session verification)
│   │   └── globalErrorHandler.ts
│   ├── modules/
│   │   ├── admin/            # Admin stats, user management
│   │   ├── booking/          # Booking CRUD & status transitions
│   │   ├── category/         # Learning categories
│   │   ├── review/           # Ratings & reviews
│   │   ├── tutor/            # Tutor profiles & availability
│   │   └── user/             # Current user profile
│   └── types/                # Shared TypeScript types
├── .env                      # Environment variables (not committed)
├── package.json
├── tsconfig.json
└── vercel.json               # Vercel deployment config
```

Each module follows a **Router → Service → (Prisma)** layered pattern for clean separation of concerns.

---

## 🔌 API Overview

All responses follow a consistent JSON structure. Authentication is cookie-based via Better Auth.

### 🔓 Auth — `/api/auth/*`
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/sign-up/email` | Register new user |
| `POST` | `/api/auth/sign-in/email` | Login |
| `POST` | `/api/auth/sign-out` | Logout |
| `GET` | `/api/auth/get-session` | Get current session |

### 👩‍🏫 Tutors — `/api/tutors`
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tutors` | List all tutors (paginated, filterable) |
| `GET` | `/api/tutors/:id` | Get single tutor profile |
| `PATCH` | `/api/tutor/profile` | Update own profile *(Tutor only)* |
| `GET/PUT` | `/api/tutor/availability` | Manage schedule *(Tutor only)* |

### 📅 Bookings — `/api/bookings`
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/bookings` | Create booking *(Student only)* |
| `GET` | `/api/bookings` | Get my bookings (role-aware) |
| `PATCH` | `/api/bookings/:id` | Update booking status |

### ⭐ Reviews — `/api/reviews`
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/reviews/:tutorId` | Get reviews for a tutor |
| `POST` | `/api/reviews` | Leave a review *(Student only)* |

### 🛡️ Admin — `/api/admin`
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/stats` | Platform metrics |
| `GET` | `/api/admin/users` | All users (paginated) |
| `PATCH` | `/api/admin/users/:id` | Change role or ban user |
| `POST` | `/api/categories` | Create category |

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+
- PostgreSQL database (local or cloud, e.g. [Neon](https://neon.tech))

### 1. Clone & Install

```bash
git clone https://github.com/Rayhan-50/SkillBridge-server.git
cd SkillBridge-server
npm install
```

### 2. Configure Environment

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?sslmode=require"
PORT=4000
BETTER_AUTH_SECRET="your_highly_secure_random_secret"
BETTER_AUTH_URL="http://localhost:4000/api/auth"
APP_URL="http://localhost:4000"
CLIENT_URL="http://localhost:3000"
APP_USER="admin@example.com"
APP_PASS="your_email_app_password"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

### 3. Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed admin account and categories
npx tsx src/scripts/seedAdmin.ts
npx tsx src/scripts/seedData.ts
```

> Default admin credentials after seeding: `admin@skillbridge.com` / `password123`

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot-reload (`tsx watch`) |
| `npm run build` | Generate Prisma client & compile TypeScript |
| `npm run start` | Run compiled production server (`dist/server.js`) |

---

## 🚀 Deployment

This server is deployed as a **serverless function on Vercel**.

### Required Vercel Environment Variables

Set these in your Vercel project → **Settings → Environment Variables**:

```env
DATABASE_URL=<your_neon_connection_string>
BETTER_AUTH_SECRET=<your_secret>
BETTER_AUTH_URL=https://skillbridge-server-nu.vercel.app/api/auth
APP_URL=https://skillbridge-server-nu.vercel.app
CLIENT_URL=https://skillbridge-client-coral.vercel.app
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
```

### Deploy

Push to the `main` branch — Vercel auto-deploys on every push.

```bash
git add .
git commit -m "chore: deploy update"
git push origin main
```

---

## 🔮 Future Improvements

- [ ] Real-time notifications (WebSockets / SSE) for booking status updates
- [ ] Payment integration (Stripe) for booking payments
- [ ] Video call scheduling with calendar sync
- [ ] Rate limiting & API key management
- [ ] Comprehensive unit & integration test suite (Jest + Supertest)
- [ ] Swagger / OpenAPI documentation

---

## 👤 Author

**Rayhan**  
📧 rayhanahmed.nstu@gmail.com  
🔗 [GitHub](https://github.com/Rayhan-50)

---

<p align="center">Made with ❤️ for the SkillBridge platform</p>
