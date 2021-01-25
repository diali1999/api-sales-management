const express = require('express');
const router = express.Router();

const verify = require('./verify');
const Order = require('../models/orders');

//GET all orders
router.get('/', verify, async (req, res) => {
    try{
      const orders = await Order.findAll();
      res.json(orders);
    }
    catch(err){
      res.json({msg: err});
    }
  });

//GET order by id
router.get('/:orderId', verify, async (req, res) => {
    try{
      const order = await Order.findByPk(req.params.orderId);
      res.json(order);
    }
    catch(err){
      res.json({msg: err});
    }
});

// DELETE order by id
router.delete('/:orderId', verify, async (req, res) => {
    try{
      const order = await Order.findByPk(req.params.orderId);
      await order.destroy();
      res.json(order);
    }
    catch(err){
      res.json({msg: err});
    }
  });