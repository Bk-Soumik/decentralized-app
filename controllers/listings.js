const Listing = require("../models/listing");

module.exports.index = async (req,res) => {                       //"listings" route to find all the data in collection
    const allListings = await Listing.find({});                 //Listing => COllection
        res.render("listings/index.ejs", {allListings});
}

module.exports.renderNewForm = (req,res) => {
    console.log(req.user)
    res.render("listings/new.ejs");
}

module.exports.showListing = async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: "author"}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested doesnot exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}

module.exports.createListing = async (req,res,next) => { 
    // if(!req.body.listing){
    //     throw new ExpressError(400, "send valid data for listing");
    // }    
    const newListing = new Listing(req.body.listing);               //Listing => Collection name (inserting into collection)
    newListing.owner = req.user._id;      
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
    }

module.exports.renderEditForm = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested doesnot exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}

module.exports.updateListing = async(req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyRoute = async (req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "New Listing Deleted");
    res.redirect("/listings");
}