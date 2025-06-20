const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validationError} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

// using router.route
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,validationError,upload.single('listing[image]'),wrapAsync(listingController.createRoute));
// new route
router.get("/new", isLoggedIn, listingController.newRoute);


// search route
router.get("/search", wrapAsync(listingController.searchRoute));

router.route("/:id")
.get(wrapAsync(listingController.showRoute))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validationError,wrapAsync(listingController.updateRoute))
.delete( isLoggedIn,isOwner,wrapAsync(listingController.deleteRoute));

// view route
// router.get("/",wrapAsync(listingController.index));


// show route
// router.get("/:id",wrapAsync(listingController.showRoute));

// create route
// router.post("/",isLoggedIn,validationError,wrapAsync(listingController.createRoute));

// edit route
router.get("/:id/edit",isLoggedIn, isOwner,wrapAsync(listingController.editRoute));

// update route
// router.put("/:id",isLoggedIn,isOwner,validationError,wrapAsync(listingController.updateRoute));

// delete route
// router.delete("/:id", isLoggedIn,isOwner,wrapAsync(listingController.deleteRoute));

// filtered listing route
router.get("/category/:category", wrapAsync(listingController.filterRoute));
module.exports = router;