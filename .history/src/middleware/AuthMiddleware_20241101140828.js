import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, "your_jwt_secret", (err, decoded) => {
    if (err || decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    req.user = decoded; // Attach user info to the request
    next();
  });
};
