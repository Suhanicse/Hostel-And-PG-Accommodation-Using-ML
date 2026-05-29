const Listing = require("../models/listing");
const Review = require("../models/review");
const vader = require("vader-sentiment");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);

    let reviewText = req.body.review.comment;
    let text = reviewText.toLowerCase();

    // 🔥 VADER sentiment
    const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(reviewText);
    const score = intensity.compound;

    const rating = parseInt(req.body.review.rating);

    // 🔹 detect contrast (important for "but" cases)
    const hasContrast = text.includes("but") || text.includes("however");

    // 🔹 negative keywords
    const hasNegativeWord =
        text.includes("not") ||
        text.includes("bad") ||
        text.includes("worst") ||
        text.includes("dirty") ||
        text.includes("unsafe");

    // 🔹 VADER base flags
    let isPositiveText = score >= 0.05;
    let isNegativeText = score <= -0.05;

    // 🔹 override for strong negative phrases
    if (text.includes("not safe") || text.includes("unsafe")) {
        isNegativeText = true;
        isPositiveText = false;
    }

    // 🔥 FINAL LOGIC
    let sentiment;

    // ⚠️ mixed or contradiction → suspicious
    if ((hasContrast || hasNegativeWord) && rating >= 4) {
        sentiment = "suspicious";
    }
    else if (rating <= 2 && isPositiveText) {
        sentiment = "suspicious";
    }

    // ✅ positive
    else if (isPositiveText && rating >= 4) {
        sentiment = "positive";
    }

    // ❌ negative
    else if (isNegativeText && rating <= 2) {
        sentiment = "negative";
    }

    // ⚖️ neutral
    else {
        sentiment = "neutral";
    }

    // 💾 save
    let newReview = new Review({
        comment: reviewText,
        rating: rating,
        sentiment: sentiment,
        sentimentScore: score
    });

    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    await listing.populate("reviews");

    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
};
