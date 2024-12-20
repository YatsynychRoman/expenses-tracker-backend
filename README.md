# 💸 ExpenseTracker - Backend

Welcome to the backend of ExpenseTracker - your ultimate solution for smart expense management! Built with Deno and minimal third-party dependencies, this backend is designed for performance and simplicity.

## 🌟 Features

- **Custom Categories**: Tailor your expense tracking with personalized categories
- **Trend Analysis**: Visualize how your spending habits change over time
- **Minimal Dependencies**: Built using Deno with using as few third-party libraries as possible
- **RESTful API**: Easy integration with various frontend applications

## 🛠 Prerequisites

- **Deno**: The next-generation JavaScript runtime
  
  For Unix-based systems:
  ```sh
  curl -fsSL https://deno.land/install.sh | sh
  ```
  For Windows:
  ```powershell
  irm https://deno.land/install.ps1 | iex 
  ```

- **PostgreSQL**: Our chosen database for robust data management

## 🚀 Getting Started

1. Clone this repository
2. Copy `.env.example` to `.env` and fill in your configuration details
3. Create a PostgreSQL database matching the name in your `.env` file
4. Install dependencies:
   ```bash
   deno install
   ```
5. Initialize the database:
   ```bash
   deno run init-database
   ```

## 🏃‍♂️ Running the Server

Launch the development server with:
```bash
deno run dev
```

## 🔗 API Endpoints

### Authentication
- `POST /auth/register`: Register a new user
- `POST /auth/login`: Login with email and password
- `POST /auth/tokens`: Refresh JWT tokens
- `GET /user`: Get info about current user

### Categories
- `GET /user/categories`: List all categories
- `POST /user/categories`: Create a new category
- `DELETE /user/categories/:id`: Delete a category
- `PATCH /user/categories/:id`: Rename a category

### Expenses
- `GET /expenses`: Retrieve all expenses (with optional query parameters for filtering)
- `POST /expenses`: Add a new expense
- `DELETE /expenses/:id`: Delete an expense
- `PATCH /expenses/:id`: Edit an expense
- `GET /trends`: Get spending trends

Happy expense tracking! 🎉
