const express = require('express');
const router = express.Router();
const {verifyUser, verifyAdmin, authMiddleware} = require('./verifyToken');
const Order = require('../models/orders');


router.use(authMiddleware);

const getCleanOrder = async (id) => {
  const order = await Order.findByPk(id);
  return order;
}
//GET all orders
router.get('/', verifyUser, async (req, res) => {
  try{
    if(req.user.role=='User'){
      const order = await Order.findAll({
              where:{userId: req.user.userId}
      });
      console.log(order);
      res.json(order);
    }
    else{
      const order = await Order.findAll();
      res.json(order);  }
    }
  catch(err){
    res.json({msg: err});
  }
});

//GET order by id
router.get('/:orderId', verifyUser, async (req, res) => {
    try{
    if(req.user.role =='Admin'){
      const order = await getCleanOrder(req.params.orderId);
      res.json(order);
    } 
    else {
        const order = await getCleanOrder(req.params.orderId);
        if(order.userId==req.user.userId){
        res.json(order);
       }
        else{
          res.status(401).send('Access Denied!');
        }
    }
  }
  catch(err){
    res.json({msg: err});
  }
});

router.post('/', verifyUser, async (req, res) => {
        try{

          if(req.user.role =='Admin'){
            res.status(401).send('Can\'t post!');
        } 
        else {
            const newOrder =  await Order.create({
            userId: req.user.userId,
            status: req.body.status,
            date: req.body.date,
            product: req.body.product,
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
          });
           const cleanOrder = await getCleanOrder(newOrder.id);
           res.json(cleanOrder);
        }
      }
        catch(err){
          res.json({msg: err.errors[0].message});
        }
});

router.put('/:orderId', verifyUser, async ( req, res) => {
  try{
    if(req.user.role=='Admin'){
      Order.update(
        req.body ,
      {
        where: {id: req.params.orderId}
      }).then(() => res.json({msg: "successfully updated!!"}));
    }
      else{
        const cleanOrder = await getCleanOrder(req.params.orderId);
        if(cleanOrder.userId==req.user.userId){
          Order.update(
          req.body ,
          {
            where: {id: req.params.orderId}
          }).then(() => res.json({msg: "successfully updated!!"}));
         }
      }
    }

  catch(err){
    res.json({msg: "update failed!!"});
  }
});

module.exports = router;