import express from 'express';
import { body } from 'express-validator';
import { 
  signup, 
  login, 
  verifyEmail, 
  resendOtp, 
  forgotPassword, 
  resetPassword,
  getMe 
} from '../controllers/auth.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

// Signup validation
const signupValidation = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .withMessage('Password must include uppercase, lowercase, number and special character'),
  body('phone').notEmpty().withMessage('Phone number is required')
];

// Login validation
const loginValidation = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Verify email validation
const verifyEmailValidation = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
];

// Forgot password validation
const forgotPasswordValidation = [
  body('email').isEmail().withMessage('Please enter a valid email')
];

// Reset password validation
const resetPasswordValidation = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .withMessage('Password must include uppercase, lowercase, number and special character')
];

// Routes
router.post('/investor/signup', signupValidation, (req, res) => signup(req, res, 'investor'));
router.post('/borrower/signup', signupValidation, (req, res) => signup(req, res, 'borrower'));
router.post('/admin/signup', signupValidation, (req, res) => signup(req, res, 'admin'));

router.post('/investor/login', loginValidation, (req, res) => login(req, res, 'investor'));
router.post('/borrower/login', loginValidation, (req, res) => login(req, res, 'borrower'));
router.post('/admin/login', loginValidation, (req, res) => login(req, res, 'admin'));

router.post('/verify-email', verifyEmailValidation, verifyEmail);
router.post('/resend-otp', forgotPasswordValidation, resendOtp);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.post('/reset-password', resetPasswordValidation, resetPassword);

router.get('/me', authenticateJWT, getMe);

export default router;