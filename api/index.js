const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {clearTokens, COOKIE_OPTIONS, generateRefreshToken, generateToken, getCleanUser, handleResponse, refreshTokens, verifyToken} = require('./utils');
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
    const userObj = getCleanUser(user);

    // Generate access token
    const token = generateToken(user);

    // Generate refresh token
    const refreshToken = generateRefreshToken(userObj.userId);

    // Refresh token list to manage the xsrf token
    refreshTokens[refreshToken] = token.xsrfToken;

    // Setting cookies
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.cookie('XSRF-TOKEN', token.xsrfToken);

    return handleResponse(req, res, 200, {
        user: userObj,
        token: token.token,
        expiredAt: token.expiredAt
    });
});

// handle user logout
router.post('/logout', (req, res) => {
    clearTokens(req, res);
    return handleResponse(req, res, 204);
});

// verify the token and return new tokens if it's valid
router.post('/verifyToken', function (req, res) {
 
    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;
    if (!refreshToken) {
      return handleResponse(req, res, 204);
    }
   
    // verify xsrf token
    const xsrfToken = req.headers['x-xsrf-token'];
    if (!xsrfToken || !(refreshToken in refreshTokens) || refreshTokens[refreshToken] !== xsrfToken) {
      return handleResponse(req, res, 401);
    }
   
    // verify refresh token
    verifyToken(refreshToken, '', (err, payload) => {
      if (err) {
        return handleResponse(req, res, 401);
      }
      else {
        const userData = userList.find(x => x.userId === payload.userId);
        if (!userData) {
          return handleResponse(req, res, 401);
        }
   
        // get basic user details
        const userObj = getCleanUser(userData);
   
        // generate access token
        const tokenObj = generateToken(userData);
   
        // refresh token list to manage the xsrf token
        refreshTokens[refreshToken] = tokenObj.xsrfToken;
        res.cookie('XSRF-TOKEN', tokenObj.xsrfToken);
   
        // return the token along with user details
        return handleResponse(req, res, 200, {
          user: userObj,
          token: tokenObj.token,
          expiredAt: tokenObj.expiredAt
        });
        }
    });
});
  

module.exports = router;