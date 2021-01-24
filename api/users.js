const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/users');

const saltRounds = 10;

router.get('/', async (req, res) => {
  try{
    const users = await User.findAll();
    res.json(users);
  }
  catch(err){
    res.json({msg: err});
  }
});

router.post('/', async (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, async (err, hashedPassword) => {
      if (err){
        console.log(err);
      }
      else{
        try{
          const newUser =  await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            email: req.body.email,
            hashedPassword: hashedPassword,
            DOB: req.body.DOB,
            role: req.body.role,
            department: req.body.department,
            DOJ: req.body.DOJ,
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
          });
          res.json(newUser);
        }
        catch(error){
          res.json({msg: error});
        }
      }
    });
});

router.get('/:id', async (req, res) => {
  try{
    const user = await User.findByPk(req.params.id);
    res.json(user);
  }
  catch(err){
    res.json({msg: err});
  }
});

router.delete('/:id', async (req, res) => {
  try{
    const user = await User.findByPk(req.params.id);
    await user.destroy();
    res.json(user);
  }
  catch(err){
    res.json({msg: err});
  }
});

module.exports = router;