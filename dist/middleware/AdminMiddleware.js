"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const adminMiddleware = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }
    jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Type assertion to JwtPayload
        const payload = decoded;
        if (payload.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        req.user = { id: payload.userId, role: payload.role };
        next();
    });
};
exports.adminMiddleware = adminMiddleware;
exports.default = exports.adminMiddleware;
