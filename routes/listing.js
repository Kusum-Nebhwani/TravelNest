const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
// Search route
router.get("/search", wrapAsync(listingController.searchListings));


router
  .route("/")
  //index route
  .get(wrapAsync(listingController.index))
  //create route
  .post(
    isLoggedIn,
    validateListing,
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing)
  );

//new route
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

router
  .route("/:id")
  //update route
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    upload.single("listing[image]"),
    wrapAsync(listingController.updateListing)
  )
  //show route
  .get(wrapAsync(listingController.showListing))
  //delete route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);


// Search route (newly added)
router.get("/search", wrapAsync(async (req, res) => {
  try {
    const { country } = req.query;
    let listings;

    if (country) {
      listings = await Listing.find({ country: new RegExp(country, 'i') });
    } else {
      listings = await Listing.find();
    }

    // Render or respond with the listings data
    res.render("listings", { listings }); // Adjust render method as needed
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).send('Internal Server Error');
  }
}))

module.exports = router;
