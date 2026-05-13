import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Role } from "./roles";

export enum DBMode {
  SQLITE = "sqlite",
  FILE = "file",
}
export interface UserPayload {
  userId: string,
  role: Role
}
export interface TokenPayload extends JwtPayload{
  user: UserPayload
}
export interface AuthRequest extends Request{
  user: UserPayload
}