const jwt = require('jsonwebtoken');

const verifyUser = (req, res, next) => {
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Access Denied!');
    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        if(verified.role == 'User'|| verified.role=='Admin'){
            req.user = verified;
            next();
        }
        else{
            return res.status(401).send('Access Denied!');
        }
    }
    catch(err){
        res.status(400).send({msg: err});
    }
}

const verifyAdmin = (req, res, next) => {
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Access Denied!');
    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        if(verified.role == 'Admin'){
            req.user = verified;
            next();
        }
        else{
            return res.status(401).send('Access Denied!');
        }
    }
    catch(err){
        res.status(400).send({msg: err});
    }
}

module.exports = {verifyUser, verifyAdmin};