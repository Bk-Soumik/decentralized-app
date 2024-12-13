const path = require("path");
const express = require("express");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
// const Listing = require("./models/listing.js");
// const Review = require("./models/review.js");
// const {listingSchema, reviewSchema} = require("./schema.js");                     //Joi
const methodOverride = require("method-override");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

const app = express();
app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.set("views", path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(() => {
    console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);                      //Connected to database 
}

// const validateListing = (req,res,next) => {
//     let {error} = listingSchema.validate(req.body);
    
//      if(error){
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//      }else{
//         next();
//      }
// }

// const validateReview = (req,res,next) => {
//     let {error} = reviewSchema.validate(req.body);
    
//      if(error){
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//      }else{
//         next();
//      }
// }

const sessionOptions = {
    secret: "mySuperSecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.get("/", (req,res) => {                                 //home route
    res.send("connected");
})

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.get("/demouser", async(req, res) => {
    let fakeUser = new User({
        email: "student@gmail.com",
        username: "bk_soumik",
    });

    let registeredUser = await User.register(fakeUser, "helloworld");
    res.send(registeredUser);
})

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// //INDEX ROUTE
// app.get("/listings", wrapAsync(async (req,res) => {                       //"listings" route to find all the data in collection
//     const allListings = await Listing.find({});                 //Listing => COllection
//         res.render("listings/index.ejs", {allListings});
// }));

// //NEW Route
// app.get("/listings/new", (req,res) => {
//     res.render("listings/new.ejs");
// })

// // CREATE Route
// app.post("/listings",validateListing, wrapAsync(async(req,res,next) => { 
//     // if(!req.body.listing){
//     //     throw new ExpressError(400, "send valid data for listing");
//     // }    
//    let result = listingSchema.validate(req.body);
//    console.log(result);
//     const newListing = new Listing(req.body.listing);        //Listing => Collection name (inserting into collection)
//     await newListing.save();
//     res.redirect("/listings");
//     })
// );

// //REVIEW Route
// app.post("/listings/:id/reviews", validateReview, wrapAsync(async(req,res) => {
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);

//     listing.reviews.push(newReview);

//     await newReview.save();
//     await listing.save();
//    res.redirect(`/listings/${listing._id}`);
// })
// );

// //DELETE REVIEW ROUTE
// app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req,res) => {
//     let {id, reviewId } = req.params;
//     await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
//     await Review.findByIdAndDelete(reviewId);

//     res.redirect(`/listings/${id}`);
// }))

// //SHOW Route
// app.get("/listings/:id", wrapAsync(async(req,res) =>{
//     let {id} = req.params;
//     const listing = await Listing.findById(id).populate("reviews");
//     res.render("listings/show.ejs", {listing});
// }));

// // EDIT Route
// app.get("/listings/:id/edit", wrapAsync(async (req,res) => {
//     let {id} = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs", {listing});
// }));

// // UPDATE Route
// app.put("/listings/:id",validateListing, wrapAsync(async(req,res) => {
//     let {id} = req.params;
//     await Listing.findByIdAndUpdate(id, {...req.body.listing});
//     res.redirect(`/listings/${id}`);
// }));

// // DELETE Route
// app.delete("/listings/:id", wrapAsync(async (req,res) => {
//     let {id} = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     res.redirect("/listings");
// }));

app.all("*", (req,res,next) => {                                        //Random other routes
    next(new ExpressError(404, "Page not found"));
})

app.use((err,req,res,next) => {                                         //wrong Schema type
    let {statusCode = 500, message = "Something went wrong!"} = err;
    res.status(statusCode).render("listings/error.ejs", {err});
})

app.listen(3000,() => {
    console.log("connected to port 3000");
})