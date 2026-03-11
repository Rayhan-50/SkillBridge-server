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



killBridge API Testing Guide (Postman)
This walkthrough documents exactly how to test all Backend APIs for the SkillBridge project using Postman.

Pre-requisites
The server must be running on your local machine using npm run dev at http://localhost:3000.
The Database should be seeded using the scripts 
seedAdmin.ts
 and 
seedData.ts
. If not, run npx tsx src/scripts/seedAdmin.ts.
1. Authentication (better-auth)
Since we are using better-auth, all authentication is handled via their default endpoints under /api/auth/. We test 3 roles: STUDENT, TUTOR, and ADMIN.

A. Register as a Student
Method: POST
URL: http://localhost:3000/api/auth/sign-up/email
Body (JSON):
json
{
  "email": "student@example.com",
  "password": "password123",
  "name": "Jane Student",
  "role": "STUDENT"
}
B. Register as a Tutor
Method: POST
URL: http://localhost:3000/api/auth/sign-up/email
Body (JSON):
json
{
  "email": "tutor@example.com",
  "password": "password123",
  "name": "John Tutor",
  "role": "TUTOR"
}
C. Login (Sign In)
Method: POST
URL: http://localhost:3000/api/auth/sign-in/email
Body (JSON):
json
{
  "email": "student@example.com",
  "password": "password123"
}
Postman Setup Note: When you login successfully, better-auth sets an HTTP-only session cookie (usually better-auth.session_token). Postman will automatically capture and attach this cookie natively on subsequent requests.
To switch users: Clear cookies in Postman (Cookies > localhost > Delete better-auth.session_token), and then log in using a different account.
Admin Login: We seeded an admin at admin@skillbridge.com with password password123. Log in with this to test Admin routes.
2. Public Endpoints (No Auth Required)
Get Categories
Method: GET
URL: http://localhost:3000/api/categories
Get All Tutors (Search/Filter/Paginate)
Method: GET
URL: http://localhost:3000/api/tutors?page=1&limit=10&sortBy=hourlyRate&sortOrder=asc
Get Single Tutor by ID
Method: GET
URL: http://localhost:3000/api/tutors/{{tutor-user-id}}
Get Tutor Reviews
Method: GET
URL: http://localhost:3000/api/reviews/{{tutor-user-id}}
3. Student Routes (Requires Student Login)
Note: Sign in as 
student@example.com
 first.

Get My Profile
Method: GET
URL: http://localhost:3000/api/me
Create a Booking
Method: POST
URL: http://localhost:3000/api/bookings
Body (JSON):
json
{
  "tutorId": "{{tutor-user-id}}",
  "date": "2026-12-01T00:00:00.000Z",
  "startTime": "10:00",
  "endTime": "11:00",
  "price": 50,
  "notes": "I need help with React Hooks."
}
Get My Bookings (As a Student)
Method: GET
URL: http://localhost:3000/api/bookings (This endpoint automatically detects role and fetches your student bookings)
Complete a Booking
Method: PATCH
URL: http://localhost:3000/api/bookings/{{booking-id}}
Body (JSON):
json
{
  "status": "COMPLETED"
}
Leave a Review
Method: POST
URL: http://localhost:3000/api/reviews
Body (JSON):
json
{
  "tutorId": "{{tutor-user-id}}",
  "bookingId": "{{booking-id}}",
  "rating": 5,
  "comment": "Amazing session! Highly recommend."
}
4. Tutor Routes (Requires Tutor Login)
Note: Sign in as 
tutor@example.com
 first.

Get My Profile (with Tutor Profile data)
Method: GET
URL: http://localhost:3000/api/me
Update Tutor Profile
Method: PATCH
URL: http://localhost:3000/api/tutor/profile
Body (JSON):
json
{
  "bio": "Expert JavaScript developer.",
  "headline": "Senior Full-stack Engineer",
  "hourlyRate": 60,
  "subjects": ["JavaScript", "React", "Node.js"],
  "location": "Online",
  "experienceYears": 5
}
Add/Update Availability
Method: PUT
URL: http://localhost:3000/api/tutor/availability
Body (JSON):
json
{
  "schedule": {
    "monday": ["09:00", "15:00"],
    "wednesday": ["10:00", "12:00"]
  }
}
Get Bookings (As a Tutor)
Method: GET
URL: http://localhost:3000/api/bookings (Automatically fetches bookings where you are the tutor)
Confirm a Booking
Method: PATCH
URL: http://localhost:3000/api/bookings/{{booking-id}}
Body (JSON):
json
{
  "status": "CONFIRMED"
}
5. Admin Routes (Requires Admin Login)
Note: Sign in as 
admin@skillbridge.com
 first.

Get Dashboard Statistics
Method: GET
URL: http://localhost:3000/api/admin/stats
Manage Users (Get All Users)
Method: GET
URL: http://localhost:3000/api/admin/users?page=1&limit=20
Ban/Unban or Change Role for User
Method: PATCH
URL: http://localhost:3000/api/admin/users/{{any-user-id}}
Body (JSON):
json
{
  "status": "BANNED",
  "role": "STUDENT"
}
(Valid statuses: 'ACTIVE', 'BANNED')

Create a New Category
Method: POST
URL: http://localhost:3000/api/categories
Body (JSON):
json
{
  "name": "Data Science",
  "slug": "data-science",
  "description": "Learn Data Science & ML",
  "iconUrl": "https://example.com/icon.png"
}
How better-auth verifies sessions
The 
requireAuth
 middleware implemented in 
middlewares/auth.ts
 intercepts incoming requests, strips the HTTP Cookie sent from Postman, and verifies it with the database. Because it is robust, any request sent using the examples above with the matching active auth cookie will authorize correctly.


Comment
Ctrl+Alt+M

