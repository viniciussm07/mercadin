import { Controller, Post, Body, Delete, Patch } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { SignUpDto } from "../dtos/sign-up.dto";
import { SignInDto } from "../dtos/sign-in.dto";
import { Public } from "@/common/decorators/public.decorator";
import { SignInWithTokenDto } from "../dtos/sign-in-with-token.dto";
import { AuthenticatedUser, CurrentUser } from "@/common/decorators/current-user.decorator";
import { UpdateEmailDto } from "../dtos/update-email.dto";
import { UpdatePasswordDto } from "../dtos/update-password.dto";
import { AuthAccountService } from "../services/auth-account.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly accountService: AuthAccountService,
  ) {}

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

  @Public()
  @Post("sign-in-with-token")
  async signInWithToken(@Body() dto: SignInWithTokenDto) {
    return this.authService.signInWithToken(dto);
  }

  @Post("sync-session")
  async syncSession(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.syncSession(user.id);
  }

  @Patch("me/email")
  async updateEmail(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateEmailDto) {
    return this.accountService.updateEmail(user.id, dto);
  }

  @Patch("me/password")
  async updatePassword(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdatePasswordDto) {
    return this.accountService.updatePassword(user, dto);
  }

  @Delete("me")
  async deleteMe(@CurrentUser() user: AuthenticatedUser) {
    return this.accountService.deleteAccount(user.id);
  }
}
