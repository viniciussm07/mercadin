import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { UsersController } from "@/modules/users/controllers/users.controller";
import { UsersService } from "@/modules/users/services/users.service";
import { authHeader, createTestApp, TEST_USER } from "../../../test/helpers/create-test-app";

describe("User endpoints", () => {
  let app: INestApplication;
  const users = {
    findMe: jest.fn(),
    updateProfile: jest.fn(),
  };

  beforeAll(async () => {
    app = await createTestApp({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: users }],
    });
  });

  afterAll(async () => app.close());

  it("requires authentication", async () => {
    await request(app.getHttpServer()).get("/users/me").expect(401);
    expect(users.findMe).not.toHaveBeenCalled();
  });

  it("returns the authenticated user", async () => {
    const result = { id: TEST_USER.id, email: TEST_USER.email, name: "Mercadin User" };
    users.findMe.mockResolvedValueOnce(result);

    await request(app.getHttpServer()).get("/users/me").set(authHeader).expect(200).expect(result);

    expect(users.findMe).toHaveBeenCalledWith(TEST_USER.id);
  });

  it("updates the authenticated user's profile", async () => {
    const dto = { name: "Updated User", avatarUrl: "https://example.com/avatar.png" };
    users.updateProfile.mockResolvedValueOnce({ id: TEST_USER.id, ...dto });

    await request(app.getHttpServer()).patch("/users/me").set(authHeader).send(dto).expect(200);

    expect(users.updateProfile).toHaveBeenCalledWith(TEST_USER.id, dto);
  });

  it("rejects invalid profile data", async () => {
    await request(app.getHttpServer())
      .patch("/users/me")
      .set(authHeader)
      .send({ name: "A", avatarUrl: "invalid" })
      .expect(400);

    expect(users.updateProfile).not.toHaveBeenCalled();
  });
});
