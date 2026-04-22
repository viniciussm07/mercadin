import { Injectable, NotFoundException } from "@nestjs/common";
import { UsersRepository } from "../repositories/users.repository";
import { UpdateProfileDto } from "../dtos/update-profile.dto";

@Injectable()
export class UsersService {
  constructor(private readonly users: UsersRepository) {}

  async findMe(id: string) {
    const user = await this.users.findById(id);
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  updateProfile(id: string, dto: UpdateProfileDto) {
    return this.users.updateProfile(id, dto);
  }
}
