const Product = require("../models/product");
const shortid = require("shortid");
const slugify = require("slugify");
const Category = require("../models/category");
const product = require("../models/product");

exports.createProduct = (req, res) => {
  const { name, price, description, quantity, category, createdBy } = req.body;

  let productPictures = [];

  if (req.files.length > 0) {
    productPictures = req.files.map((file) => {
      return { img: file.filename };
    });
  }

  const product = new Product({
    name,
    slug: slugify(name),
    price,
    description,
    productPictures,
    category,
    quantity,
    createdBy: req.user._id,
  });

  product.save((error, product) => {
    if (error) return res.status(400).json({ error });
    if (product) {
      res.status(201).json({
        product,
        files: req.files,
      });
    }
  });
};

exports.getProductsBySlug = (req, res) => {
  const { slug } = req.params;
  Category.findOne({ slug: slug })
    .select("_id")
    .exec((error, category) => {
      if (error) {
        return res.status(400).json({ error });
      }

      if (category) {
        Product.find({ category: category._id }).exec((error, products) => {
          if (error) {
            return res.status(400).json({ error });
          }

          if (products.length > 0) {
            res.status(200).json({
              products,
              productsByPrice: {
                under100: products.filter((product) => product.price <= 100),
                under200: products.filter(
                  (product) => product.price > 100 && product.price <= 200
                ),
                under300: products.filter(
                  (product) => product.price > 200 && product.price <= 300
                ),
                under500: products.filter(
                  (product) => product.price > 300 && product.price <= 500
                ),
                under5000: products.filter(
                  (product) => product.price > 500 && product.price <= 5000
                ),
              },
            });
          }
        });
      }
    });
};
