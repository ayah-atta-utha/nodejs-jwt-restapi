import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";


export interface CustomerRequest extends Request {
  user?: { id: number; role: string }; // Your custom properties
}

export const adminMiddleware = (req: CustomerRequest, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Type assertion to JwtPayload
    const payload = decoded as JwtPayload;

    if (payload.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }(req.user as { id: number; role: string }) = { id: payload.userId, role: payload.role };

    next();
  });
};
  export default adminMiddleware;
