import { UserService } from '../services/UserService'; // Adjust the import path accordingly
import { User } from '../entities/User';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import config from "../config";

// Create a mock class for the User repository
const mockUserRepository: Partial<Repository<User>> = {
  findOneBy: jest.fn(),
  save: jest.fn(),
  create: jest.fn().mockImplementation((userData) => userData), // Mock create method
};

jest.mock('bcrypt');
jest.mock('../data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn().mockReturnValue(mockUserRepository),
    initialize: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(), // Properly mock the sign method
}));

describe('UserService', () => {
  let userService: UserService;

  beforeAll(async () => {
    // Initialize the user service with the mocked repository
    userService = new UserService(mockUserRepository as Repository<User>);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user', async () => {
    (mockUserRepository.findOneBy as jest.Mock).mockResolvedValue(null); // Simulate no existing user
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword'); // Simulate hashing
      // Mock the save method to return the new user
      (mockUserRepository.save as jest.Mock).mockResolvedValue({
        username: 'testuser',
        password: 'hashedPassword',
        role: 'user',
      });

    const user = await userService.register('testuser', 'password', 'user');

    expect(user).toBeDefined(); // Ensure user is defined
    expect(user.username).toBe('testuser');
    expect(user.role).toBe('user');
    expect(user.password).toBe('hashedPassword');
    expect(mockUserRepository.save).toHaveBeenCalled(); // Ensure save is called
    expect(mockUserRepository.save).toHaveBeenCalled(); // Ensure save is called
  });

  it('should throw an error if username already exists', async () => {
    (mockUserRepository.findOneBy as jest.Mock).mockResolvedValue({ username: 'testuser' }); // Simulate existing user

    await expect(userService.register('testuser', 'password', 'user')).rejects.toThrow('Username already exists');
  });

  it('should validate user credentials', async () => {
    (mockUserRepository.findOneBy as jest.Mock).mockResolvedValue({ username: 'testuser', password: 'hashedPassword' });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true); // Simulate successful password comparison

    const user = await userService.validateUser('testuser', 'password');
    expect(user.username).toBe('testuser');
  });

  it('should throw an error for invalid username or password', async () => {
    (mockUserRepository.findOneBy as jest.Mock).mockResolvedValue(null); // Simulate user not found

    await expect(userService.validateUser('invaliduser', 'password')).rejects.toThrow('Invalid username or password');
  });

  describe('validateUser', () => {
    it('should return user when valid credentials are provided', async () => {
      const user = { id: 1, username: 'testuser', password: 'hashedPassword', role: 'user' };
      (mockUserRepository.findOneBy as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true); // Simulate valid password

      const result = await userService.validateUser('testuser', 'password');
      expect(result).toEqual(user);
    });

    it('should throw an error if username does not exist', async () => {
      (mockUserRepository.findOneBy as jest.Mock).mockResolvedValue(null); // Simulate user not found

      await expect(userService.validateUser('invaliduser', 'password')).rejects.toThrow('Invalid username or password');
    });

    it('should throw an error if password is invalid', async () => {
      const user = { id: 1, username: 'testuser', password: 'hashedPassword', role: 'user' };
      (mockUserRepository.findOneBy as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Simulate invalid password

      await expect(userService.validateUser('testuser', 'wrongpassword')).rejects.toThrow('Invalid username or password');
    });
  });

  describe('login', () => {
    it('should return a token when valid credentials are provided', async () => {
      const user = { id: 1, username: 'testuser', password: 'hashedPassword', role: 'user' };
      (mockUserRepository.findOneBy as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mockedToken'); // Mock JWT signing

      const result = await userService.login('testuser', 'password');
      expect(result).toEqual({ token: 'mockedToken' });
      expect(jwt.sign).toHaveBeenCalledWith({ userId: user.id, role: user.role }, config.JWT_SECRET, { expiresIn: "1h" });
    });

    it('should throw an error if login fails', async () => {
      (mockUserRepository.findOneBy as jest.Mock).mockResolvedValue(null); // Simulate user not found

      await expect(userService.login('invaliduser', 'password')).rejects.toThrow('Invalid username or password');
    });
  });

  describe('isAdmin', () => {
    it('should return true if user is an admin', async () => {
      const user = { id: 1, username: 'adminuser', role: 'admin' };
      (mockUserRepository.findOneBy as jest.Mock).mockResolvedValue(user); // Simulate admin user found

      const result = await userService.isAdmin(1);
      expect(result).toBe(true);
    });

    it('should return false if user is not an admin', async () => {
      const user = { id: 1, username: 'normaluser', role: 'user' };
      (mockUserRepository.findOneBy as jest.Mock).mockResolvedValue(user); // Simulate normal user found

      const result = await userService.isAdmin(1);
      expect(result).toBe(false);
    });

    it('should return false if user does not exist', async () => {
      (mockUserRepository.findOneBy as jest.Mock).mockResolvedValue(null); // Simulate user not found

      const result = await userService.isAdmin(1);
      expect(result).toBe(false);
    });
  });

});
