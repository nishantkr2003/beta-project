import mongoose from 'mongoose';

const loanApplicationSchema = new mongoose.Schema({
  borrower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Real Estate', 'Technology', 'Healthcare', 'Energy', 'Manufacturing', 'Education', 'Retail', 'Other']
  },
  amount: {
    type: Number,
    required: true,
    min: 1000
  },
  term: {
    type: Number,
    required: true,
    min: 1,
    comment: 'Loan term in months'
  },
  interestRate: {
    type: Number,
    required: true,
    min: 0
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  fundingProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    required: true,
    enum: ['draft', 'pending', 'approved', 'rejected', 'funded', 'active', 'closed'],
    default: 'draft'
  },
  documents: [{
    name: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  investors: [{
    investor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  verificationStatus: {
    type: String,
    enum: ['pending', 'in-progress', 'verified', 'rejected'],
    default: 'pending'
  },
  verificationNotes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Virtual for total funded amount
loanApplicationSchema.virtual('totalFunded').get(function() {
  if (!this.investors || this.investors.length === 0) return 0;
  
  return this.investors.reduce((total, investor) => total + investor.amount, 0);
});

// Pre-save middleware to update funding progress
loanApplicationSchema.pre('save', function(next) {
  if (this.investors && this.investors.length > 0) {
    const totalFunded = this.investors.reduce((total, investor) => total + investor.amount, 0);
    this.fundingProgress = Math.min(Math.round((totalFunded / this.amount) * 100), 100);
    
    // Update status to funded if 100% funded
    if (this.fundingProgress === 100 && this.status === 'approved') {
      this.status = 'funded';
    }
  }
  
  next();
});

const LoanApplication = mongoose.model('LoanApplication', loanApplicationSchema);

export default LoanApplication;