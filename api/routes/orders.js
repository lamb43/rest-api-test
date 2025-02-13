const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Order.find()
    .select("-__v")
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + doc._id
            }
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.post("/", (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
      });
      return order.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "order stored",
        createdOrder: {
          orderId: result._id,
          quantity: result.quantity,
          product: result.product
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/orders/" + result._id
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "Product not found",
        error: err
      });
    });
});

router.get("/:orderId", (req, res, next) => {
  res.status(200).json({
    message: "order details",
    orderId: req.params.orderId
  });
});

router.delete("/:orderId", (req, res, next) => {
  res.status(200).json({
    message: "order deleted",
    orderId: req.params.orderId
  });
});

router.patch("/:productId", (req, res, next) => {
  res.status(200).json({
    message: "updated product"
  });
});

module.exports = router;
