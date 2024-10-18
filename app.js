if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local")
const User = require("./models/user.js");
const ExpressError = require("./utils/ExpressError.js");



const reviewsRouter = require("./routes/reviewsRouter.js");
const listingsRouter = require("./routes/listingsRouter.js");
const userRouter = require("./routes/userRouter.js");


// const mongo_URL = "mongodb://127.0.0.1:27017/wanderLust";

const dbUrl = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("connected to DB");
    }).catch((err) => {
        console.log(err);
    });


async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 365 * 24 * 60 * 60 * 1000,
        maxAge: 365 * 24 * 60 * 60 * 1000,
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
    res.locals.currUser = req.user || null;
    console.log("Current User in template:", req.user);

    next();
})

// app.get("/register", async (req, res) => {
//     let fakeUser = new User({
//         email: "abc@gmail.com",
//         username: "delta-student",
//     })
//     let newUser = await User.register(fakeUser, "hello!");
//     res.send(newUser);
// })

app.use("/listings", listingsRouter);

app.get("/privacy", (req, res) => {
    res.render("privacy");
})

app.get('/terms', (req, res) => {
    res.render("terms");
})
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

app.use((req, res, next) => {
    res.locals.currUser = req.user || null;
    next();
});

//middleware
app.all("*", (req, res, next) => {
    console.log("You are tring to visit wrong link");
    next(new ExpressError(503, "Site is temporarily under maintenance"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("errors/error.ejs", { err });
    console.log("middleware is triggered ")

});



app.listen(8080, () => {
    console.log("app is listening at 8080 port");
});