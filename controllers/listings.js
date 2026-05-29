const Listing = require("../models/listing.js");
const axios = require("axios");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({}).populate("reviews");

    // 🔥 min & max price nikaalo
  const prices = allListings.map(l => l.price);

const minPrice = prices.length ? Math.min(...prices) : 0;
const maxPrice = prices.length ? Math.max(...prices) : 10000;

    res.render("listings/index.ejs", { 
        allListings,
        minPrice,
        maxPrice
    });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
       let {id} = req.params;
       const listing = await Listing.findById(id)
          .populate({path: "reviews", 
            populate: { path: "author",}})
          .populate("owner"); 
       if(!listing) {
          req.flash("error", "Listing you requested for does not exist!");
          return res.redirect("/listings");
       }
       console.log(listing);
       res.render("listings/show.ejs", {listing});
 };

module.exports.createListing = async (req, res, next) => {

   let url = req.file.path;
   let filename = req.file.filename;

   let location = req.body.listing.location;

   const geoData = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${location}`,
      {
         headers: {
            "User-Agent": "wanderlust-app"
         }
      }
   );

  let lat = parseFloat(geoData.data[0].lat);
  let lon = parseFloat(geoData.data[0].lon);

   const newListing = new Listing(req.body.listing);

   newListing.owner = req.user._id;
   newListing.image = { url, filename };

   newListing.geometry = {
      type: "Point",
      coordinates: [lon, lat],
   };

   if (!newListing.phone) {
      newListing.phone = null;
   }

   await newListing.save();

   req.flash("success", "New Listing Created!");
   res.redirect("/listings");
};

module.exports.renderEditForm = async(req, res) => {
     let {id} = req.params;
     const listing = await Listing.findById(id);  
     if(!listing) {
          req.flash("error", "Listing you requested for does not exist!");
          return res.redirect("/listings");
       }

     let originalImageUrl = listing.image.url;
     originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250" );
     res.render("listings/edit.ejs", { listing, originalImageUrl});
 };

 module.exports.updateListing = async (req, res) => {
      // This will not check the all body data add into database that's why we validate the schema.
      let { id } = req.params;
      let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });  //all form data come except image file
      
      if(typeof req.file != "undefined") {   //typeof check req.file have defined/undefined 
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
      await listing.save();
      } 
       
      req.flash("success", "Listing Updated!");
      res.redirect(`/listings/${id}`);
  };

module.exports.destroyListing = async(req, res) => {
      let {id} = req.params;
      let deletedListing = await Listing.findByIdAndDelete(id);
      console.log(deletedListing);
      req.flash("success", "Listing deleted!");
      res.redirect("/listings");
 }; 


module.exports.searchListings = async (req, res) => {
  let { location, maxPrice } = req.query;

  try {
    let query = {};

    // 🔍 location filter
    if (location && location.trim() !== "") {
      query.location = { $regex: location, $options: "i" };
    }

    // 💰 price filter
    if (maxPrice && maxPrice !== "") {
      query.price = { $lte: parseInt(maxPrice) };
    }

    const listings = await Listing.find(query).populate("reviews");

    if (listings.length === 0) {
      req.flash("error", "No listings found");
      return res.redirect("/listings");
    }

    // 🔥 IMPORTANT: maxPrice dubara bhejna hoga warna error aayega
    const prices = listings.map(l => l.price);
    const minPrice = Math.min(...prices);
    const newMaxPrice = Math.max(...prices);

    res.render("listings/index.ejs", {
      allListings: listings,
      minPrice,
      maxPrice: newMaxPrice
    });

  } catch (err) {
    console.log(err);
    req.flash("error", "Search failed");
    res.redirect("/listings");
  }
};
    
