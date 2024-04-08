export interface IWaitListItem {
  id: string;
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
