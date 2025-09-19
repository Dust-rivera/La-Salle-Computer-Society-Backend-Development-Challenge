# Products API Rivera

A RESTful API for managing a collection of products, built with Node.js, Express.js, and MySQL.

## Overview

This API allows clients to perform Create, Read, Update, and Delete (CRUD) operations on products stored in a MySQL database.  
It is designed for the La Salle Computer Society Backend Development Challenge

## Features

- Full CRUD operations for products
- Server-side input validation
- Graceful error handling with informative JSON responses
- MySQL database integration
- Unit and integration tests (Jest & Supertest)

## Technology Stack

- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **DB Driver:** mysql2
- **Testing:** Jest, Supertest

## Setup & Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Dust-rivera/Products-API-Rivera.git
   cd Products-API-Rivera
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure your environment variables:**
   - Copy `.env.example` to `.env` and fill in your MySQL credentials.
   - Example:
     ```
     MYSQL_HOST=127.0.0.1
     MYSQL_USER=your_mysql_user
     MYSQL_PASSWORD=your_mysql_password
     MYSQL_DATABASE=products_db
     PORT=3001
     ```

4. **Set up the database:**
   - Run the SQL in `schema.sql` on your MySQL server.

5. **Start the server:**
   ```sh
   npm run dev
   ```
   The API will be available at `http://localhost:3001`.

## Environment Variables

| Variable         | Description                |
|------------------|---------------------------|
| MYSQL_HOST       | MySQL server host         |
| MYSQL_USER       | MySQL username            |
| MYSQL_PASSWORD   | MySQL password            |
| MYSQL_DATABASE   | Database name             |
| PORT             | Server port (default: 3001)|

## API Endpoints

All responses are in JSON.

| Method | Endpoint         | Description                       | Success Response | Error Response |
|--------|------------------|-----------------------------------|------------------|---------------|
| POST   | `/products`      | Create a new product              | 201 Created      | 400, 500      |
| GET    | `/products`      | Get all products                  | 200 OK           | 500           |
| GET    | `/products/:id`  | Get product by ID                 | 200 OK           | 404, 500      |
| PUT    | `/products/:id`  | Update product by ID              | 200 OK           | 400, 404, 500 |
| DELETE | `/products/:id`  | Delete product by ID              | 200 OK           | 404, 500      |

### Example Product Object

```json
{
  "id": 1,
  "name": "Razer Cobra",
  "price": 3950.00,
  "model": "Pro",
  "stock": 14,
  "type": "Wireless"
}
```

## Input Validation & Error Handling

- **POST/PUT:** Validates that `name` is a non-empty string, `price` and `stock` are valid numbers, and other fields are present.
- **Error Responses:** Return appropriate HTTP status codes and JSON error messages for invalid input, not found, and server errors.

## Testing

- **Unit tests:** Located in `__tests__/productModel.test.js`
- **Integration tests:** Located in `__tests__/productController.test.js`
- **Run all tests:**
  ```sh
  npm test
  ```

## Bonus Features

- API unit and integration tests (Jest & Supertest)

## License

ISC

---

## Author

Dustine Gian G. Rivera

---
