@JsonController("/auth")
export class AuthController {
  private userService = new UserService();

  @Post("/register")
  async register(@Body() body: { username: string; password: string; role: string }) {
    return this.userService.register(body.username, body.password, body.role);
  }

  @Post("/login")
  async login(@Body() userCredentials: { username: string; password: string }) {
    const user = await this.userService.validateUser(userCredentials.username, userCredentials.password);
    const token = jwt.sign({ userId: user.id, role: user.role }, "your_jwt_secret", { expiresIn: "1h" });
    return { token };
  }
}
