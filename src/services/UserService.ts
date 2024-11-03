import { AppDataSource } from "../data-source"; // Adjust the import path accordingly
import { User } from "../entities/User"; // Adjust the import path accordingly
import { Repository } from "typeorm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config";

export class UserService { 

  constructor(private userRepository: Repository<User>) { 
  }

  // Register a new user
  async register(username: string, password: string, role: string) {
   // Check if user already exists
   const existingUser = await this.userRepository.findOneBy({ username });
   if (existingUser) {
     throw new Error('Username already exists');
   }

   // Hash the password
   const hashedPassword = await bcrypt.hash(password, 10);
   
   // Create a new user
   const newUser = this.userRepository.create({ username, password: hashedPassword, role });
   return await this.userRepository.save(newUser); // Make sure to return the saved user

  }

  // Validate user credentials during login
  async validateUser(username: string, password: string) {
    const user = await this.userRepository.findOneBy({ username });

    if (!user) {
      throw new Error("Invalid username or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid username or password");
    }

    return user; // Return the user object or any relevant information
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    const token = await jwt.sign({ userId: user.id, role: user.role }, config.JWT_SECRET, { expiresIn: "1h" });
    return { token };
  }

  // Check if the user has admin role
  async isAdmin(userId: number): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ id: userId });
    return user?.role === 'admin';
  }

  
}
