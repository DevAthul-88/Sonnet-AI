import { User } from "next-auth";
import { JWT } from "next-auth/jwt";


declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
