import { JsonController, Post, Body } from "routing-controllers";
import { UserService } from "../services/UserService"; 

@JsonController("/auth")
export class AuthController {
  private userService = new UserService();

  @Post("/register")
  async register(@Body() body: { username: string; password: string; role: string }) {
    return this.userService.register(body.username, body.password, body.role);
  }

  @Post("/login")
  async login(@Body() userCredentials: { username: string; password: string }) {
    return this.userService.login(userCredentials.username, userCredentials.password);
  }

}
