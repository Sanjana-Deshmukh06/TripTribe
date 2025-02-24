const Listing = require("../models/list.js");
const Review = require("../models/review.js")

//Create Review
module.exports.createReview= async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview)

    await newReview.save();
    await listing.save();

    console.log("working");
    req.flash("success", "New Revielw added Successfully!");

    res.redirect(`/listings/${listing._id}`);
}

//Delete Review
module.exports.distroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted Successfully!");

    res.redirect(`/listings/${id}`);
}