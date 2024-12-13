const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");


router
    .route("/")
    .get( wrapAsync(listingController.index))
    .post(isLoggedIn,validateListing, wrapAsync(listingController.createListing));

//INDEX ROUTE

//NEW Route
router.get("/new",isLoggedIn, listingController.renderNewForm);

//SHOW Route
router.get("/:id", wrapAsync(listingController.showListing));

// CREATE Route

// EDIT Route
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// UPDATE Route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

// DELETE Route
router.delete("/:id",isLoggedIn, isOwner, wrapAsync(listingController.destroyRoute));

module.exports = router;