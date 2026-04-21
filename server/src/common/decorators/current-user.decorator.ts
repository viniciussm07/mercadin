import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import type { Request } from "express";

export interface AuthenticatedUser {
  id: string;
  email: string;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest<Request & { user?: AuthenticatedUser }>();
    if (!request.user) {
      throw new Error("CurrentUser decorator used on unauthenticated route");
    }
    return request.user;
  },
);
