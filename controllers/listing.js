// MVC framework

const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const listingData = await Listing.find();
  res.render("./listings/view.ejs", { listingData});
};

module.exports.newRoute = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.showRoute = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "The listing you are searching for does not exit. ");
    return res.redirect("/listing");
  }
  res.render("./listings/show.ejs", { listing });
};

module.exports.createRoute = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "listing added successfully.");
  res.redirect("/listing");
};

module.exports.editRoute = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "The listing you are searching for does not exit. ");
    return res.redirect("/listing");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl =  originalImageUrl.replace("/upload","/upload/w_200");
  res.render("./listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateRoute = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated.");
  res.redirect(`/listing/${id}`);
};

module.exports.deleteRoute = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted.");
  res.redirect("/listing");
};

module.exports.filterRoute = async(req,res)=>{
    let {category} = req.params;
    const listing = await Listing.find({ category });
    if(!listing){
      req.flash("error","No such listing found.");
    }
    res.render("./listings/filter.ejs", { listing });
};

module.exports.searchRoute = async (req, res)=>{
    let query = req.query.location;
        const regex = new RegExp(query,"i"); // it will search for any type of string...
        let listing = await Listing.find({location:regex});
        res.render("./listings/filter.ejs",{listing});
}
