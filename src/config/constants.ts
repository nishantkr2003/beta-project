// API URL configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Authentication Constants
export const TOKEN_STORAGE_KEY = 'token';
export const AUTH_ROLES = {
  INVESTOR: 'investor',
  BORROWER: 'borrower',
  ADMIN: 'admin',
};

// Validation Constants
export const MIN_PASSWORD_LENGTH = 8;
export const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

// Route Constants
export const ROUTES = {
  HOME: '/',
  INVESTOR: {
    LOGIN: '/investor/login',
    SIGNUP: '/investor/signup',
    DASHBOARD: '/investor/dashboard',
  },
  BORROWER: {
    LOGIN: '/borrower/login',
    SIGNUP: '/borrower/signup',
    DASHBOARD: '/borrower/dashboard',
  },
  ADMIN: {
    LOGIN: '/admin/login',
    SIGNUP: '/admin/signup',
    DASHBOARD: '/admin/dashboard',
  },
  VERIFY_EMAIL: '/verify-email',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
};