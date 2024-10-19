import jwt from 'jsonwebtoken';

export const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header

    if (!token) {
        return res.sendStatus(403); // Forbidden if no token is present
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden if token is invalid
        }

        req.user = user; // Save user info to request
        next(); // Proceed to the next middleware/route handler
    });
};
