const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteReview, getProductList } = require('../controllers/productsControllers');
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");

const router = express.Router();

router.route("/admin/product/new").post(isAuthenticatedUser, createProduct);
router.route("/products").get(getAllProducts);
router.route("/admin/products").get(isAuthenticatedUser, getProductList);
router.route("/admin/update/:id").put(isAuthenticatedUser, updateProduct);
router.route("/admin/product/:id")
      .delete(isAuthenticatedUser, deleteProduct);
router.route("/product/:id").get(getProductDetails);
router.route("/review").put(isAuthenticatedUser, createProductReview);
router.route("/reviews").get(getProductReviews).delete(isAuthenticatedUser, deleteReview);

module.exports = router;