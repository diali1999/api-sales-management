const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/users');

router.post('/login', async (req, res) => {
    const user = await User.findOne({where: {email: req.body.email}});
    if(!user) return res.status(400).send('Incorrect email or password!');

    const validPassword = await bcrypt.compare(req.body.password, user.hashedPassword);

    if(!validPassword)  return res.status(400).send('Incorrect email or password!');

    // Create and assign a token
    const token = jwt.sign({id: user.id, role: user.role}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});

module.exports = router;