if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsmate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");

const dbUrl = process.env.ATLASDB_URL;

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const UserRouter = require("./routes/user.js");




app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname, 'public')));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    collectionName: "sessions_final",
    stringify: false,
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("Error in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

//app.get("/", (req, res) => {
//    res.send("Airbnb Project is running!");
//});



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
    res.locals.currUser = req.user;
    next();
});

//app.get("/demouser", async(req, res) => {
//    let fakeUser = new User({
//        email: "student@gmail.com",
//        username: "Ashif-Ali",
//    });

//    let registeredUser = await User.register(fakeUser, "helloworld");
//    res.send(registeredUser);
//});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", UserRouter);
app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "page not found!"));
})

app.use((err, req, res, next) => {
    console.log("ACTUAL ERROR:", err);

    if (res.headersSent) {
        return next(err);
    }

    let { statuscode = 500, message = "something went wrong!" } = err;
    res.status(statuscode).render("error.ejs", { message });
});

const PORT = process.env.PORT || 8080;

async function main() {
    try {
        await mongoose.connect(dbUrl);
        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.log("MongoDB connection error:", err);
    }
}

main();