const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findById(id);

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    await newReview.save();

    listing.reviews.push(newReview);
    await listing.save();

    req.flash("success", "Review added successfully!");

    res.redirect(`/listings/${id}`);
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId },
    });

    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted!");

    res.redirect(`/listings/${id}`);
};