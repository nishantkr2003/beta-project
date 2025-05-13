# 💼 Investment Platform

A full-stack MERN (MongoDB, Express.js, React, Node.js) investment management application supporting multiple roles: Investor, Borrower, and Admin. Features include authentication, role-based dashboards, email verification, password reset, and two-factor authentication (2FA) support.

---

## 🚀 Features

* User Roles: Investor, Borrower, Admin
* Email Verification & Password Reset
* Secure Authentication with JWT & bcrypt
* MongoDB for Data Storage
* Role-based Dashboards
* Protected Routes (Frontend)
* Nodemailer Integration (with Gmail SMTP + App Passwords)
* 2FA-Ready Email Delivery

---

## 📁 Project Structure

```
.
├── .gitignore
├── package.json
├── README.md
├── server/                     # Backend API
│   ├── .env.example            # Sample environment variables
│   ├── package.json            # Backend dependencies
│   └── src/
│       ├── controllers/        # Route handlers
│       ├── middleware/         # Express middlewares
│       ├── models/             # Mongoose models
│       ├── routes/             # API routes
│       ├── utils/              # Utility functions (e.g., email service)
│       └── index.js            # Entry point for Express server
├── src/                        # Frontend (React + Vite + Tailwind)
│   ├── App.tsx                 # Root component
│   ├── main.tsx                # Vite entry point
│   ├── index.css               # Global styles
│   ├── components/             # Reusable UI components
│   ├── context/                # Auth context for global state
│   ├── layouts/                # Layout components
│   ├── pages/                  # Route-based pages
│   └── config/                 # Configuration files
```

---

## 🌐 Environment Variables Example

Create a `.env` file in the `server` directory based on the following template:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/investment_platform
JWT_SECRET=super_secure_jwt_secret
JWT_EXPIRES_IN=7d

EMAIL_FROM=your_email@gmail.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

FRONTEND_URL=http://localhost:3000
ADMIN_SIGNUP_KEY=your_admin_signup_key
```

> 💡 **Note:** Use [Gmail App Passwords](https://myaccount.google.com/apppasswords) for `EMAIL_PASS`. Enable 2FA in your Gmail account first.

---

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/nishantkr2003/beta-project.git
cd PROJECT
```

### 2. Setup Environment Variables

* Copy `.env.example` to `.env` in the `server` directory
* Update values as needed

```bash
cp server/.env.example server/.env
```

### 3. Install Dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd ../
npm install
```

### 4. Run the Development Servers

#### Backend

```bash
cd server
npm run dev
```

#### Frontend

```bash
cd ../
npm run dev
```

---

## 🧪 Testing

* Registration and Login for Investor / Borrower / Admin
* Email verification after signup
* Forgot password → check your email (in development, logs to console)
* Protected routes (Investor, Borrower, Admin Dashboards)

---

## 📬 Email Configuration

We use **Nodemailer** with Gmail SMTP (port 465 with SSL). To send real emails:

1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Generate an app password for your Gmail
3. Use this 16-character password in your `.env` as `EMAIL_PASS`

---

## 🛡 Security Notes

* JWT secrets should be strong and stored securely.
* App passwords are required because Gmail blocks standard login via scripts.
* HTTPS is recommended in production.

---

## 📝 License

This project is licensed under the MIT License.

---

## ✍️ Author

Developed by \[Nishant Kumar]
