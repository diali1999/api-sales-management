const jwt = require('jsonwebtoken');
const randtoken =require('rand-token');
const dayjs = require('dayjs');

const dev = process.env.NODE_ENV !== 'production';

// generate tokens and return it
const generateToken = (user) => {
    if(!user) return null;
    const u = {
        userId: user.id,
        name: user.firstName + ' ' + user.lastName,
        role: user.role
    };
    const privateKey = process.env.JWT_SECRET;

    const token = jwt.sign(u, privateKey, {expiresIn: process.env.ACCESS_TOKEN_LIFE+'m'});

    //expiry time of the access token
    const expiredAt = dayjs().add(process.env.ACCESS_TOKEN_LIFE, 'm').valueOf();
    
    return {
        token,
        expiredAt,
    }
}

function getTokenUser(user) {
    if (!user) return null;
   
    return {
      userId: user.id,
      name: user.firstName+' '+user.lastName,
      email: user.email,
      role: user.role,
    };
}
  

// verify access token and refresh token
function verifyToken(token, cb) {
    const privateKey = process.env.JWT_SECRET;
    jwt.verify(token, privateKey, cb);
}

// handle the API response
function handleResponse(req, res, statusCode, data, message) {
    let isError = false;
    let errorMessage = message;
    switch (statusCode) {
      case 204:
        return res.sendStatus(204);
      case 400:
        isError = true;
        break;
      case 401:
        isError = true;
        errorMessage = message || 'Invalid user.';
        break;
      case 403:
        isError = true;
        errorMessage = message || 'Access to this resource is denied.';
        break;
      default:
        break;
    }
    const resObj = data || {};
    if (isError) {
      resObj.error = true;
      resObj.message = errorMessage;
    }
    return res.status(statusCode).json(resObj);
}

module.exports = {generateToken, getTokenUser,  handleResponse, verifyToken};