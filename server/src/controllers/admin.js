import User from '../models/User.js';
import LoanApplication from '../models/LoanApplication.js';

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query;
    
    // Build filter
    const filter = {};
    
    if (role && ['investor', 'borrower', 'admin'].includes(role)) {
      filter.role = role;
    }
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Fetch users
    const users = await User.find(filter)
      .select('firstName lastName email phone role companyName isVerified createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Count total documents
    const total = await User.countDocuments(filter);
    
    // Calculate statistics
    const stats = {
      total,
      investors: await User.countDocuments({ role: 'investor' }),
      borrowers: await User.countDocuments({ role: 'borrower' }),
      admins: await User.countDocuments({ role: 'admin' }),
      verified: await User.countDocuments({ isVerified: true }),
      unverified: await User.countDocuments({ isVerified: false })
    };
    
    res.status(200).json({
      success: true,
      stats,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
      error: error.message
    });
  }
};

// Get user details
export const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get additional data based on user role
    let additionalData = {};
    
    if (user.role === 'investor') {
      // Count investments and get total invested
      const investments = await LoanApplication.find({
        'investors.investor': user._id
      });
      
      let totalInvested = 0;
      investments.forEach(investment => {
        const investorData = investment.investors.find(
          inv => inv.investor.toString() === user._id.toString()
        );
        totalInvested += investorData ? investorData.amount : 0;
      });
      
      additionalData = {
        investments: investments.length,
        totalInvested
      };
    } else if (user.role === 'borrower') {
      // Count loan applications and get total funded
      const applications = await LoanApplication.find({
        borrower: user._id
      });
      
      const totalRequested = applications.reduce((total, app) => total + app.amount, 0);
      const totalFunded = applications
        .filter(app => ['funded', 'active', 'closed'].includes(app.status))
        .reduce((total, app) => total + app.amount, 0);
      
      additionalData = {
        applications: applications.length,
        totalRequested,
        totalFunded
      };
    }
    
    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        ...additionalData
      }
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user details',
      error: error.message
    });
  }
};

// Update user status
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['active', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update status field (add a status field if needed)
    user.status = status;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: `User ${status === 'active' ? 'activated' : 'suspended'} successfully`,
      data: {
        id: user._id,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status',
      error: error.message
    });
  }
};

// Get all loan applications
export const getAllLoanApplications = async (req, res) => {
  try {
    const { status, category, search, page = 1, limit = 10 } = req.query;
    
    // Build filter
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Fetch applications
    const applications = await LoanApplication.find(filter)
      .populate('borrower', 'firstName lastName companyName')
      .select('title category amount term interestRate location fundingProgress status verificationStatus createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Count total documents
    const total = await LoanApplication.countDocuments(filter);
    
    // Calculate statistics
    const stats = {
      total,
      draft: await LoanApplication.countDocuments({ status: 'draft' }),
      pending: await LoanApplication.countDocuments({ status: 'pending' }),
      approved: await LoanApplication.countDocuments({ status: 'approved' }),
      funded: await LoanApplication.countDocuments({ status: 'funded' }),
      active: await LoanApplication.countDocuments({ status: 'active' }),
      closed: await LoanApplication.countDocuments({ status: 'closed' }),
      rejected: await LoanApplication.countDocuments({ status: 'rejected' }),
      pendingVerification: await LoanApplication.countDocuments({ verificationStatus: 'pending' }),
      verified: await LoanApplication.countDocuments({ verificationStatus: 'verified' })
    };
    
    res.status(200).json({
      success: true,
      stats,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: applications
    });
  } catch (error) {
    console.error('Get all loan applications error:', error);
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
    
    const application = await LoanApplication.findById(id)
      .populate('borrower', 'firstName lastName email phone companyName')
      .populate('investors.investor', 'firstName lastName email');
    
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

// Update loan application status
export const updateLoanApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, verificationStatus, verificationNotes } = req.body;
    
    const application = await LoanApplication.findById(id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Loan application not found'
      });
    }
    
    // Update status if provided
    if (status && ['pending', 'approved', 'rejected', 'funded', 'active', 'closed'].includes(status)) {
      application.status = status;
    }
    
    // Update verification status if provided
    if (verificationStatus && ['pending', 'in-progress', 'verified', 'rejected'].includes(verificationStatus)) {
      application.verificationStatus = verificationStatus;
    }
    
    // Update verification notes if provided
    if (verificationNotes) {
      application.verificationNotes = verificationNotes;
    }
    
    await application.save();
    
    res.status(200).json({
      success: true,
      message: 'Loan application updated successfully',
      data: {
        id: application._id,
        status: application.status,
        verificationStatus: application.verificationStatus
      }
    });
  } catch (error) {
    console.error('Update loan application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update loan application status',
      error: error.message
    });
  }
};

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments();
    const investors = await User.countDocuments({ role: 'investor' });
    const borrowers = await User.countDocuments({ role: 'borrower' });
    const admins = await User.countDocuments({ role: 'admin' });
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().setDate(1)) } // First day of current month
    });
    
    // Loan application statistics
    const totalApplications = await LoanApplication.countDocuments();
    const activeProjects = await LoanApplication.countDocuments({
      status: { $in: ['approved', 'funded', 'active'] }
    });
    const pendingVerification = await LoanApplication.countDocuments({
      verificationStatus: 'pending'
    });
    
    // Financial statistics
    const allApplications = await LoanApplication.find();
    const totalRequested = allApplications.reduce((total, app) => total + app.amount, 0);
    const totalFunded = allApplications
      .filter(app => ['funded', 'active', 'closed'].includes(app.status))
      .reduce((total, app) => total + app.amount, 0);
    
    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          investors,
          borrowers,
          admins,
          newUsersThisMonth
        },
        applications: {
          total: totalApplications,
          activeProjects,
          pendingVerification
        },
        financial: {
          totalRequested,
          totalFunded
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard statistics',
      error: error.message
    });
  }
};