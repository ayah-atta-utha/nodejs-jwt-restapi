"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AdminMiddleware_1 = require("../middleware/AdminMiddleware"); // Adjust the import path accordingly
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
jest.mock('jsonwebtoken');
describe('adminMiddleware', () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = {
            headers: {},
            user: undefined,
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });
    it('should call next if the token is valid and user is admin', () => {
        const mockDecoded = { userId: 1, role: 'admin' };
        jsonwebtoken_1.default.verify.mockImplementation((token, secret, callback) => callback(null, mockDecoded));
        (0, AdminMiddleware_1.adminMiddleware)(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(req.user).toEqual({ id: 1, role: 'admin' });
    });
    it('should return 403 if no token is provided', () => {
        req.headers.authorization = undefined;
        (0, AdminMiddleware_1.adminMiddleware)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
        expect(next).not.toHaveBeenCalled();
    });
    it('should return 401 for invalid token', () => {
        jsonwebtoken_1.default.verify.mockImplementation((token, secret, callback) => callback(new Error('Invalid token'), null));
        (0, AdminMiddleware_1.adminMiddleware)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
        expect(next).not.toHaveBeenCalled();
    });
    it('should return 403 if the user is not admin', () => {
        const mockDecoded = { userId: 1, role: 'user' };
        jsonwebtoken_1.default.verify.mockImplementation((token, secret, callback) => callback(null, mockDecoded));
        (0, AdminMiddleware_1.adminMiddleware)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden' });
        expect(next).not.toHaveBeenCalled();
    });
});
