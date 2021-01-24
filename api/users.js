const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/users');

const saltRounds = 10;

router.get('/', (req, res) => {
    User.findAll()
      .then(users => {
        res.json(users);
      });
});

router.post('/', (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, (err, hashedPassword) => {
        if (err){
          console.log(error);
        }
        else{
            (async() => {
                await User.create({
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
                }).then((data) => {
                    console.log('User created succesfully!');
                    res.json(data.toJSON());
                })
                .catch(error => console.log(error));
            })();
        }
      });
});

router.get('/:id', (req, res) => {
    User.findByPk(req.params.id)
      .then(user => {
        res.json(user);
      });
});

router.delete('/:id', (req, res) => {
  User.findByPk(req.params.id)
    .then(user => {
      user.destroy()
        .then(() => {
          console.log('User deleted');
          res.json(user)
        })
        .catch(err => console.log(err));
    }).catch(error => console.log(error));
});

module.exports = router;