export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
  expoPushToken?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
