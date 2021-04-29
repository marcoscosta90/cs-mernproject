const express = require("express");
const { addCategory, getCategories } = require("../controllers/category");
const { requireSignin, adminMiddleware } = require("../middlewares");
const router = express.Router();

router.post("/category/create", requireSignin, adminMiddleware, addCategory);
router.get("/category/getcategory", getCategories);

module.exports = router;
