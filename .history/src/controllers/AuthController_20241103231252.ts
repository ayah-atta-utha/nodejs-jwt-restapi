import { JsonController, Post, Body } from "routing-controllers";
import { UserService } from "../services/UserService";
import { Repository } from "typeorm";
import AppDataSource from "../data-source";
import { User } from "../entities/User";

@JsonController("/auth")
export class AuthController {
  private userService: UserService;

  constructor() {
    const userRepository: Repository<User> = AppDataSource.getRepository(User);
    this.userService = new UserService(userRepository);
  }

  @Post("/register")
  async register(
    @Body() body: { username: string; password: string; role: string }
  ) {
    return this.userService.register(body.username, body.password, body.role);
  }

  @Post("/login")
  async login(@Body() userCredentials: { username: string; password: string }) {
    return this.userService.login(
      userCredentials.username,
      userCredentials.password
    );
  }
}
