const express = require("express");
const { createProduct } = require("../controllers/product");
//const { } = require("../controllers/category");
const { requireSignin, adminMiddleware } = require("../middlewares");
const multer = require("multer");
const router = express.Router();
const shortid = require("shortid");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/product/create",
  requireSignin,
  adminMiddleware,
  upload.single("productPicture"),
  createProduct
);
//router.get("/product/getcategory", getCategories);

module.exports = router;
