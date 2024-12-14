// const Listing = requuire('../models/listing.js');
// const Review = require("../models/review.js");

// module.exports.createReview = async(req,res) => {
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);
//     newReview.author = req.user._id;

//     listing.reviews.push(newReview);

//     await newReview.save();
//     await listing.save();
//     req.flash("success", "New Review Created");
//    res.redirect(`/listings/${listing._id}`);
// }

// module.exports.destroyReview = async (req,res) => {
//     let {id, reviewId } = req.params;
//     await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
//     await Review.findByIdAndDelete(reviewId);
//     req.flash("success", "Deleted Review");

//     res.redirect(`/listings/${id}`);
// }

const Listing = require('../models/listing.js');
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
    const { id } = req.params; // Access the listing ID from route params
    const listing = await Listing.findById(id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Created");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
    const { id, reviewId } = req.params; // Access listing ID and review ID from route params
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Deleted Review");
    res.redirect(`/listings/${id}`);
};