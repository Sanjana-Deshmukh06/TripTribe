const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");

const reviewController = require("../controllers/review.js");

//post route reviews
router.post("/",isLoggedIn,wrapAsync(reviewController.createReview));

// delete review route
router.delete("/:reviewId",isLoggedIn, wrapAsync(reviewController.distroyReview));

module.exports = router;