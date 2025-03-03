const jwt = require('jsonwebtoken')


module.exports = function (req, res, next) {


    const authHeader = req.header('Authorization');
    if (!authHeader) {
        res.status(401);
        res.json({ message: 'Unauthorized request' });
    }
    const token = authHeader.split(' ')[1];

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload) {
        res.status(401);
        res.json({ message: 'Unauthorized request' });
    }

    req.userId = payload;
    next();

}