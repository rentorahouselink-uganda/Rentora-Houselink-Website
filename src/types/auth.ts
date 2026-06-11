export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  provider: string; // "LOCAL" | "GOOGLE" | "APPLE"
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};