# Library Management System API

A RESTful backend application for managing a Library Management System with role-based authentication and authorization.

## Overview

This project provides backend APIs for managing books and library members.
The system supports two user roles:

* **Librarian**
* **Member**

### Librarian Permissions

* Manage books
* View all members
* Delete members

### Member Permissions

* View books
* Borrow books
* Return books
* View borrowed books

---

## Tech Stack

* **Backend:** Node.js + Express.js
* **Database:** MongoDB
* **Authentication:** JWT (JSON Web Token)
* **Password Hashing:** bcryptjs

---

## Project Structure

```bash
library-management/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── bookController.js
│   └── memberController.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
│
├── models/
│   ├── User.js
│   ├── Book.js
│   └── Borrow.js
│
├── routes/
│   ├── authRoutes.js
│   ├── bookRoutes.js
│   └── memberRoutes.js
│
├── app.js
├── server.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/library-management-system.git
cd library-management-system
```

### Install Dependencies

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in root directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## Running the Project

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

Server runs on:

```bash
http://localhost:5000
```

---

## Database Setup

This project uses MongoDB.

Collections:

* Users
* Books
* Borrows

### User Schema

* name
* email
* password
* role

### Book Schema

* title
* author
* isbn
* category
* quantity
* availableQuantity

### Borrow Schema

* memberId
* bookId
* borrowDate
* returnDate
* status

---

# API Documentation

---

## Authentication APIs

### Register Member

**POST** `/api/auth/register`

Request:

```json
{
  "name": "Rohith Kumar",
  "email": "rohith@gmail.com",
  "password": "password123",
  "role": "member"
}
```

---

### Login

**POST** `/api/auth/login`

Request:

```json
{
  "email": "rohith@gmail.com",
  "password": "password123"
}
```

Response:

```json
{
  "token": "jwt_token_here"
}
```

---

# Librarian APIs

Requires Librarian Token.

---

## Get All Members

**GET** `/api/members`

---

## Delete Member

**DELETE** `/api/members/:id`

---

## Add Book

**POST** `/api/books`

Request:

```json
{
  "title": "Atomic Habits",
  "author": "James Clear",
  "isbn": "123456789",
  "category": "Self Help",
  "quantity": 10,
  "availableQuantity": 10
}
```

---

## Get All Books

**GET** `/api/books`

---

## Get Book Details

**GET** `/api/books/:id`

---

## Update Book

**PUT** `/api/books/:id`

---

## Delete Book

**DELETE** `/api/books/:id`

---

# Member APIs

Requires Member Token.

---

## View Available Books

**GET** `/api/books`

---

## Borrow Book

**POST** `/api/books/:id/borrow`

Conditions:

* Book must be available
* Member cannot borrow same book twice without returning

---

## Return Book

**POST** `/api/books/:id/return`

Conditions:

* Member can only return borrowed books

---

## My Borrowed Books

**GET** `/api/members/me/books`

---

# Validation Rules

* Valid email format
* Password minimum length
* Required fields validation
* Invalid ID handling
* Duplicate email prevention
* Negative quantity validation

---

# Authorization Rules

### Members Cannot:

* Add books
* Update books
* Delete books
* Delete members

### Librarians Cannot:

* Borrow books
* Return books

---

# Error Handling

Example Error Response:

```json
{
  "success": false,
  "message": "Book is currently unavailable."
}
```

HTTP Status Codes Used:

* 200 → Success
* 201 → Created
* 400 → Bad Request
* 401 → Unauthorized
* 403 → Forbidden
* 404 → Not Found
* 500 → Server Error

---

# Deployment

Deployed using Render.

Live API URL:

```bash
https://your-live-api-url.onrender.com
```

---

# API Testing

Tested using:

* Postman

---

# Future Enhancements

* Pagination
* Search by title
* Search by author
* Filter by category
* Refresh Token Authentication

---

# Author

Developed by Rohith Kumar
