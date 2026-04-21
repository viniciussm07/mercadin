import { Body, Controller, Get, Patch } from "@nestjs/common";
import { UsersService } from "../services/users.service";
import { UpdateProfileDto } from "../dtos/update-profile.dto";
import { CurrentUser, AuthenticatedUser } from "@/common/decorators/current-user.decorator";

@Controller("users")
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get("me")
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.users.findMe(user.id);
  }

  @Patch("me")
  updateMe(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateProfileDto) {
    return this.users.updateProfile(user.id, dto);
  }
}
