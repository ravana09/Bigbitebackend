
const Review = require('../Models/Reviewm');

exports.createReview = async (req, res) => {
    try {
      const { userId, companyId, rating, userReview, companyComment } = req.body;
  
      // Ensure a user can only leave one review
      if (userId) {
        const existingUserReview = await Review.findOne({ userId });
        if (existingUserReview && existingUserReview.userReview) {
          return res.status(400).json({ message: 'User can only leave one review' });
        }
      }
  
      // Ensure a company can only have one comment
      if (companyId) {
        const existingCompanyComment = await Review.findOne({ companyId });
        if (existingCompanyComment && existingCompanyComment.companyComment) {
          return res.status(400).json({ message: 'Company can only have one comment' });
        }
      }
  
      // Get the current date in IST timezone
      const currentISTDate = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
      const createdAt = new Date(currentISTDate).toISOString().split('T')[0]; // Format as YYYY-MM-DD
  
      // Create and save the new review
      const review = new Review({
        userId,
        companyId,
        rating,
        userReview,
        companyComment,
        createdAt,
      });
  
      await review.save();
  

      res.status(201).json(review)
      
    } catch (error) {
      res.status(500).json({ message: 'Error creating review', error: error.message });
    }
  };

// Get all reviews
exports.getall = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};



module.exports.update = async (req, res) => {
    try {
      const { id } = req.params;
      const { rating,userReview, companyComment } = req.body;
  
      // Build the update object based on the fields you want to update
      const updateObject = {};
      if (rating) updateObject.rating = rating; 
      if (userReview) updateObject.userReview= userReview;
      if (companyComment) updateObject.companyComment = companyComment;
      
      const updatedRecord = await Review.findByIdAndUpdate( id, updateObject, { new: true });
  
      if (!updatedRecord) {
        return res.status(404).json({ error: 'Record not found' });
      }
  
      // Step 4: Send Response
      res.json( updatedRecord );
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

// Delete a review
module.exports.del = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedRecord = await Review.findByIdAndDelete(id);
  
  
      if (!deletedRecord) {
        return res.status(404).json({ error: 'Record not found' });
      }
          
          // Step 4: Send Response
          res.json({ message: 'Record deleted successfully'});
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      };


      
  module.exports.reviewGetById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find record by ID
      const record = await Review.findById(id);
  
      if (!record) {
        return res.status(404).json({ error: 'Record not found' });
      }
  
      // If record found, send it in the response
      res.json(record );
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };