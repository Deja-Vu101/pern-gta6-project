export interface IUser {
  id: string;
  email: string;
  password: string;
  isActivated: boolean;
  activationLink?: string | null;
  tokens?: IToken[];
}

export interface IToken {
  id: number;
  userId: string;
  refreshToken: string;
}
