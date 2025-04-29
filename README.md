# Rice Trade Platform

A full-stack mobile application for rice trading with real-time bidding and logistics features.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Examples](#examples)

## Project Overview

The Rice Trade Platform is a comprehensive **mobile application backend** designed to facilitate rice trading between sellers, buyers, and logistics providers. The platform enables real-time bidding, order management, and logistics tracking.

## Features

### Seller Features
- User registration and authentication
- Product listing and management
- Real-time bidding system
- Order management and tracking
- Logistics assignment
- Payment processing
- Analytics and reporting
- Push notifications for bids and orders

### Buyer Features
- User registration and authentication
- Browse and search products
- Place bids on products
- View bid history
- Order management
- Track order status
- Payment processing
- Push notifications for bid status and orders

### Logistics Features
- User registration and authentication
- Order pickup and delivery management
- Real-time location tracking
- OTP-based verification system
- Order status updates
- Route optimization
- Push notifications for new orders

### Common Features
- Real-time chat between users
- Location-based services
- Secure payment processing
- Push notifications
- User profile management
- Rating and review system
- Search and filter functionality
- Multi-language support

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Socket.io (for real-time features)
- JWT Authentication
- Bcrypt for password hashing
- Mongoose ODM

### Mobile App
- Flutter
- Provider for state management
- Google Maps integration
- Firebase Cloud Messaging
- Local storage
- HTTP client for API communication

### Additional Tools
- Postman for API testing
- Git for version control
- VS Code for development
- Android Studio for mobile development

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or remote)
- npm or yarn package manager

## Installation

1. Clone the repository
```bash
git clone https://github.com/srajan-kush/Integrated-Rice-Trade-Platform-backend.git
cd Integrated-Rice-Trade-Platform-backend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=8001
MONGO_URI=mongodb://127.0.0.1:27017/kuteeram
JWT_SECRET=your-secret-key-here
CLIENT_URL=http://localhost:3000
```

4. Start the development server
```bash
npm run dev
```

The server will start at `http://localhost:8001`

## API Endpoints

### Authentication

#### Register Seller
```http
POST /api/auth/seller/register
```
Request body:
```json
{
    "name": "Seller Name",
    "email": "seller@example.com",
    "password": "password123",
    "phone": "1234567890",
    "city": "City Name",
    "location": {
        "coordinates": [longitude, latitude]
    }
}
```

#### Register Buyer
```http
POST /api/auth/buyer/register
```
Request body:
```json
{
    "name": "Buyer Name",
    "phone": "1234567890",
    "password": "password123",
    "location": {
        "coordinates": [longitude, latitude]
    }
}
```

#### Register Logistics
```http
POST /api/auth/logistics/register
```
Request body:
```json
{
    "name": "Logistics Company",
    "email": "logistics@example.com",
    "password": "password123",
    "phone": "1234567890",
    "address": {
        "coordinates": [longitude, latitude]
    }
}
```

#### Login (All User Types)
```http
POST /api/auth/{userType}/login
```
Request body:
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
```
Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Logout
```http
POST /api/auth/logout
```
Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Products

#### Get All Products
```http
GET /api/products
```
Query Parameters:
- category: Filter by category
- minPrice: Minimum price
- maxPrice: Maximum price
- search: Search in name and description
- sort: Sort by price, date, etc.

#### Get Nearby Products
```http
GET /api/products/nearby
```
Query Parameters:
- latitude: User's latitude
- longitude: User's longitude
- radius: Search radius in kilometers

#### Get Product by ID
```http
GET /api/products/:id
```

#### Create Product (Seller Only)
```http
POST /api/products
```
Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```
Request body:
```json
{
    "name": "Product Name",
    "description": "Product Description",
    "price": 99.99,
    "category": "Electronics",
    "stock": 100,
    "images": ["image_url1", "image_url2"]
}
```

#### Update Product (Seller Only)
```http
PUT /api/products/:id
```
Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Delete Product (Seller Only)
```http
DELETE /api/products/:id
```
Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Get Seller's Products
```http
GET /api/products/seller/products
```
Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Bids

#### Create Bid (Buyer Only)
```http
POST /api/bids
```
Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```
Request body:
```json
{
    "productId": "product_id",
    "amount": 120.50
}
```

#### Get Buyer's Bids
```http
GET /api/bids/buyer
```
Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Get Seller's Bids
```http
GET /api/bids/seller
```
Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Accept Bid (Seller Only)
```http
PUT /api/bids/:id/accept
```
Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Reject Bid (Seller Only)
```http
PUT /api/bids/:id/reject
```
Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Cancel Bid (Buyer Only)
```http
PUT /api/bids/:id/cancel
```
Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Orders

#### Get Seller's Orders
```http
GET /api/orders/seller
```
Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Get Buyer's Orders
```http
GET /api/orders/buyer
```
Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Get Logistics Orders
```http
GET /api/orders/logistics
```
Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Get Order by ID
```http
GET /api/orders/:id
```
Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Update Order Status
```http
PUT /api/orders/:id/status
```
Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Assign Logistics (Seller Only)
```http
PUT /api/orders/:id/assign-logistics
```
Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Verify Pickup OTP (Logistics Only)
```http
PUT /api/orders/:id/verify-pickup
```
Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Verify Delivery OTP (Logistics Only)
```http
PUT /api/orders/:id/verify-delivery
```
Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Update Location (Logistics Only)
```http
PUT /api/orders/:id/update-location
```
Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. The token is stored in an HTTP-only cookie named `jwt`.

### Token Details
- Token is generated upon successful login/register
- Token expires in 30 days
- Token is automatically sent with each request in cookies
- Protected routes require a valid token

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error response format:
```json
{
    "success": false,
    "statusCode": 400,
    "message": "Error message"
}
```

## Examples

### Using cURL

1. Register Seller:
```bash
curl -X POST http://localhost:8001/api/auth/seller/register \
-H "Content-Type: application/json" \
-d '{"name":"Test Seller","email":"seller@example.com","password":"password123","phone":"1234567890","city":"Test City","location":{"coordinates":[0,0]}}'
```

2. Login:
```bash
curl -X POST http://localhost:8001/api/auth/seller/login \
-H "Content-Type: application/json" \
-d '{"email":"seller@example.com","password":"password123"}'
```

3. Create Product:
```bash
curl -X POST http://localhost:8001/api/products \
-H "Content-Type: application/json" \
-H "Cookie: jwt=your-jwt-token" \
-d '{"name":"Product Name","description":"Product Description","price":99.99,"category":"Electronics","stock":100}'
```

4. Place Bid:
```bash
curl -X POST http://localhost:8001/api/bids \
-H "Content-Type: application/json" \
-H "Cookie: jwt=your-jwt-token" \
-d '{"productId":"product_id","amount":120.50}'
```

## Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens are stored in HTTP-only cookies
- SameSite cookie policy is set to 'strict'
- Secure cookie flag is enabled in production
- Input validation is performed on all endpoints
- Error messages are generic to prevent information leakage
- Authorization checks for product and bid operations
- Rate limiting can be implemented for production 
