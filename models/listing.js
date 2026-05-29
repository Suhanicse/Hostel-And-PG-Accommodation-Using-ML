const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true, 
    },
    description: String,
    image:  {
      url: String,
      filename: String,
    },
    price: {
       type: Number,
       required: true,
    },

    location: String,
    country: String,
    geometry: {
  type: {
    type: String,
    enum: ["Point"],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
},
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      }  
    ],
    likes: [
      {
         type: Schema.Types.ObjectId,
         ref: "User",
      }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});
listingSchema.index({ geometry: "2dsphere" });
  
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
       await Review.deleteMany({_id: {$in: listing.reviews} });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;