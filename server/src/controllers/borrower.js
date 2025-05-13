import { validationResult } from 'express-validator';
import User from '../models/User.js';
import LoanApplication from '../models/LoanApplication.js';

// Get borrower profile
export const getBorrowerProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        companyName: user.companyName,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get borrower profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve borrower profile',
      error: error.message
    });
  }
};

// Update borrower profile
export const updateBorrowerProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, companyName } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (companyName) user.companyName = companyName;
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        companyName: user.companyName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Update borrower profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update borrower profile',
      error: error.message
    });
  }
};

// Create loan application
export const createLoanApplication = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const {
      title,
      description,
      category,
      amount,
      term,
      interestRate,
      location,
      status = 'draft'
    } = req.body;
    
    // Create new loan application
    const loanApplication = new LoanApplication({
      borrower: req.user.id,
      title,
      description,
      category,
      amount,
      term,
      interestRate,
      location,
      status: ['draft', 'pending'].includes(status) ? status : 'draft'
    });
    
    await loanApplication.save();
    
    res.status(201).json({
      success: true,
      message: 'Loan application created successfully',
      data: loanApplication
    });
  } catch (error) {
    console.error('Create loan application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create loan application',
      error: error.message
    });
  }
};

// Get borrower's loan applications
export const getLoanApplications = async (req, res) => {
  try {
    const applications = await LoanApplication.find({
      borrower: req.user.id
    })
      .select('title category amount term interestRate location fundingProgress status createdAt updatedAt')
      .sort({ createdAt: -1 });
    
    // Calculate statistics
    const stats = {
      total: applications.length,
      draft: applications.filter(app => app.status === 'draft').length,
      pending: applications.filter(app => app.status === 'pending').length,
      approved: applications.filter(app => app.status === 'approved').length,
      funded: applications.filter(app => app.status === 'funded').length,
      active: applications.filter(app => app.status === 'active').length,
      closed: applications.filter(app => app.status === 'closed').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
      totalRequested: applications.reduce((total, app) => total + app.amount, 0),
      totalFunded: applications
        .filter(app => ['funded', 'active', 'closed'].includes(app.status))
        .reduce((total, app) => total + app.amount, 0)
    };
    
    res.status(200).json({
      success: true,
      stats,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('Get loan applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve loan applications',
      error: error.message
    });
  }
};

// Get loan application details
export const getLoanApplicationDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const application = await LoanApplication.findOne({
      _id: id,
      borrower: req.user.id
    }).populate('investors.investor', 'firstName lastName');
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Loan application not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Get loan application details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve loan application details',
      error: error.message
    });
  }
};

// Update loan application
export const updateLoanApplication = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the loan application
    const application = await LoanApplication.findOne({
      _id: id,
      borrower: req.user.id
    });
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Loan application not found'
      });
    }
    
    // Only allow updates for draft applications
    if (application.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Only draft applications can be updated'
      });
    }
    
    const {
      title,
      description,
      category,
      amount,
      term,
      interestRate,
      location,
      status
    } = req.body;
    
    // Update fields
    if (title) application.title = title;
    if (description) application.description = description;
    if (category) application.category = category;
    if (amount) application.amount = amount;
    if (term) application.term = term;
    if (interestRate) application.interestRate = interestRate;
    if (location) application.location = location;
    
    // Only allow transition from draft to pending
    if (status === 'pending' && application.status === 'draft') {
      application.status = 'pending';
    }
    
    await application.save();
    
    res.status(200).json({
      success: true,
      message: 'Loan application updated successfully',
      data: application
    });
  } catch (error) {
    console.error('Update loan application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update loan application',
      error: error.message
    });
  }
};