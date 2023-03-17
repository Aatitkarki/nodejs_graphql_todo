const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    console.log(req.body);
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'secretTokenKey')
    } catch (error) {
        req.isAuth = false;
        return next();
    }
    if (!decodedToken) {
        const error = new Error('Not authenticated');
        req.isAuth = false;
        return next();
    }
    req.userId= decodedToken.userId;
    req.isAuth=true;
    next();
}