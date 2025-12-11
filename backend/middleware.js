const jsonwebtoken = require('jsonwebtoken');
const statusCodes = require('http-status-codes');

module.exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(statusCodes.StatusCodes.UNAUTHORIZED).json({ message: 'Brak nagłówka autoryzacji' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(statusCodes.StatusCodes.UNAUTHORIZED).json({ message: 'Brak tokenu' });
    }

    try {
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(statusCodes.StatusCodes.UNAUTHORIZED).json({ message: 'Nieprawidłowy token' });
    }
};

module.exports.refreshToken = (req, res) => {
    const { id, username, type } = req.user;
    const token = jsonwebtoken.sign({ id, username, type }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(statusCodes.StatusCodes.OK).json({ token });
};

module.exports = {
    verifyToken: module.exports.verifyToken,
    refreshToken: module.exports.refreshToken
};
