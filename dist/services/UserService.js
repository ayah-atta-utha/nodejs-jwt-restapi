"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    // Register a new user
    async register(username, password, role) {
        // Check if user already exists
        const existingUser = await this.userRepository.findOneBy({ username });
        if (existingUser) {
            throw new Error('Username already exists');
        }
        // Hash the password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Create a new user
        const newUser = this.userRepository.create({ username, password: hashedPassword, role });
        return await this.userRepository.save(newUser); // Make sure to return the saved user
    }
    // Validate user credentials during login
    async validateUser(username, password) {
        const user = await this.userRepository.findOneBy({ username });
        if (!user) {
            throw new Error("Invalid username or password");
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid username or password");
        }
        return user; // Return the user object or any relevant information
    }
    async login(username, password) {
        const user = await this.validateUser(username, password);
        const token = await jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, config_1.default.JWT_SECRET, { expiresIn: "1h" });
        return { token };
    }
    // Check if the user has admin role
    async isAdmin(userId) {
        const user = await this.userRepository.findOneBy({ id: userId });
        return user?.role === 'admin';
    }
}
exports.UserService = UserService;
