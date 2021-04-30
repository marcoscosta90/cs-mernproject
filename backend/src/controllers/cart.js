const Cart = require("../models/cart");

//Condition => we just can have one cart for user so this logic is bellow
exports.addItemToCart = (req, res) => {
  Cart.findOne({ user: req.user._id }).exec((error, cart) => {
    if (error) return res.status(400).json({ error });
    if (cart) {
      const product = req.body.cartItems.product;
      const item = cart.cartItems.find(
        (c) => c.product == req.body.cartItems.product
      );

      if (item) {
        Cart.findOneAndUpdate(
          { user: req.user._id, "cartItems.product": product },
          {
            "$set": {
              "cartItems": {
                ...req.body.cartItems,
                quantity: item.quantity + req.body.cartItems.quantity,
              },
            },
          }
        ).exec((error, _cart) => {
          if (error) return res.status(400).json({ error });
          if (_cart) {
            return res.status(201).json({ cart: _cart });
          }
        });
      } else {
        Cart.findOneAndUpdate(
          { user: req.user._id },
          { "$push": { "cartItems": req.body.cartItems } }
        ).exec((error, _cart) => {
          if (error) return res.status(400).json({ error });
          if (_cart) {
            return res.status(201).json({ cart: _cart });
          }
        });
      }
      //if cart already existis then update cart by quantity
      //return res.status(200).json({ message: cart });
    } else {
      //if cart not exists then create a new cart
      const cart = new Cart({
        user: req.user._id,
        cartItems: [req.body.cartItems],
      });

      cart.save((error, cart) => {
        if (error) return res.status(400).json({ error });
        if (cart) {
          return res.status(201).json({ cart });
        }
      });
    }
  });
};
