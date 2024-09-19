const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
    userId:{type:String},
    companyId:{type:String},
    
  rating: {
    type: Number,
    min: 1,
    max: 5,
    
  },
  userReview: {
    type: String,
    maxlength: 100,
    trim: true,
  },
  companyComment: {
    type: String,
    maxlength: 100,
    trim: true,
  },
  createdAt: {
    type: Date,
    // default: Date.now,
    default: () => new Date().setHours(0, 0, 0, 0), // Sets time to midnight
  }
},
{
    suppressReservedKeysWarning:true // suppress the warnig
}
);

// Export the model
module.exports = mongoose.model('Review', reviewSchema);
