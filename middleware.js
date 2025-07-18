const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError");
const {listingSchema , reviewSchema} = require("./schemaValidation.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged In to create new listing.");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission for this listing.");
        return res.redirect(`/listing/${id}`);
    }
    next()
}

module.exports.validationError = (req,res,next)=>{
   let {error} = listingSchema.validate(req.body);
    // console.log(error);
    if (error) {
      let errMsg = error.details.map((el)=> el.message).join(',');
      throw new ExpressError(400, errMsg);
    }else{
      next();
    }
}  

module.exports.reviewValidationError = (req,res,next)=>{
   let {error} = reviewSchema.validate(req.body);
    // console.log(error);
    if (error) {
      let errMsg = error.details.map((el)=> el.message).join(',');
      throw new ExpressError(400, errMsg);
    }else{
      next();
    }
}  

module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review.");
        return res.redirect(`/listing/${id}`);
    }
    next()
}