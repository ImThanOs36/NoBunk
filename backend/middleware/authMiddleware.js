const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Extract token, handling both "Bearer token" and "token" formats
        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.slice(7)  // Remove "Bearer " prefix
            : authHeader;          // Use the whole string if no prefix

        if (!token) {
            return res.status(401).json({ message: 'Invalid token format' });
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (!payload) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.userId = payload.id;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Authentication failed' });
    }
}