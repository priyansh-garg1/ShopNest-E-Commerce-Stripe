# ShopNest E-Commerce Platform

This is a full-stack MERN (MongoDB, Express, React, Node.js) e-commerce application featuring product browsing, a shopping cart, user authentication, and secure payments with Stripe.

## Features

-   **Product Catalog**: Browse products by category.
-   **Shopping Cart**: Add, update, and remove items from the cart.
-   **User Authentication**: Secure user registration and login using JWT.
-   **Stripe Integration**: Secure checkout process with Stripe Checkout and webhook confirmation.
-   **Order History**: Authenticated users can view their past orders.
-   **Responsive Design**: Built with Tailwind CSS for a great experience on all devices.

## Project Structure

```
/
├── client/         # React frontend
└── server/         # Node.js/Express backend
```

## Setup and Installation

Follow these steps to get the development environment running.

### 1. Clone the Repository

```bash
git clone https://github.com/priyansh-garg1/ShopNest-E-Commerce-Stripe
cd ShopNest-E-Commerce-Stripe
```

### 2. Backend Setup

Navigate to the server directory and install the dependencies.

```bash
cd server
npm install
```

### 3. Frontend Setup

Navigate to the client directory and install the dependencies.

```bash
cd client
npm install
```

### 4. Run the Application

You will need two terminals open to run both the backend and frontend servers concurrently.

-   **Terminal 1 (Backend)**:
    ```bash
    cd server
    npm run dev
    ```
-   **Terminal 2 (Frontend)**:
    ```bash
    cd client
    npm run dev
    ```

The application will be available at `http://localhost:5173`.

## Environment Variables (`server/.env`)
The environment variables required for testing and configuration are shared already.
