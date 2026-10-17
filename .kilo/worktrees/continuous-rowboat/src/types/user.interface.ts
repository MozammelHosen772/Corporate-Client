// import { UserRole } from "@/lib/auth-utils";
// import { IAdmin } from "./admin.interface";

// export interface UserInfo {
//   id: string;
//   name: string;
//   phone: string;
//   role: UserRole;
//   picture: string;
//   email?: string;
//   status: "ACTIVE" | "BLOCKED" | "DELETED";
//   admin?: IAdmin;
//   createdAt: string;
//   updatedAt: string;
//   address:string;
//   designation:string;

// }

import { UserRole } from "@/lib/auth-utils";
import { IAdmin } from "./admin.interface";

// ───────────────── Gender Enum ─────────────────
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

// ───────────────── User Status ─────────────────
export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";

// ───────────────── Main User Interface ─────────────────
export interface UserInfo {
  id: string;

  name: string;

  phone: string;

  role: UserRole;

  profilePicture?: string;

  email?: string;

  emailVerified?: boolean;

  status: UserStatus;

  admin?: IAdmin;

  createdAt: string;

  updatedAt: string;

  address?: string;

  designation?: string;

  gender?: Gender;

  profileCompletion?: number;

  profileCompleted?: boolean;
}
