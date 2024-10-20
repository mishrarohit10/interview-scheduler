import jwt from 'jsonwebtoken';

export const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; 

    console.log("TOKEN:", token); 

    // Check if token is provided
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' }); // Unauthorized
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'JsonWebTokenError') {
                return res.status(403).json({ message: 'Invalid token.' }); 
            }
            if (err.name === 'TokenExpiredError') {
                return res.status(403).json({ message: 'Token has expired. Please log in again.' });
            }
            return res.status(500).json({ message: 'An error occurred while verifying token.' }); 
        }

        req.user = user;
        next(); 
    });
};
