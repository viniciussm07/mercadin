import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../repositories/users.repository";
import { CreateUserDto } from "../dtos/create-user.dto";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  findAll() {
    return this.usersRepository.findAll();
  }

  create(dto: CreateUserDto) {
    return this.usersRepository.create(dto);
  }
}
