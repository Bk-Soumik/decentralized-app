const path = require("path");
const express = require("express");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Listing = require("./models/listing.js");

const app = express();
app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,"/public")));

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(() => {
    console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);                      //Connected to database 
}

app.get("/", (req,res) => {                                 //home route
    res.send("connected");
})

app.get("/listings", async (req,res) => {                       //"listings" route to find all the data in collection
    const allListings = await Listing.find({});                 //Listing => COllection
        res.render("listings/index.ejs", {allListings});
})

app.get("/listings/new", (req,res) => {
    res.render("listings/new.ejs");
})

app.post("/listings", async(req,res) => {
    //let {title, description, image, price, country, location} = req.body;
    const newListing = new Listing(req.body.listing);        //Listing => Collection name (inserting into collection)
    await newListing.save();
    res.redirect("/listings");
});

app.get("/listings/:id", async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
})

app.get("/listings/:id/edit", async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
})

app.put("/listings/:id", async(req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
});

app.delete("/listings/:id", async (req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})

app.listen(3000,() => {
    console.log("connected to port 3000");
})