import { UserService } from '../services/UserService'; // Adjust the import path accordingly
import { User } from '../entities/User';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

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

    const user = await userService.register('testuser', 'password', 'user');

    expect(user.username).toBe('testuser');
    expect(user.role).toBe('user');
    expect(user.password).toBe('hashedPassword');
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
});
