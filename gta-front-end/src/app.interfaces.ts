export interface IWaitListItem {
  id: number;
  name: string;
  email: string;
  queue: number;
}

export interface IWaitListAddItem extends Omit<IWaitListItem, "id" | "queue"> {}

export interface IApiResponse<T> {
  config: any;
  data: T;
  headers: any;
  request: any;
  status: number;
  statusText: string;
}

export interface IUseSearchWaitItems {
  setSearchErrorMessage: (text: string) => void;
  onSuccess: (searchedItems: IWaitListItem[]) => void;
}

export interface IUser {
  email: string;
  isActivated: boolean;
  id: string;
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export interface IAuthForm {
  email: string;
  password: string;
  repeated?: string;
}

