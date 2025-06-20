const express = require("express");
const route = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const {reviewValidationError, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

//post route
route.post("/",isLoggedIn,reviewValidationError, wrapAsync(reviewController.postReviewRoute));

// delete route
route.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReviewRoute));

module.exports = route;