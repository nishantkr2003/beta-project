import express from 'express';
import { authenticateJWT, authorizeRole } from '../middleware/auth.js';
import { 
  getAllUsers,
  getUserDetails,
  updateUserStatus,
  getAllLoanApplications,
  getLoanApplicationDetails,
  updateLoanApplicationStatus,
  getDashboardStats
} from '../controllers/admin.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateJWT);
router.use(authorizeRole(['admin']));

// Admin routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetails);
router.put('/users/:id/status', updateUserStatus);
router.get('/applications', getAllLoanApplications);
router.get('/applications/:id', getLoanApplicationDetails);
router.put('/applications/:id/status', updateLoanApplicationStatus);
router.get('/dashboard/stats', getDashboardStats);

export default router;