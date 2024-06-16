import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
    const token = req.cookies?.access_token;
    // console.log('Token:', token); // Add this line to debug
    if (!token) return next(errorHandler(401, 'You are not authenticated'));
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return next(errorHandler(401, "Token is not valid"));
      req.user = user;
      next();
    });
  };
  