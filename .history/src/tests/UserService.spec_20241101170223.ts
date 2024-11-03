import { UserService } from '../services/UserService'; // Adjust the import path accordingly
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

jest.mock('bcrypt');
jest.mock('../data-source');

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    // Initialize the database connection
    await AppDataSource.initialize();
    userService = new UserService();
    userRepository = AppDataSource.getRepository(User);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user', async () => {
    (userRepository.findOneBy as jest.Mock).mockResolvedValue(null); // Simulate no existing user

    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword'); // Simulate hashing
    const user = await userService.register('testuser', 'password', 'user');

    expect(user.username).toBe('testuser');
    expect(user.role).toBe('user');
    expect(user.password).toBe('hashedPassword');
  });

  it('should throw an error if username already exists', async () => {
    (userRepository.findOneBy as jest.Mock).mockResolvedValue({ username: 'testuser' }); // Simulate existing user

    await expect(userService.register('testuser', 'password', 'user')).rejects.toThrow('Username already exists');
  });

  it('should validate user credentials', async () => {
    (userRepository.findOneBy as jest.Mock).mockResolvedValue({ username: 'testuser', password: 'hashedPassword' });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true); // Simulate successful password comparison

    const user = await userService.validateUser('testuser', 'password');
    expect(user.username).toBe('testuser');
  });

  it('should throw an error for invalid username or password', async () => {
    (userRepository.findOneBy as jest.Mock).mockResolvedValue(null); // Simulate user not found

    await expect(userService.validateUser('invaliduser', 'password')).rejects.toThrow('Invalid username or password');
  });
});
