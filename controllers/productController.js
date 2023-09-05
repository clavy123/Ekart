const BigPromise = require("../middleware/promise");
const CustomError = require("../utils/customError");
const cloudinary = require("cloudinary");
const Product = require("../models/productModel");
const WhereClause = require("../utils/whereClause");

exports.getAllProducts = BigPromise(async (req, res, next) => {
  let resultPerPage = 5;
  const products = new WhereClause(Product.find(), req.query).search().filter();
  let product = await products.base;
  const filterProducNumber = product.length;
  products.pagination(resultPerPage);
  product = await products.base.clone();
  res.status(200).json({
    success: true,
    filterProducNumber,
    product,
  });
});


exports.addProduct = BigPromise(async (req, res, next) => {
  let imagesArray = [];
  if (!req.files) {
    return next(new CustomError("images are required", 401));
  }
  if (req.files) {
    for (let index = 0; index < req.files.photos.length; index++) {
      let result = cloudinary.v2.uploader.upload(
        req.files.photos[index].tempFilePath,
        {
          folder: "products",
        }
      );
      imagesArray.push({
        id: result.public_id,
        secure_url: result.secure_url,
      });
    }
  }
  req.body.photos = imagesArray;
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(200).json({
    success: true,
    product,
  });
});

exports.getSingleProduct = BigPromise(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  res.status(200).json({
    success: true,
    product,
  });
});

exports.deleteSingleProduct = BigPromise(async (req, res, next) => {
  const product = await Product.findOneAndDelete(req.query.id);
  res.status(200).json({
    success: true,
    product,
  });
});

exports.updateProductAndPhotos = BigPromise(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.query.id, req.body, {
    runValidators: true,
    new: true,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

exports.addReview = BigPromise(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const reviews = {
    user: req.user._id,
    rating: Number(rating),
    name: req.user.name,
    comment,
  };

  const product = await Product.findById(productId);
  const AlreadyReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (AlreadyReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() === req.user._id.toString()) {
        review.rating = rating;
        review.comment = comment;
      }
    });
  } else {
    product.reviews.push(reviews);
    product.numberOfReviews = product.reviews.length;
  }

  product.ratings =

    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;
  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success:
     true,
    product,
  });
});

exports.deleteReviews = BigPromise(async (req, res, next) => {
  const { productId } = req.body;
  const product = await Product.findById(productId);
  const filterReview = product.reviews.filter(
    (review) => review.user.toString() === req.user._id.toString()
  );
  product.numberOfReviews = product.reviews.length;
  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;
  await Product.findByIdAndUpdate(
    productId,
    {
      reviews: filterReview,
      ratings,
      numberOfReviews,
    },
    { new: true, runValidators: true }
  );
  res.status(200).json({
    success: true,
    product,
  });
});

exports.getOnlyProductReviews = BigPromise(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  console.log(product)
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

exports.adminUpdate = BigPromise(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    product,
  });
});
exports.adminDelete = BigPromise(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    product,
  });
});
