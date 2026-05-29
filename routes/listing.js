const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing,isOwnerRole } = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer  = require('multer')   //for parsing the form-data imagefile
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });  //save the file into "uploads"


//router.route---connect all requests or get/post having same path so that we don't have to write the same again and again
//index Route or Create Route
router.route("/")
   .get(wrapAsync(listingController.index))
   .post(isOwnerRole, 
         validateListing, 
         upload.single('listing[image]'),
         wrapAsync(listingController.createListing));

router.post("/:id/like", isLoggedIn, async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const userId = req.user._id;

  const alreadyLiked = listing.likes.includes(userId);

  if (alreadyLiked) {
    listing.likes.pull(userId);
  } else {
    listing.likes.push(userId);
  }

  await listing.save();

  res.json({
    likesCount: listing.likes.length,
    liked: !alreadyLiked
  });
});

// New Route  ---> it written before show route becoz it understand "new" as id
router.get("/new", isOwnerRole, listingController.renderNewForm);

router.get("/search", wrapAsync(listingController.searchListings));

//ShowRoute, UpdateRoute, DeleteRoute
router.route("/:id")
   .get(wrapAsync(listingController.showListing))
   .put(
           isOwnerRole,
           isOwner, 
           upload.single('listing[image]'),
           validateListing, 
           wrapAsync(listingController.updateListing))
    .delete( 
          isOwnerRole, 
          isOwner,
          wrapAsync(listingController.destroyListing));
  
 // Edit Route
 router.get("/:id/edit",
            isOwnerRole,
            isOwner, 
            wrapAsync(listingController.renderEditForm));

 module.exports = router;