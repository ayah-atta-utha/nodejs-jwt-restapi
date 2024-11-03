import { adminMiddleware, CustomerRequest } from '../middleware/AdminMiddleware'; // Adjust the import path accordingly
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';

jest.mock('jsonwebtoken');

describe('adminMiddleware', () => { 

  let req: CustomerRequest;
  let res: Response;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      headers: {},
      user: undefined,
    } as CustomerRequest; // Cast to CustomerRequest to satisfy TypeScript
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response; // Cast to Response
    next = jest.fn(); // Mock next function
  });

  it('should call next if the token is valid and user is admin', () => {
    const mockDecoded = { userId: 1, role: 'admin' };
    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => callback(null, mockDecoded));

    adminMiddleware(req as CustomerRequest, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({ id: 1, role: 'admin' });
  });

  it('should return 403 if no token is provided', () => {
    req.headers.authorization = undefined; // Simulate no token

    adminMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 for invalid token', () => {
    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => callback(new Error('Invalid token'), null));

    adminMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if the user is not admin', () => {
    const mockDecoded = { userId: 1, role: 'user' };
    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => callback(null, mockDecoded));

    adminMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden' });
    expect(next).not.toHaveBeenCalled();
  });
});
