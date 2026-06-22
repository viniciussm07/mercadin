import { INestApplication, UnauthorizedException } from "@nestjs/common";
import request from "supertest";
import { AuthController } from "@/modules/auth/controllers/auth.controller";
import { AuthAccountService } from "@/modules/auth/services/auth-account.service";
import { AuthService } from "@/modules/auth/services/auth.service";
import { createTestApp } from "../../../test/helpers/create-test-app";

describe("Auth endpoints", () => {
  let app: INestApplication;
  const authService = {
    signIn: jest.fn(),
    signUp: jest.fn(),
  };
  const accountService = {
    deleteAccount: jest.fn(),
    updateEmail: jest.fn(),
    updatePassword: jest.fn(),
  };

  beforeAll(async () => {
    app = await createTestApp({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: AuthAccountService, useValue: accountService },
      ],
    });
  });

  afterAll(async () => app.close());

  it("creates an account without requiring authentication", async () => {
    const result = { user: { id: "new-user" }, session: null };
    authService.signUp.mockResolvedValueOnce(result);

    await request(app.getHttpServer())
      .post("/auth/sign-up")
      .send({ name: "Mercadin User", email: "user@test.com", password: "123456" })
      .expect(201)
      .expect(result);

    expect(authService.signUp).toHaveBeenCalledWith({
      name: "Mercadin User",
      email: "user@test.com",
      password: "123456",
    });
  });

  it("rejects invalid sign-up data", async () => {
    await request(app.getHttpServer())
      .post("/auth/sign-up")
      .send({ name: "", email: "invalid", password: "123" })
      .expect(400);

    expect(authService.signUp).not.toHaveBeenCalled();
  });

  it("signs in without requiring authentication", async () => {
    const result = { user: { id: "user-123" }, session: { access_token: "token" } };
    authService.signIn.mockResolvedValueOnce(result);

    await request(app.getHttpServer())
      .post("/auth/sign-in")
      .send({ email: "user@test.com", password: "123456" })
      .expect(201)
      .expect(result);
  });

  it("rejects invalid sign-in data", async () => {
    await request(app.getHttpServer())
      .post("/auth/sign-in")
      .send({ email: "invalid", password: "" })
      .expect(400);

    expect(authService.signIn).not.toHaveBeenCalled();
  });

  it("propagates authentication failures", async () => {
    authService.signIn.mockRejectedValueOnce(new UnauthorizedException("Invalid credentials"));

    await request(app.getHttpServer())
      .post("/auth/sign-in")
      .send({ email: "user@test.com", password: "invalid" })
      .expect(401);
  });
});
