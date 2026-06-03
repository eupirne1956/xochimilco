export interface GmailUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  avatarColor: string;
  createdAt: string;
}

export interface UserSession {
  currentUser: GmailUser | null;
  activeAccounts: GmailUser[];
}
