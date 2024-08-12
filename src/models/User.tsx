export interface User {
  Name: string;
  Email: string;
  Password: string;
}

export type RequestType =
  | "GETONE"
  | "GETALL"
  | "UPDATE"
  | "ADD"
  | "DELETEONE"
  | "DELETEALL";
