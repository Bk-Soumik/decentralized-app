const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn} = require("../middleware.js");
const reviewController = require("../models/review.js");

//REVIEW Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//DELETE REVIEW ROUTE
router.delete("/:reviewId", isLoggedIn, wrapAsync(reviewController.destroyReview));

module.exports = router;