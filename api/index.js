const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { generateToken, getTokenUser, handleResponse} = require('./utils');
const User = require('../models/users');

router.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password){
        return handleResponse(req, res, 400, null, "Email and Password required!");
    }
    // Check user existence
    const user = await User.findOne({where: {email: email}});
    if(!user) return handleResponse(req, res, 401, null, "Incorrect email or password!");

    // Check valid password
    const validPassword = await bcrypt.compare(req.body.password, user.hashedPassword);
    if(!validPassword)  return handleResponse(req, res, 401, null, "Incorrect email or password!");

    // Get clean user
    const userObj = getTokenUser(user);

    // Generate access token
    const token = generateToken(user);
    
    return handleResponse(req, res, 200, {
        user: userObj,
        token: token.token,
        expiredAt: token.expiredAt
    });
});

// handle user logout
router.post('/logout', (req, res) => {

});


module.exports = router;