const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema} = require("../schemaValidation.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


module.exports.postReviewRoute = async(req,res)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  // console.log(newReview);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash('success','Review added!');
  res.redirect(`/listing/${id}`)
}

module.exports.deleteReviewRoute = async(req,res)=>{
  let {id, reviewId} = req.params;
  await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash('success','Review deleted successfully.');
  res.redirect(`/listing/${id}`);
}