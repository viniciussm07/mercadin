import { endpoints } from "@services/endpoints";
import { apiClient } from "@services/http";
import { SessionUser } from "./types";

export const usersService = {
  me: () => apiClient.get(endpoints.users.me).json<SessionUser>(),
};
