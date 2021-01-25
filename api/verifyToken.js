const jwt = require('jsonwebtoken');
const {handleResponse, refreshTokens, verifyToken} = require('./utils');

const authMiddleware = function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.headers['authorization'];
    if (!token) return handleResponse(req, res, 401);
   
    token = token.replace('Bearer ', '');
   
    // get xsrf token from the header
    const xsrfToken = req.headers['x-xsrf-token'];
    if (!xsrfToken) {
      return handleResponse(req, res, 403);
    }
   
    // verify xsrf token
    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;
    if (!refreshToken || !(refreshToken in refreshTokens) || refreshTokens[refreshToken] !== xsrfToken) {
      return handleResponse(req, res, 401);
    }
   
    // verify token with secret key and xsrf token
    verifyToken(token, xsrfToken, (err, payload) => {
      if (err)
        return handleResponse(req, res, 401);
      else {
        req.user = payload; //set the user to req so other routes can use it
        next();
      }
    });
}

const verifyUser = (req, res, next) => {
    try{
        const role = req.user.role;
        if(role == 'User'|| role=='Admin'){
            next();
        }
        else{
            return handleResponse(req, res, 403);
        }
    }
    catch(err){
        res.status(400).send({msg: err});
    }
}

const verifyAdmin = (req, res, next) => {
    try{
        if(req.user.role == 'Admin'){
            next();
        }
        else{
            return handleResponse(req, res, 403);
        }
    }
    catch(err){
        res.status(400).send({msg: err});
    }
}

module.exports = {verifyUser, verifyAdmin, authMiddleware};