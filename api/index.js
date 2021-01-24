const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/users');

router.post('/login', async (req, res) => {
    const user = await User.findOne({where: {email: req.body.email}});
    if(!user) return res.status(400).send('Incorrect email!');

    const validPassword = await bcrypt.compare(req.body.password, user.hashedPassword);

    if(!validPassword)  return res.status(400).send('Incorrect password!');

    res.send('Logged in!');
});

module.exports = router;