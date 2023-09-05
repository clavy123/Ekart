const express = require("express")
const router = express.Router()
const {
    addProduct,
    getAllProducts,
    getSingleProduct,
    addReview,
    deleteReviews,
    deleteSingleProduct,
    updateProductAndPhotos,
    adminDelete,
    adminUpdate,
    getOnlyProductReviews,
   
} = require("../controllers/productController")
const {customRole,Authentication} = require("../middleware/auth")

router.route("/products").get(Authentication,getAllProducts)
router.route("/products/addProduct").post(Authentication,customRole("admin"),addProduct)
router.route("/product/:id").get(Authentication,getSingleProduct)
router.route("/product/user/:id").put(Authentication,updateProductAndPhotos).delete(Authentication,deleteSingleProduct)
router.route("/product/review").post(Authentication,addReview)
router.route("/product/review/:id").get(Authentication,getOnlyProductReviews)
router.route("/product/review/:id").delete(Authentication,deleteReviews)
router.route("/product/admin/:id").put(Authentication,adminUpdate).delete(Authentication,adminDelete)

module.exports = router