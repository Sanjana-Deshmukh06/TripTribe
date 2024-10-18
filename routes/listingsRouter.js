const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//Index/Home route
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,
        upload.single('listing[image]'),
        wrapAsync(listingController.createNewListing));

//New Listing
router.get("/new", isLoggedIn, listingController.renderCreateForm)

router.route("/:id")
    .get(wrapAsync(listingController.show))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.distroyListing));
//search
router.get("/search", wrapAsync(listingController.search));

//edit route
router.get("/:id/edit", isLoggedIn,
    isOwner, wrapAsync(listingController.renderEditForm));

router.get("/privacy", (req, res) => {
    res.render("privacy.ejs");
})
module.exports = router;