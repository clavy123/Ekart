const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    trim: true,
    maxlength: [120, "Product name is limited to 120 characters"],
  },
  price: {
    type: String,
    required: [true, "price is required"],
    maxlength: [6, "Product name is limited to 120 characters"],
  },
  descrition: {
    type: String,
    required: [true, "description is required"],
  },
  photos: [
    {
      id: {
        type: String,
       // required: true,
      },
      secure_url: {
        type: String,
       // required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [
      true,
      "please select category from short-sleeves,long-sleeves,sweat-shirts,hoodies",
    ],
    enum: {
      values: ["short-sleeves", "long-sleeves", "sweat-shirts", "hoodies"],
      message:
        "please select category from short-sleeves,long-sleeves,sweat-shirts,hoodies ",
    },
  },
  brand: {
    type: String,
    required: [true, "please add a brand for clothing"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  numberOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Product", ProductSchema);
