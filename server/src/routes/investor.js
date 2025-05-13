import express from 'express';
import { authenticateJWT, authorizeRole } from '../middleware/auth.js';
import { 
  getInvestorProfile,
  updateInvestorProfile,
  getInvestmentOpportunities,
  getInvestorPortfolio,
  getInvestmentDetails
} from '../controllers/investor.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateJWT);
router.use(authorizeRole(['investor']));

// Investor routes
router.get('/profile', getInvestorProfile);
router.put('/profile', updateInvestorProfile);
router.get('/opportunities', getInvestmentOpportunities);
router.get('/portfolio', getInvestorPortfolio);
router.get('/investments/:id', getInvestmentDetails);

export default router;