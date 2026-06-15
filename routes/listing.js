const express = require("express");
const router = express.Router({ mergeParams: true });
const listingController = require("../controllers/listing.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAync.js");
const ExpressError = require("../utils/ExpressError.js");
// const { validateListing } = require("../middleware.js");
const { listingSchema } = require("../schema.js");
const {isLoggedIn} = require("../middleware.js");
const {isOwner} = require("../middleware.js");

const multer = require("multer");
const {storage}= require("../cloudConfig.js");
const upload = multer({ storage});


const validateListing=(req,res,next)=>{
        let result=listingSchema.validate(req.body);
        console.log(result);
        if(result.error){
            let errorMessage=result.error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400, errorMessage);
        }
        else{
            next();
        }
    };


router.route("/")
.get(listingController.index)
.post(isLoggedIn,
     upload.single("listing[image]"),
         validateListing, 

     wrapAsync(listingController.createListing));




//New route
router.get("/new", isLoggedIn,listingController.renderNewForm);


//again used router.route for /:id for show update and delete
    router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner,     upload.single("listing[image]"),
validateListing,wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

// //index route done with router.route because start with /
// router.get("/", listingController.index);



// //Show route
// router.get("/:id",
// wrapAsync(listingController.showListing)
// );

//Create route

        // if(!req.body.listing) throw new ExpressError(400, "Invalid Listing Data");
        //JOI IS EASIER TO VALIDATE DATA BUT I AM NOT USING IT BECAUSE I WANT TO LEARN HOW TO VALIDATE WITHOUT JOI
        // if(!req.body.listing.image.url) req.body.listing.image.url = undefined;
        // if(!req.body.listing.image.filename) req.body.listing.image.filename = undefined;
        // if(req.body.listing.price < 0) throw new ExpressError(400, "Price cannot be negative");
        // if(req.body.listing.title.trim() === "") throw new ExpressError(400, "Title cannot be empty");
        // if(req.body.listing.description.trim() === "") throw new ExpressError(400, "Description cannot be empty");
        // if(req.body.listing.location.trim() === "") throw new ExpressError(400, "Location cannot be empty");
        // if(req.body.listing.country.trim() === "") throw new ExpressError(400, "Country cannot be empty");

    // done with router.route because start with /
//   router.post(
//     "/",
//     isLoggedIn,
//     validateListing,
//     wrapAsync(listingController.createListing)
// );

//Edit route
router.get("/:id/edit", isLoggedIn,isOwner,
wrapAsync(listingController.renderEditForm)
);

// //Update route
// router.put(
//     "/:id",
//     isLoggedIn,
//     isOwner,
//     validateListing,
//     wrapAsync(listingController.updateListing)
// );
// //Delete route
// router.delete("/:id", isLoggedIn,isOwner,
// wrapAsync(listingController.deleteListing)
// );
module.exports = router;