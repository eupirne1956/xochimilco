export interface GmailUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  avatarColor: string;
  createdAt: string;
  role?: "admin" | "user" | "guest"; // Added optional role parameter
  accessExpiresAt?: string; // Optional field for tracking guest login expiration duration (30 days)
}

export interface AuthorizedUser {
  email: string;
  role: "admin" | "user";
  access_granted_at: string; // ISO standard datetime string or timestamp from firestore
  access_expires_at: string; // ISO standard datetime string or timestamp from firestore
}

export interface UserSession {
  currentUser: GmailUser | null;
  activeAccounts: GmailUser[];
}
