# 🛒 E-Commerce Storefront

A full-stack e-commerce web application that allows users to browse products, manage a shopping cart, and complete checkout.

## 📌 Project Status
🚧 In Progress — currently building.

## ✨ Features

### Planned
- [x] User signup/login (JWT-based auth)
- [x] Product listing page
- [x] Product detail page
- [x] Shopping cart (add/remove/update quantity)
- [ ] Checkout flow
- [ ] Order history
- [ ] Admin dashboard (manage products & orders)
- [ ] Payment integration (Stripe/Razorpay test mode)
- [ ] Search & filter products
- [ ] Deployment

## 🛠️ Tech Stack

**Frontend:** React
**Backend:** Spring Boot (Java)
**Database:** MySQL
**Authentication:** Spring Security + JWT
**Other tools:** Maven

## 🚀 Getting Started

### Prerequisites
- Java JDK 17+
- Maven (or use the included Maven wrapper)
- Node.js (v18+) and npm
- MySQL installed locally (or a cloud instance)

### Installation

```bash
# Clone the repo
git clone https://github.com/[your-username]/ecommerce-storefront.git
cd ecommerce-storefront

# Backend setup
cd server
mvn install

# Frontend setup
cd ../client
npm install
```

### Database Setup
Create a MySQL database:
```sql
CREATE DATABASE ecommerce_db;
```

### Environment Configuration
Update `server/src/main/resources/application.properties` with your DB credentials:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update

jwt.secret=your_jwt_secret_key
```

### Running the App
```bash
# Run backend (from /server)
mvn spring-boot:run

# Run frontend (from /client, in a separate terminal)
npm run dev
```

- Backend runs on: `http://localhost:8080`
- Frontend runs on: `http://localhost:5173` (Vite default)


## 📂 Project Structure

```
ecommerce-storefront/
├── client/                          # Frontend (React)
│   ├── src/
│   └── package.json
│
├── server/                          # Backend (Spring Boot)
│   └── src/main/java/com/yourname/ecommerce/
│       ├── controller/              # REST API endpoints
│       ├── service/                 # Business logic
│       ├── repository/              # Database access (JPA)
│       ├── model/ (or entity/)      # Data models/entities
│       ├── config/                  # Security/JWT config
│       └── EcommerceApplication.java
│
└── README.md
```
