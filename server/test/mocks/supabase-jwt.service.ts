export interface TestJwtClaims {
  sub: string;
  email?: string;
}

export class SupabaseJwtService {
  verify(_token: string): Promise<TestJwtClaims> {
    throw new Error("SupabaseJwtService must be mocked in HTTP tests");
  }
}
