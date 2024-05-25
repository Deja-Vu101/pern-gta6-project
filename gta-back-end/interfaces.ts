import { Request } from "express";
export interface IUser {
  id: string;
  email: string;
  password: string;
  isActivated: boolean;
  activationLink?: string | null;
  tokens?: IToken[];
  roleName: string[];
}

export interface IToken {
  id: number;
  userId: string;
  refreshToken: string;
}

export interface IValidateToken {
  email: string;
  id: string;
  isActivated: boolean;
  iat: number;
  exp: number;
  roleName: string[];
}

export interface AuthRequest extends Request {
  user?: any;
}

export interface IWaitItem {
  id: number;
  name: string;
  email: string;
  queue: number;
}
