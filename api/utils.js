const jwt = require('jsonwebtoken');
const randtoken =require('rand-token');
const dayjs = require('dayjs');

const dev = process.env.NODE_ENV !== 'production';

// refresh token list to manage the xsrf token
const refreshTokens = {};

// cookie options to create refresh token
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: !dev,
    signed: true
};

// generate tokens and return it
const generateToken = (user) => {
    if(!user) return null;
    const u = {
        userId: user.id,
        name: user.firstName + ' ' + user.lastName,
        role: user.role
    };
    const xsrfToken = randtoken.generate(24);
    // create private key by combining JWT secret and xsrf token
    const privateKey = process.env.JWT_SECRET + xsrfToken;

    const token = jwt.sign(u, privateKey, {expiresIn: process.env.ACCESS_TOKEN_LIFE+'m'});

    //expiry time of the access token
    const expiredAt = dayjs().add(process.env.ACCESS_TOKEN_LIFE, 'm').valueOf();
    
    return {
        token,
        expiredAt,
        xsrfToken
    }
}

// generate refresh token

const generateRefreshToken = (userId) =>{
    if(!userId) return null;
    return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: process.env.REFRESH_TOKEN_LIFE+'d'});
}

function getCleanUser(user) {
    if (!user) return null;
   
    return {
      userId: user.id,
      name: user.firstName+' '+user.lastName,
      email: user.email,
      role: user.role,
    };
}
  

// verify access token and refresh token
function verifyToken(token, xsrfToken, cb) {
    const privateKey = process.env.JWT_SECRET + (xsrfToken || '');
    jwt.verify(token, privateKey, cb);
}

// clear tokens from cookie
function clearTokens(req, res) {
    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;
    delete refreshTokens[refreshToken];
    res.clearCookie('XSRF-TOKEN');
    res.clearCookie('refreshToken', COOKIE_OPTIONS);
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
        clearTokens(req, res);
        break;
      case 403:
        isError = true;
        errorMessage = message || 'Access to this resource is denied.';
        clearTokens(req, res);
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

module.exports = {clearTokens, COOKIE_OPTIONS, generateRefreshToken, generateToken, getCleanUser,  handleResponse, refreshTokens, verifyToken};