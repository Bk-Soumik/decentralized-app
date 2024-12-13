const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.renderLoginForm = (req,res) => {
    res.render("users/login.ejs");
}

module.exports.login = async(req,res) => {
        req.flash("success","welcome to WanderLust You are logged in.");
        res.redirect(req.locals.redirectUrl || '/listings');
}

module.exports.logout = (req,res,next) => {
    req.logout((err) => {
        if(err) {
            next(err);
        }
        req.flash("success","logged out successfully");
        res.redirect("/listings");
    })
}

module.exports.signup = async(req,res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success","welcome to WanderLust");
            res.redirect("/listings");
        })
    } catch(err) {
        req.flash("error",err.message);
        res.redirect("/signup");
    } 
}