import User from '../models/User.js';
import LoanApplication from '../models/LoanApplication.js';

// Get investor profile
export const getInvestorProfile = async (req, res) => {
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
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get investor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve investor profile',
      error: error.message
    });
  }
};

// Update investor profile
export const updateInvestorProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    
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
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Update investor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update investor profile',
      error: error.message
    });
  }
};

// Get investment opportunities
export const getInvestmentOpportunities = async (req, res) => {
  try {
    // Get query parameters
    const { category, location, minAmount, maxAmount, status } = req.query;
    
    // Build filter
    const filter = {
      status: 'approved',
      verificationStatus: 'verified',
      fundingProgress: { $lt: 100 } // Not fully funded
    };
    
    // Add optional filters
    if (category) filter.category = category;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (minAmount) filter.amount = { $gte: parseInt(minAmount) };
    if (maxAmount) {
      filter.amount = { ...filter.amount, $lte: parseInt(maxAmount) };
    }
    if (status) filter.status = status;
    
    // Fetch opportunities
    const opportunities = await LoanApplication.find(filter)
      .populate('borrower', 'firstName lastName companyName')
      .select('title description category amount term interestRate location fundingProgress createdAt')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: opportunities.length,
      data: opportunities
    });
  } catch (error) {
    console.error('Get investment opportunities error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve investment opportunities',
      error: error.message
    });
  }
};

// Get investor portfolio
export const getInvestorPortfolio = async (req, res) => {
  try {
    const investorId = req.user.id;
    
    // Find all loan applications where the user is an investor
    const investments = await LoanApplication.find({
      'investors.investor': investorId
    })
      .populate('borrower', 'firstName lastName companyName')
      .select('title description category amount term interestRate location fundingProgress status investors createdAt');
    
    // Calculate total invested amount
    let totalInvested = 0;
    let activeInvestments = 0;
    
    const portfolio = investments.map(investment => {
      // Find the investor's contribution
      const investorData = investment.investors.find(
        inv => inv.investor.toString() === investorId
      );
      
      const investedAmount = investorData ? investorData.amount : 0;
      totalInvested += investedAmount;
      
      if (['funded', 'active'].includes(investment.status)) {
        activeInvestments++;
      }
      
      return {
        id: investment._id,
        title: investment.title,
        borrower: investment.borrower,
        category: investment.category,
        amount: investment.amount,
        investedAmount,
        term: investment.term,
        interestRate: investment.interestRate,
        fundingProgress: investment.fundingProgress,
        status: investment.status,
        investmentDate: investorData ? investorData.date : null,
        createdAt: investment.createdAt
      };
    });
    
    res.status(200).json({
      success: true,
      stats: {
        totalInvested,
        activeInvestments,
        totalInvestments: investments.length
      },
      data: portfolio
    });
  } catch (error) {
    console.error('Get investor portfolio error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve investor portfolio',
      error: error.message
    });
  }
};

// Get investment details
export const getInvestmentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const investorId = req.user.id;
    
    // Find the investment
    const investment = await LoanApplication.findById(id)
      .populate('borrower', 'firstName lastName companyName')
      .populate('investors.investor', 'firstName lastName');
    
    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found'
      });
    }
    
    // Check if the user is an investor in this project
    const isInvestor = investment.investors.some(
      inv => inv.investor._id.toString() === investorId
    );
    
    // If not an investor and the investment is not public (approved), deny access
    if (!isInvestor && investment.status !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Find the investor's contribution
    const investorData = investment.investors.find(
      inv => inv.investor._id.toString() === investorId
    );
    
    const investedAmount = investorData ? investorData.amount : 0;
    
    // Format the response
    const response = {
      id: investment._id,
      title: investment.title,
      description: investment.description,
      borrower: investment.borrower,
      category: investment.category,
      amount: investment.amount,
      investedAmount,
      term: investment.term,
      interestRate: investment.interestRate,
      location: investment.location,
      fundingProgress: investment.fundingProgress,
      status: investment.status,
      documents: investment.documents,
      totalInvestors: investment.investors.length,
      investmentDate: investorData ? investorData.date : null,
      createdAt: investment.createdAt,
      updatedAt: investment.updatedAt
    };
    
    res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Get investment details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve investment details',
      error: error.message
    });
  }
};