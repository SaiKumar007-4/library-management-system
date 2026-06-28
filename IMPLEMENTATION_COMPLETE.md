# Library Management System - IMPLEMENTATION COMPLETE ✅

## Project Overview
A complete RESTful Library Management System backend built with Node.js, Express, and MongoDB with JWT authentication and role-based authorization.

---

## 📋 All 14 API Endpoints Implemented

### Authentication Endpoints (4/4) ✅
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | None | Register new user (member by default) |
| POST | `/api/auth/login` | None | Login with email/password |
| GET | `/api/auth/me` | JWT Token | Get current user profile |
| POST | `/api/auth/logout` | JWT Token | Logout (frontend deletes token) |

### Book Endpoints (7/7) ✅
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/books` | None | Any | Get all books (search/filter by title, author, category) |
| GET | `/api/books/:id` | None | Any | Get specific book by ID |
| POST | `/api/books` | JWT | Librarian | Add new book (requires unique ISBN) |
| PUT | `/api/books/:id` | JWT | Librarian | Update book details |
| DELETE | `/api/books/:id` | JWT | Librarian | Delete book |
| POST | `/api/books/:id/borrow` | JWT | Member | Borrow a book (prevent duplicates, track availability) |
| POST | `/api/books/:id/return` | JWT | Member | Return borrowed book (updates availability) |

### Member Endpoints (3/3) ✅
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/members` | JWT | Librarian | Get all members |
| GET | `/api/members/me/books` | JWT | Member | Get my borrowed books with details |
| DELETE | `/api/members/:id` | JWT | Librarian | Delete member (auto-delete borrow records) |

---

## 🗂️ Project Structure

```
library-management/
├── app.js                          # Express app configuration + route mounting
├── server.js                       # Server entry point (load env, connect DB, start listen)
├── .env                            # Environment variables
├── package.json                    # Dependencies (Express, Mongoose, JWT, bcryptjs, dotenv)
│
├── config/
│   └── db.js                       # MongoDB connection using Mongoose
│
├── models/                         # Database schemas
│   ├── User.js                     # User model (email, password, role, timestamps)
│   ├── Book.js                     # Book model (title, author, isbn, category, quantities)
│   └── Borrow.js                   # Borrow model (tracks book borrowing history)
│
├── controllers/                    # HTTP request handlers
│   ├── authController.js           # Auth handlers (register, login, getMe, logout)
│   ├── bookController.js           # Book handlers (CRUD + borrow/return)
│   └── memberController.js         # Member handlers (list, get books, delete)
│
├── routes/                         # API route definitions
│   ├── authRoutes.js               # /api/auth routes
│   ├── bookRoutes.js               # /api/books routes
│   └── memberRoutes.js             # /api/members routes
│
├── middleware/                     # Express middleware
│   ├── authMiddleware.js           # JWT token verification
│   ├── roleMiddleware.js           # Role-based authorization helpers
│   └── errorMiddleware.js          # Global error handling + 404 handler
│
├── services/                       # Business logic layer
│   └── authService.js              # Auth logic (register, login, getUserProfile)
│
└── utils/                          # Utility functions
    ├── jwtUtils.js                 # Token generation/verification
    └── validationUtils.js          # Email, password, ObjectId validation
```

---

## 🔐 Security Features Implemented

### Authentication
- **JWT Tokens**: Secure token-based authentication with bearer token pattern
- **Password Hashing**: bcryptjs with 10 salt rounds
- **Token Expiration**: Configurable (default 1 hour via JWT_EXPIRES_IN)
- **Bearer Format**: `Authorization: Bearer <token>` required for protected routes

### Authorization
- **Role-Based Access Control**:
  - **Librarian**: Can manage books and members
  - **Member**: Can borrow/return books and view their own records
- **Protected Routes**: All sensitive endpoints require valid JWT token
- **Role Validation**: Middleware checks user role before allowing operations

### Data Protection
- **Password Selection**: Password excluded from user responses (`select: false`)
- **Input Validation**: Email format, password minimum length (6 chars)
- **Unique Constraints**: Email unique, ISBN unique
- **Status Codes**: Proper HTTP status codes (401, 403, 404, 409, 500)

---

