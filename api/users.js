const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/users');
const passwordValidation = require('../validation');
const verify = require('./verifyToken');

const saltRounds = 10;

// GET all users
router.get('/', verify, async (req, res) => {
  try{
    const users = await User.findAll();
    res.json(users);
  }
  catch(err){
    res.json({msg: err});
  }
});

//POST new user
router.post('/', verify, async (req, res) => {
    const {error} = passwordValidation({password:req.body.password});
    if(error) return res.status(400).send(error.details[0].message);
    bcrypt.hash(req.body.password, saltRounds, async (encryptErr, hashedPassword) => {
      if (encryptErr){
        res.json({msg: encryptErr})
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
        catch(err){
          res.json({msg: err.errors[0].message});
        }
      }
    });
});

//GET user by id
router.get('/:userId', verify, async (req, res) => {
  try{
    const user = await User.findByPk(req.params.userId);
    res.json(user);
  }
  catch(err){
    res.json({msg: err});
  }
});

// DELETE user by id
router.delete('/:userId', verify, async (req, res) => {
  try{
    const user = await User.findByPk(req.params.userId);
    await user.destroy();
    res.json(user);
  }
  catch(err){
    res.json({msg: err});
  }
});

module.exports = router;