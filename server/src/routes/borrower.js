import express from 'express';
import { authenticateJWT, authorizeRole } from '../middleware/auth.js';
import { 
  getBorrowerProfile,
  updateBorrowerProfile,
  createLoanApplication,
  getLoanApplications,
  getLoanApplicationDetails,
  updateLoanApplication
} from '../controllers/borrower.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateJWT);
router.use(authorizeRole(['borrower']));

// Borrower routes
router.get('/profile', getBorrowerProfile);
router.put('/profile', updateBorrowerProfile);
router.post('/applications', createLoanApplication);
router.get('/applications', getLoanApplications);
router.get('/applications/:id', getLoanApplicationDetails);
router.put('/applications/:id', updateLoanApplication);

export default router;