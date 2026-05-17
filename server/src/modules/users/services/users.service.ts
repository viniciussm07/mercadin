import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersRepository } from "../repositories/users.repository";
import { UpdateProfileDto } from "../dtos/update-profile.dto";

export interface SyncUserData {
  id: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
}

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

  async assertEmailAvailable(id: string, email: string) {
    const user = await this.users.findByEmail(email);

    if (user && user.id !== id) {
      throw new ConflictException("Este e-mail já está em uso.");
    }
  }

  updateEmail(id: string, email: string) {
    return this.users.updateEmail(id, email);
  }

  deleteAccount(id: string) {
    return this.users.deleteAccount(id);
  }

  syncUser(data: SyncUserData) {
    return this.users.upsert({
      id: data.id,
      email: data.email,
      name: data.name,
      avatarUrl: data.avatarUrl,
    });
  }
}
