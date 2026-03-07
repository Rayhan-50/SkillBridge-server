# SkillBridge - Backend Server

SkillBridge is an educational platform designed to connect students with expert tutors. This repository contains the backend server application built with Node.js, Express, TypeScript, and Prisma ORM connecting to a PostgreSQL database.

## Technologies Used

*   **Node.js & Express**: Core framework for building RESTful APIs.
*   **TypeScript**: Strongly-typed JavaScript for better developer experience and reliability.
*   **Prisma ORM**: Modern database toolkit and query builder for PostgreSQL.
*   **PostgreSQL**: Relational database for persistent storage.
*   **Better-Auth**: Extensible authentication library handling sessions, users, and roles.
*   **Zod**: TypeScript-first schema declaration and data validation.
*   **CORS & Helmet**: Security middlewares.

## Features

*   **Role-Based Access Control**: Supports `STUDENT`, `TUTOR`, and `ADMIN` roles natively.
*   **Authentication**: Secure email/password login integrated with `better-auth`.
*   **Tutor Management**: Fetch tutor profiles, update availability, filter by subjects/price.
*   **Booking System**: Create, retrieve, and manage tutoring sessions (PENDING, CONFIRMED, COMPLETED, CANCELLED).
*   **Reviews & Ratings**: Leave ratings for completed sessions, calculate average tutor ratings dynamically.
*   **Admin Dashboard**: Manage users, ban members, and organize learning categories.

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

*   [Node.js](https://nodejs.org/) (v18 or higher)
*   [PostgreSQL](https://www.postgresql.org/) (Running locally or via a cloud provider)

### Installation

1.  **Clone the repository** (or navigate to the project directory):
    ```bash
    cd SkillBridge-server
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Variables**:
    Create a `.env` file in the root directory and configure it as follows:

    ```env
    DATABASE_URL="postgresql://postgres:<YOUR_DB_PASSWORD>@localhost:5432/skillbridge?schema=public"
    PORT=3000
    BETTER_AUTH_SECRET="your_highly_secure_random_string"
    BETTER_AUTH_URL="http://localhost:3000"
    APP_URL="http://localhost:4000" # URL of the Next.js frontend
    ```

### Database Setup

1.  **Generate Prisma Client**:
    ```bash
    npx prisma generate
    ```

2.  **Push the Schema to the Database**:
    *(This command syncs your database schema with Prisma without needing migrations)*
    ```bash
    npx prisma db push
    ```

3.  **Seed Initial Data (Admin & Categories)**:
    Run the seed scripts to populate the database with a default Admin account and initial learning categories.
    ```bash
    npx tsx src/scripts/seedAdmin.ts
    npx tsx src/scripts/seedData.ts
    ```
    *Note: The default admin credentials are `admin@skillbridge.com` / `password123`.*

---

## Running the Application

### Development Mode

Run the following command to start the server in watch mode using `tsx`. It will automatically reload upon code changes.

```bash
npm run dev
```

The server will start at `http://localhost:3000`.

### Production Build

1.  **Compile TypeScript to JavaScript**:
    ```bash
    npm run build
    ```

2.  **Start the Server**:
    ```bash
    npm run start
    ```

---

## API Overview

Authentication is handled natively at `/api/auth/*` via `better-auth`.

### Tutors
*   `GET /api/tutors` - Fetch all tutors (supports pagination & filtering).
*   `GET /api/tutors/:id` - Fetch single tutor details.
*   `PATCH /api/tutor/profile` - Update own tutor profile (TUTOR role required).
*   `GET/PUT /api/tutor/availability` - Manage schedule (TUTOR role required).

### Bookings
*   `POST /api/bookings` - Request a slot (STUDENT role required).
*   `GET /api/bookings` - Retrieve current user's bookings.
*   `PATCH /api/bookings/:id` - Update booking status to `CONFIRMED` or `COMPLETED`.

### Reviews
*   `GET /api/reviews/:tutorId` - Fetch all reviews for a specific tutor.
*   `POST /api/reviews` - Add a rating to a completed session (STUDENT role required).

### Admin
*   `GET /api/admin/stats` - Platform metrics.
*   `GET /api/admin/users` - Paginated user listing.
*   `PATCH /api/admin/users/:id` - Modify user roles or ban accounts.
*   `POST /api/categories` - Create new learning categories.

---

## Error Handling
The application uses a centralized global error handler mapped through Express. It captures `ZodError` for validation failures, Prisma exceptions for database uniqueness constraints, and standard application errors, returning a structured JSON format consistently across all endpoints.

## License
MIT License.
