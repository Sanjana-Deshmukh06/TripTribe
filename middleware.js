const Listing = require("./models/list");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");

//middleware to check if user is loggedin or not
module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.user);
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Please Log in First!")
        return res.redirect("/login");
    }
    next();
}

//middleware used when you sign up and you redirect to the same page where you were tring to work
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl;
    }
    next();
}

//middleware to check you are owner or not
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
   

    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You dont have permission to make changes in this Listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//for validating Listing
// module.exports.validateListing = (req, res, next) => {
//     let {error} = listingSchema.validate(req.body);

//     if(error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     } else {
//         next();
//     }
// }

//for validating review
// module.exports.validateReview = (req, res, next) => {
//     let {error} = reviewSchema.validate(req.body);

//     if(error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     } else {
//         next();
//     }
// }

//review author
module.exports.isReviewAuthor = async (req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "you are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }

    next();
}