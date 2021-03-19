const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/users');
const passwordValidation = require('../validation');
const {verifyAdmin, verifyUser, authMiddleware} = require('./verifyToken');

const saltRounds = 10;

router.use(authMiddleware);

const getCleanUser = async (id) => {
  const user = await User.findByPk(id, {attributes:{exclude: ['hashedPassword']}});
  return user;
}

// GET all users
router.get('/',  verifyUser, async (req, res) => {
  try{
    if(req.user.role=='User'){
      const user = [await getCleanUser(req.user.userId)];
      res.json(user);
    } 
    else{
      const users = await User.findAll({attributes:{exclude: ['hashedPassword']}});
      res.json(users);
    }
  }
  catch(err){
    res.json({msg: err});
  }
});

//POST new user
router.post('/',  verifyAdmin, async (req, res) => {
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
            gender: req.body.gender,
            email: req.body.email,
            hashedPassword: hashedPassword,
            DOB: req.body.DOB,
            salary: req.body.salary,
            role: req.body.role,
            department: req.body.department,
            DOJ: req.body.DOJ,
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
          });
          const cleanUser = await getCleanUser(newUser.id);
          res.json(cleanUser);
        }
        catch(err){
          res.json({msg: err.errors[0].message});
        }
      }
    });
});

//GET user by id
router.get('/:userId', verifyUser, async (req, res) => {
  try{
    if(req.user.role=='Admin'){
      const user = await getCleanUser(req.params.userId);
      res.json(user);
    } 
    else {
      if(req.params.userId == req.user.userId){
        const user = await getCleanUser(req.params.userId);
        res.json(user);
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

// DELETE user by id
router.delete('/:userId', verifyAdmin, async (req, res) => {
  try{
    const user = await User.findByPk(req.params.userId);
    await user.destroy();
    res.json({msg: 'User deleted!'});
  }
  catch(err){
    res.json({msg: err});
  }
});

router.put('/:userId', verifyAdmin, async ( req, res) => {
  try{
      User.update(
        req.body ,
      {
        where: {id: req.params.userId}
      }).then(() => res.json({msg: "successfully updated!!"}));
    }

  catch(err){
    res.json({msg: err});
  }
});

module.exports = router;