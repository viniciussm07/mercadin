import { BadRequestException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import type { AuthUser } from "@supabase/supabase-js";
import { UsersService } from "@/modules/users/services/users.service";
import { AuthUserSyncService } from "./auth-user-sync.service";

const createUser = (overrides: Partial<AuthUser>): AuthUser =>
  ({
    id: "user-1",
    email: "user@test.com",
    user_metadata: {},
    ...overrides,
  }) as AuthUser;

describe("AuthUserSyncService", () => {
  const users = { syncUser: jest.fn() };
  let service: AuthUserSyncService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AuthUserSyncService, { provide: UsersService, useValue: users }],
    }).compile();
    service = moduleRef.get(AuthUserSyncService);
  });

  beforeEach(() => jest.clearAllMocks());

  it("maps primary user metadata", () => {
    service.syncLocalUser(
      createUser({
        user_metadata: {
          name: "Mercadin User",
          avatar_url: "https://example.com/avatar.png",
        },
      }),
    );

    expect(users.syncUser).toHaveBeenCalledWith({
      id: "user-1",
      email: "user@test.com",
      name: "Mercadin User",
      avatarUrl: "https://example.com/avatar.png",
    });
  });

  it("uses provider metadata fallbacks", () => {
    service.syncLocalUser(
      createUser({
        user_metadata: {
          name: "",
          full_name: "Provider User",
          avatar_url: null,
          picture: "https://example.com/picture.png",
        },
      }),
    );

    expect(users.syncUser).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Provider User",
        avatarUrl: "https://example.com/picture.png",
      }),
    );
  });

  it("ignores invalid optional metadata", () => {
    service.syncLocalUser(
      createUser({
        user_metadata: { name: 123, full_name: "", avatar_url: false, picture: "" },
      }),
    );

    expect(users.syncUser).toHaveBeenCalledWith(
      expect.objectContaining({ name: undefined, avatarUrl: undefined }),
    );
  });

  it("rejects authenticated users without email", () => {
    expect(() => service.syncLocalUser(createUser({ email: undefined }))).toThrow(
      BadRequestException,
    );
    expect(users.syncUser).not.toHaveBeenCalled();
  });
});
