import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import jwt from "jsonwebtoken";

export interface SupabaseJwtClaims {
  sub: string;
  email?: string;
  aud?: string;
  exp?: number;
  iat?: number;
  role?: string;
}

@Injectable()
export class SupabaseJwtService {
  private readonly secret: string;

  constructor(config: ConfigService) {
    const secret = config.get<string>("SUPABASE_JWT_SECRET");
    if (!secret) {
      throw new Error("SUPABASE_JWT_SECRET is not configured");
    }
    this.secret = secret;
  }

  verify(token: string): SupabaseJwtClaims {
    try {
      const payload = jwt.verify(token, this.secret, {
        algorithms: ["HS256"],
      });
      if (typeof payload === "string" || !payload.sub) {
        throw new UnauthorizedException("Invalid token payload");
      }
      return payload as SupabaseJwtClaims;
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
