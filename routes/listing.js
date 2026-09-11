const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validatelisting } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
    .get(WrapAsync(listingController.index))
    .post(isLoggedIn, upload.single("listing[image]"), validatelisting, WrapAsync(listingController.createListing));

// 2. NEW ROUTE
router.get("/new", isLoggedIn, upload.single("listing[image]"), listingController.renderNewForm);

router.route("/:id")
    .put(
        isLoggedIn,
        isOwner,
        upload.single("image"),
        validatelisting,
        WrapAsync(listingController.updateListing)
    )
    .delete(isLoggedIn, isOwner, WrapAsync(listingController.deleteListing))
    .get(WrapAsync(listingController.showListing));

// 4. EDIT ROUTE
router.get("/:id/edit", isOwner, isLoggedIn, WrapAsync(listingController.renderEditForm));

module.exports = router;