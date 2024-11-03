 
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; role: string }; // Adjust according to your user structure
    }
  }
}
