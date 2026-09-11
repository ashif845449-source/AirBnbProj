const express = require("express");
const router = express.Router({ mergeParams: true });
const WrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");


// POST review
router.post("/", validateReview, isLoggedIn, WrapAsync(reviewController.createReview));

// DELETE review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, WrapAsync(reviewController.deleteReview));

module.exports = router;