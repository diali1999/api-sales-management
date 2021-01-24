const express = require('express');
const router = express.Router();

const Order = require('../models/orders');

router.get('/', (req, res) => {
    Order.findAll()
      .then(orders => res.json(orders))
      .catch(err => console.log(err));
});

router.get('/:id', (req, res) => {
    Order.findByPk(req.params.id)
      .then(order => res.json(order))
      .catch(err => console.log(err));
});

router.delete('/:id', (req, res) => {
    Order.findByPk(req.params.id)
        .then(order => {
          order.destroy()
            .then(() => {
              console.log('Order deleted');
              res.json(order)
            })
            .catch(err => console.log(err));
        })
        .catch(error => console.log(error));
});