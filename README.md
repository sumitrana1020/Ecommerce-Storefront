# 🛒 E-Commerce Storefront

A full-stack e-commerce web application built with Spring Boot and React. Users can browse 100+ products, manage a shopping cart, place orders, and track order history. Includes an admin dashboard for product management and JWT-based authentication with role-based access control.

🌐 **Live Demo:** [ecommerce-storefront-rosy.vercel.app](https://ecommerce-storefront-rosy.vercel.app)

## ✨ Features

- 🔐 **Authentication** — JWT-based signup/login with role-based access (CUSTOMER / ADMIN)
- 🛍️ **Product Catalog** — 100+ products with real images, search, and category filtering
- 🛒 **Shopping Cart** — Add, remove, and update quantities
- 📦 **Order Management** — Place orders, view order history, cancel pending orders
- ⚙️ **Admin Panel** — Add, edit, and delete products from the UI
- 📱 **Responsive UI** — Clean, modern design built with React

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Axios |
| Backend | Spring Boot (Java), Spring Security |
| Database | MySQL (local) / Aiven MySQL (production) |
| Auth | JWT (JSON Web Tokens) |
| Deployment | Vercel (frontend), Render (backend) |
| Build Tool | Maven |

## 📊 Project Metrics

- **20** REST API endpoints across 5 controllers
- **7** React pages (Home, Login, Register, Cart, Orders, ProductDetail, Admin)
- **5** MySQL tables with foreign key relationships
- **100+** products seeded from DummyJSON API

## 🚀 Getting Started

### Prerequisites
- Java JDK 17+
- Node.js v18+ and npm
- MySQL installed locally
- Maven (or use the included `mvnw` wrapper)

### Installation

```bash
# Clone the repo
git clone https://github.com/sumitrana1020/Ecommerce-Storefront.git
cd Ecommerce-Storefront

# Backend setup
cd server
./mvnw install

# Frontend setup
cd ../client
npm install
```

### Database Setup
```sql
CREATE DATABASE ecommerce_db;
```

### Environment Configuration

Update `server/src/main/resources/application-local.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
jwt.secret=your_jwt_secret_key
jwt.expiration=86400000
```

### Running the App

```bash
# Run backend (from /server)
./mvnw spring-boot:run -Dspring-boot.run.profiles=local

# Run frontend (from /client, in a separate terminal)
npm run dev
```

- Backend: `http://localhost:8080`
- Frontend: `http://localhost:5173`

## 📂 Project Structure

```
Ecommerce-Storefront/
├── client/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/              # Navbar
│   │   ├── context/                 # Auth context (JWT state)
│   │   ├── pages/                   # Home, Cart, Orders, Admin...
│   │   └── services/                # Axios API service layer
│   └── package.json
│
├── server/                          # Backend (Spring Boot)
│   ├── Dockerfile
│   └── src/main/java/com/sumit/ecommerce/
│       ├── controller/              # REST API endpoints
│       ├── service/                 # Business logic
│       ├── repository/              # JPA repositories
│       ├── model/                   # JPA entities
│       └── config/                  # JWT + Security config
│
├── seed.js                          # Product seeding script
└── README.md
```

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/login` | Login | Public |
| POST | `/api/users/register` | Register | Public |
| GET | `/api/products` | Get all products | Public |
| GET | `/api/products/{id}` | Get product by ID | Public |
| POST | `/api/products` | Add product | Admin |
| PUT | `/api/products/{id}` | Update product | Admin |
| DELETE | `/api/products/{id}` | Delete product | Admin |
| GET | `/api/cart/{userId}` | Get cart | Auth |
| POST | `/api/cart/add` | Add to cart | Auth |
| DELETE | `/api/cart/{id}` | Remove from cart | Auth |
| POST | `/api/orders/place/{userId}` | Place order | Auth |
| GET | `/api/orders/user/{userId}` | Get user orders | Auth |
| PUT | `/api/orders/{id}/status` | Update order status | Auth |

## 📸 Screenshots

<img width="945" alt="Home Page" src="https://github.com/user-attachments/assets/49391ac2-c1ad-4bd7-a0a6-c4a8f9a8fc49" />

<br><br>

<img width="945" alt="Product Detail" src="https://github.com/user-attachments/assets/e7a81a6d-24d3-42de-92dc-8e8a01beea48" />

## 🧠 What I Learned

- Designing a relational database schema with JPA/Hibernate
- Implementing JWT authentication from scratch with Spring Security
- Building a layered Spring Boot architecture (Controller → Service → Repository)
- Connecting a React frontend to a REST API with Axios interceptors
- Role-based access control (ADMIN vs CUSTOMER)
- Containerizing a Spring Boot app with Docker
- Deploying a full-stack app (Vercel + Render + Aiven)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
