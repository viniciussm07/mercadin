import { ConflictException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { UsersRepository } from "../repositories/users.repository";
import { UsersService } from "./users.service";

describe("UsersService", () => {
  const users = {
    deleteAccount: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    updateEmail: jest.fn(),
    updateProfile: jest.fn(),
    upsert: jest.fn(),
  };
  let service: UsersService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UsersService, { provide: UsersRepository, useValue: users }],
    }).compile();
    service = moduleRef.get(UsersService);
  });

  beforeEach(() => jest.clearAllMocks());

  it("returns the current user or throws when it does not exist", async () => {
    const result = { id: "user-1", email: "user@test.com" };
    users.findById.mockResolvedValueOnce(result).mockResolvedValueOnce(null);

    await expect(service.findMe("user-1")).resolves.toBe(result);
    await expect(service.findMe("missing")).rejects.toBeInstanceOf(NotFoundException);
  });

  it("allows an available email and rejects an email owned by another user", async () => {
    users.findByEmail
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: "user-1" })
      .mockResolvedValueOnce({ id: "user-2" });

    await expect(service.assertEmailAvailable("user-1", "free@test.com")).resolves.toBeUndefined();
    await expect(service.assertEmailAvailable("user-1", "same@test.com")).resolves.toBeUndefined();
    await expect(service.assertEmailAvailable("user-1", "used@test.com")).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it("delegates profile, email and account operations", async () => {
    const profile = { name: "Updated" };
    service.updateProfile("user-1", profile);
    service.updateEmail("user-1", "updated@test.com");
    service.deleteAccount("user-1");

    expect(users.updateProfile).toHaveBeenCalledWith("user-1", profile);
    expect(users.updateEmail).toHaveBeenCalledWith("user-1", "updated@test.com");
    expect(users.deleteAccount).toHaveBeenCalledWith("user-1");
  });

  it("maps synchronization data to the repository", () => {
    service.syncUser({
      id: "user-1",
      email: "user@test.com",
      name: null,
      avatarUrl: "https://example.com/avatar.png",
    });

    expect(users.upsert).toHaveBeenCalledWith({
      id: "user-1",
      email: "user@test.com",
      name: null,
      avatarUrl: "https://example.com/avatar.png",
    });
  });
});
