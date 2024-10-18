const Listing = require("../models/list.js");
const Review = require('../models/review.js');



module.exports.index = async (req, res,) => {
    const allListings = await Listing.find({}).populate('reviews');

    // Calculate average rating for each listing
    for (let listing of allListings) {
        if (listing.reviews.length > 0) {
            let totalRating = 0;
            listing.reviews.forEach(review => {
                totalRating += review.rating;
            });
            listing.avgRating = (totalRating / listing.reviews.length).toFixed(1);
        } else {
            listing.avgRating = '0';
        }
    }

    res.render('listings/index', { allListings });
};

module.exports.renderCreateForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.show = async (req, res,) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: { path: "author" }
    }).populate('owner');

    if (!listing) {
        req.flash("error", "Listing You requested does not Exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
}

module.exports.createNewListing = async (req, res,) => {
    // console.log(req.body);  // Log the request body to debug
    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = { url, filename };
    await newlisting.save();
    req.flash("success", "New Listing created Successfully!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing You requested does not Exist!");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_200,w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
}

module.exports.updateListing = async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(("Enter a Valid Listing", 400));
    }
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Updated Successfully!");
    res.redirect(`/listings/${id}`);
}

module.exports.distroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListings = await Listing.findByIdAndDelete(id);
    console.log(deletedListings);
    req.flash("success", "Deleted Successfully!");
    res.redirect("/listings");
}
module.exports.filterListings = async (req, res, next) => {
    const { q } = req.params;
    const filteredListings = await Listing.find({ category: q }).exec();
    if (!filteredListings.length) {
        req.flash("error", "No Listings exists for this filter!");
        res.redirect("/listings");
        return;
    }
    res.locals.success = `Listings Filtered by ${q}`;
    res.render("listings/index.ejs", { allListings: filteredListings });
}

module.exports.search = async (req, res) => {
    console.log(req.query.q);
    let input = req.query.q.trim().replace(/\s+/g, " "); //remove start and end space
    console.log(input);
    if (input == "" || input == " ") {
        //search value is empty
        req.flash("error", "Search value empty!!!");
        res.redirect("/listings");
    }

    //convert every word first letter capital and other small
    let data = input.split("");
    let element = "";
    let flag = false;
    for (let index = 0; index < data.length; index++) {
        if (index == 0 || flag) {
            element = element + data[index].toUpperCase();
        } else {
            element = element + data[index].toLowerCase();
        }
        flag = data[index] == " ";
    }
    console.log(element);

    let allListings = await Listing.find({
        title: { $regex: element, $options: "i" },
    });
    if (allListings.length != 0) {
        res.locals.success = "Listings searched by title";
        res.render("listings/index.ejs", { allListings });
        return;
    }
    if (allListings.length == 0) {
        allListings = await Listing.find({
            category: { $regex: element, $options: "i" },
        }).sort({ _id: -1 });
        if (allListings.length != 0) {
            res.locals.success = "Listings searched by category";
            res.render("listings/index.ejs", { allListings });
            return;
        }
    }
    if (allListings.length == 0) {
        allListings = await Listing.find({
            country: { $regex: element, $options: "i" },
        }).sort({ _id: -1 });
        if (allListings.length != 0) {
            res.locals.success = "Listings searched by country";
            res.render("listings/index.ejs", { allListings });
            return;
        }
    }
    if (allListings.length == 0) {
        allListings = await Listing.find({
            location: { $regex: element, $options: "i" },
        }).sort({ _id: -1 });
        if (allListings.length != 0) {
            res.locals.success = "Listings searched by location";
            res.render("listings/index.ejs", { allListings });
            return;
        }
    }

    const intValue = parseInt(element, 10); //10 for decimal return - int ya NaN
    const intDec = Number.isInteger(intValue); //check intValue is number or not

    if (allListings.length == 0 && intDec) {
        allListings = await Listing.find({ price: { $lte: element } }).sort({
            price: 1,
        });
        if (allListings.length != 0) {
            res.locals.success = `Listings searched for less than Rs ${element}`;
            res.render("listings/index.ejs", { allListings });
            return;
        }
    }
    if (allListings.length == 0) {
        req.flash("error", "Listings is not here !!!");
        res.redirect("/listings");
    }
}