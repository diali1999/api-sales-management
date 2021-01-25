const express = require('express');
const router = express.Router();

const {verifyUser, verifyAdmin, authMiddleware} = require('./verify');
const Order = require('../models/orders');

router.use(authMiddleware);

//GET all orders
router.get('/', verifyAdmin, async (req, res) => {
    try{
      const orders = await Order.findAll();
      res.json(orders);
    }
    catch(err){
      res.json({msg: err});
    }
  });

//GET order by id
router.get('/:orderId', verifyAdmin, async (req, res) => {
    try{
      const order = await Order.findByPk(req.params.orderId);
      res.json(order);
    }
    catch(err){
      res.json({msg: err});
    }
});

// DELETE order by id
router.delete('/:orderId', verifyAdmin, async (req, res) => {
    try{
      const order = await Order.findByPk(req.params.orderId);
      await order.destroy();
      res.json(order);
    }
    catch(err){
      res.json({msg: err});
    }
  });