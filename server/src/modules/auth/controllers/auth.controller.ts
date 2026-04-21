import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { SignUpDto } from "../dtos/sign-up.dto";
import { SignInDto } from "../dtos/sign-in.dto";
import { Public } from "@/common/decorators/public.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("sign-up")
  async signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Public()
  @Post("sign-in")
  async signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }
}
