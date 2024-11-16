export interface AuthData {
  jwt: string;
  user: User;
}

export interface Role {
  name: "Admin" | "Authenticated";
}

export interface User {
  documentId: string;
  email: string;
  role?: Role;
}
