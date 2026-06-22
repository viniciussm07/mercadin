import { INestApplication, Provider, Type, ValidationPipe } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import { JwtAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { SupabaseJwtService } from "@/modules/auth/services/supabase-jwt.service";

export const TEST_USER = {
  id: "user-123",
  email: "user@mercadin.test",
} as const;

export const authHeader = {
  Authorization: "Bearer valid-test-token",
} as const;

interface CreateTestAppOptions {
  controllers: Type<unknown>[];
  providers: Provider[];
}

export async function createTestApp({
  controllers,
  providers,
}: CreateTestAppOptions): Promise<INestApplication> {
  const jwt = {
    verify: jest.fn().mockResolvedValue({
      sub: TEST_USER.id,
      email: TEST_USER.email,
    }),
  };
  const moduleRef = await Test.createTestingModule({
    controllers,
    providers: [
      ...providers,
      JwtAuthGuard,
      { provide: SupabaseJwtService, useValue: jwt },
      { provide: APP_GUARD, useExisting: JwtAuthGuard },
    ],
  }).compile();

  const app = moduleRef.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.init();
  return app;
}
