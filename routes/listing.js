const express = require("express");
const router = express.Router();
const flash = require("connect-flash");

const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {listingSchema} = require("../schema.js");                     //Joi
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn } = require("../middleware.js");

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    
     if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
     }else{
        next();
     }
}


//INDEX ROUTE
router.get("/", wrapAsync(async (req,res) => {                       //"listings" route to find all the data in collection
    const allListings = await Listing.find({});                 //Listing => COllection
        res.render("listings/index.ejs", {allListings});
}));

//NEW Route
router.get("/new",isLoggedIn, (req,res) => {
    console.log(req.user)
    res.render("listings/new.ejs");
})

//SHOW Route
router.get("/:id", wrapAsync(async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested doesnot exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}));

// CREATE Route
router.post("/",isLoggedIn,validateListing, wrapAsync(async (req,res,next) => { 
    // if(!req.body.listing){
    //     throw new ExpressError(400, "send valid data for listing");
    // }    
    const newListing = new Listing(req.body.listing);               //Listing => Collection name (inserting into collection)
    newListing.owner = req.user._id;      
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
    })
);

// EDIT Route
router.get("/:id/edit",isLoggedIn, wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested doesnot exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}));

// UPDATE Route
router.put("/:id",isLoggedIn,validateListing, wrapAsync(async(req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}));

// DELETE Route
router.delete("/:id",isLoggedIn, wrapAsync(async (req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "New Listing Deleted");
    res.redirect("/listings");
}));

module.exports = router;