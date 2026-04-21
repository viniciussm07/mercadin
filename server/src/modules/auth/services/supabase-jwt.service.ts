import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

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
  private readonly jwks: jwksClient.JwksClient;

  constructor(config: ConfigService) {
    const supabaseUrl = config.get<string>("SUPABASE_URL");
    const anonKey = config.get<string>("SUPABASE_ANON_KEY");
    if (!supabaseUrl || !anonKey) {
      throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY must be configured");
    }
    this.jwks = jwksClient({
      jwksUri: `${supabaseUrl}/auth/v1/.well-known/jwks.json`,
      requestHeaders: { apikey: anonKey },
      cache: true,
      rateLimit: true,
    });
  }

  private getKey: jwt.GetPublicKeyOrSecret = (header, callback) => {
    if (!header.kid) {
      callback(new Error("No kid in token header"));
      return;
    }
    this.jwks.getSigningKey(header.kid, (err, key) => {
      callback(err ?? null, key?.getPublicKey());
    });
  };

  async verify(token: string): Promise<SupabaseJwtClaims> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.getKey, { algorithms: ["ES256"] }, (err, payload) => {
        if (err || typeof payload === "string" || !payload?.sub) {
          reject(new UnauthorizedException("Invalid or expired token"));
          return;
        }
        resolve(payload as SupabaseJwtClaims);
      });
    });
  }
}
