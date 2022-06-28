const express = require('express');
const router = express.Router();

const {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/products-controllers");

router.route("/").post(createProduct).get(getProducts);
router.route("/:id").get(getProduct).patch(updateProduct).delete(deleteProduct);

module.exports = router;