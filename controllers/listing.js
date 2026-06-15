const Listing = require("../models/listing");

module.exports.index=async (req,res)=>{
   const allListings = await Listing.find({});
   res.render("listings/index", { allListings });
};

module.exports.renderNewForm= (req,res)=>{
    res.render("listings/new");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");

    listing.image.url = listing.image.url.replace(
        "/upload",
        "/upload/w_800,h_500,c_fill,q_auto,f_auto"
    );

    res.render("listings/show.ejs", { listing });
};
module.exports.createListing = async (req, res) => {
    const newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;

    newListing.image = {
        url: req.file.path,
        filename: req.file.filename,
    };

    await newListing.save();

    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
};

  module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    let originalImageUrl = listing.image.url.replace(
        "/upload",
        "/upload/w_250,h_250,c_fill,q_auto,f_auto"
    );

    res.render("listings/edit.ejs", {
        listing,
        originalImageUrl,
    });
};
  module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        { new: true }
    );

    // If a new image is uploaded
    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;

        listing.image = {
            url,
            filename,
        };

        await listing.save();
    }

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};

    module.exports.deleteListing=async(req,res)=>{
    const { id } = req.params;

    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
};