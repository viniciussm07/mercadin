import { endpoints } from "@services/endpoints";
import { apiClient } from "@services/http";

export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
  expoPushToken?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export const usersService = {
  me: () => apiClient.get(endpoints.users.me).json<SessionUser>(),
};
