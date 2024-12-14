// const express = require("express");
// const router = express.Router({mergeParams: true});
// const wrapAsync = require("../utils/wrapAsync.js");
// const {validateReview, isLoggedIn} = require("../middleware.js");
// const reviewController = require("../reviews/review.js");

// //REVIEW Route
// router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// //DELETE REVIEW ROUTE
// router.delete("/:reviewId", isLoggedIn, wrapAsync(reviewController.destroyReview));

// module.exports = router;

const express = require("express");
const router = express.Router({ mergeParams: true }); // Ensure access to parent route params
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// Create Review Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete Review Route
router.delete("/:reviewId", isLoggedIn, wrapAsync(reviewController.destroyReview));

module.exports = router;