import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, "your_jwt_secret", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Type assertion to JwtPayload
    const payload = decoded as JwtPayload;

    if (payload.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = { id: payload.userId, role: payload.role }; // Adjust according to your payload structure
    next();
  });
};
