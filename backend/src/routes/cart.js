const express = require("express");
const { addItemToCart } = require("../controllers/cart");
const { requireSignin, userMiddleware } = require("../middlewares");
const router = express.Router();

router.post(
  "/user/cart/addtocart",
  requireSignin,
  userMiddleware,
  addItemToCart
);

module.exports = router;
