const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const reviewSchema = require("./review.js").schema;


const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        filename: {
            type: String,
            default: "listingimage",
        },
        url: {
            type: String,
            default:
                "https://unsplash.com/photos/white-and-brown-concrete-building-near-swimming-pool-during-daytime-GSL3IuuwJv8",
            set: (v) =>
                v === ""
                    ? "https://unsplash.com/photos/white-and-brown-concrete-building-near-swimming-pool-during-daytime-GSL3IuuwJv8"
                    : v,
        },
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    country: {
        type: String,
        required: true,
        trim: true,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    // category:{
    //     type:string,
    //     enum:["mountains","arctic","farms","pool"]
      

    // },

});
listingSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await mongoose.model("Review").deleteMany({
            _id: { $in: doc.reviews },
        });
    }
});
module.exports = mongoose.model("Listing", listingSchema);