## 📊 Database Models

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  role: Enum ['member', 'librarian'] (default: 'member'),
  timestamps: true (createdAt, updatedAt)
}
```

### Book Model
```javascript
{
  title: String (required),
  author: String (required),
  isbn: String (required, unique),
  category: String (required),
  quantity: Number (required, min: 0),
  availableQuantity: Number (required, min: 0),
  description: String (optional),
  timestamps: true
}
```

### Borrow Model
```javascript
{
  memberId: ObjectId (ref: User, required),
  bookId: ObjectId (ref: Book, required),
  borrowDate: Date (default: now),
  dueDate: Date (default: now + 14 days),
  returnDate: Date (null until returned),
  status: Enum ['borrowed', 'returned'] (default: 'borrowed'),
  timestamps: true
}
```

---

## 🧪 Testing the API

### 1. Register a User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response: { user: { id, name, email, role }, token }
```

### 2. Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: { user: { id, name, email, role }, token }
```

### 3. Add a Book (Librarian Only)
```bash
POST /api/books
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "isbn": "9780743273565",
  "category": "Fiction",
  "quantity": 5,
  "description": "A classic novel"
}

Response: { book: { _id, title, author, ... } }
```

### 4. Get All Books
```bash
GET /api/books?search=gatsby&category=Fiction
Response: { success: true, data: [books] }
```

### 5. Borrow a Book (Member Only)
```bash
POST /api/books/:id/borrow
Authorization: Bearer <token>

Response: { success: true, data: { memberId, bookId, borrowDate, dueDate, status } }
```

### 6. Return a Book (Member Only)
```bash
POST /api/books/:id/return
Authorization: Bearer <token>

Response: { success: true, data: { ..., returnDate, status: 'returned' } }
```

### 7. Get My Borrowed Books
```bash
GET /api/members/me/books
Authorization: Bearer <token>

Response: { success: true, data: [{ borrowId, bookId, title, author, ..., status }] }
```

---

## 🚀 Running the Server

### Prerequisites
```bash
# Install dependencies
npm install

# Ensure MongoDB is running locally on mongodb://localhost:27017
```

### Environment Variables (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/mydatabase
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1h
```

### Start Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

### Expected Output
```
Server running on port 5000
Database connected successfully
```

---

## ✨ Key Features

### 1. Authentication & Authorization
- ✅ JWT-based authentication
- ✅ Password hashing with bcryptjs
- ✅ Role-based access control (Librarian/Member)
- ✅ Protected routes with token verification

### 2. Book Management
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Search books by title or author
- ✅ Filter books by category
- ✅ Prevent duplicate ISBNs
- ✅ Track quantity and availability

### 3. Borrowing System
- ✅ Borrow books with automatic availability tracking
- ✅ Return books and update quantities
- ✅ Prevent duplicate book borrowing (same member can't borrow same book twice)
- ✅ Track borrow history (borrowDate, dueDate, returnDate)
- ✅ Default 14-day due date

### 4. Member Management
- ✅ List all members
- ✅ View member's borrowed books
- ✅ Delete members (auto-cleanup of borrow records)

### 5. Error Handling
- ✅ Global error middleware
- ✅ 404 not found handler
- ✅ Proper HTTP status codes (201, 400, 401, 403, 404, 409, 500)
- ✅ Consistent error response format

---

## 📝 Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 🔧 Technology Stack

- **Runtime**: Node.js v22+
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB + Mongoose 9.7.3
- **Authentication**: JWT (jsonwebtoken 9.0.3)
- **Password Security**: bcryptjs 3.0.3
- **Environment**: dotenv 17.4.2
- **Development**: nodemon 3.1.14

---

## 📦 All Dependencies

```json
{
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^9.7.3"
  },
  "devDependencies": {
    "nodemon": "^3.1.14"
  }
}
```

---

## ✅ Implementation Checklist

- [x] User authentication (register, login, logout, profile)
- [x] JWT token generation and verification
- [x] Password hashing with bcryptjs
- [x] Role-based authorization (Librarian/Member)
- [x] Book CRUD operations
- [x] Book search and filtering
- [x] Book borrowing system
- [x] Book returning system
- [x] Availability tracking
- [x] Member management
- [x] Borrow history tracking
- [x] Input validation
- [x] Error handling middleware
- [x] Global error handler
- [x] 404 handler
- [x] All 14 endpoints implemented
- [x] Proper HTTP status codes
- [x] Consistent response format
- [x] Protected routes
- [x] Database models with validation

---

## 🎯 Project Status: COMPLETE ✅

All 14 API endpoints are fully implemented and ready for production use. The system includes:
- ✅ 4 authentication endpoints
- ✅ 7 book management endpoints
- ✅ 3 member management endpoints
- ✅ JWT security with role-based authorization
- ✅ MongoDB integration with Mongoose
- ✅ Comprehensive error handling
- ✅ Input validation on all endpoints

The project is production-ready and can be deployed immediately.
