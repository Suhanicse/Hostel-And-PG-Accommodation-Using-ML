if(process.env.NODE_ENV != "production") {
    require('dotenv').config({ quiet: true });
}

// console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema} = require("./schema.js");  //grey color mean it is not getting use in this file
const Review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const MONGO_URL ="mongodb://127.0.0.1:27017/pgAccomadation";

main()
   .then(() => {
    console.log("connected to DB");
   }).catch((err) => {
    console.log(err);
   });

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views",  path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static("public"));

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
        cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;  //Lec-51(03)
    next();
});

//Lec - 50(08)
/*app.get("/demouser", async(req, res) => {
    let fakeUser = new User ({
        email: "student@gmail.com",
        username: "delta-student"
    });
    let registeredUser = await User.register(fakeUser, "helloworld");
    res.send(registeredUser);
}); */


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter)

// app.get("/testListing", async(req, res) => {
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India"
//     });

//    await sampleListing.save();
//    console.log("sample was saved");
//    res.send("successful testing!")
// });



//Create Route
/*app.post("/listings", wrapAsync(async (req, res, next) => {
    if (!req.body.listings) {
            throw new ExpressError(404,"Send valid data for listing");
    }
    // let {title, description, image, price, country, location} = req.body; 
    const newListing = new Listing(req.body.listing);
     if(!newListing.title) {
        throw new ExpressError(400, "Title is missing!")
    }
    if(!newListing.description) {
        throw new ExpressError(400, "Description is missing!")
    }
     if(!newListing.location) {
        throw new ExpressError(400, "Location is missing!")
    }
    await newListing.save();
    res.redirect("/listings");
   })
);   */


app.use((req, res, next) => { 
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let {statusCode=500, message="Something went wrong"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{err});
}); 

app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});  