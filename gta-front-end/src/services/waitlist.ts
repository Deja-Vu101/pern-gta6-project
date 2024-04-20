import axios, { AxiosError } from "axios";
import {
  IApiResponse,
  IWaitListAddItem,
  IWaitListItem,
} from "../app.interfaces";
import { $api } from "../http";

const URL = "http://localhost:5000/api";

class WaitlistService {
  async fetchWaitList() {
    try {
      const res = await $api.get(`${URL}/waitlist`);

      return res.data;
    } catch (error) {
      const axiosError = error as AxiosError<
        IApiResponse<{ message: string; arrays: any[] }>
      >;

      if (axiosError.response?.status === 401) {
        window.location.href = "/login";
      }
    }
  }

  async addToListWaitItem(data: IWaitListAddItem): Promise<IWaitListItem> {
    const res = await axios.post(`${URL}`, {
      email: data.email,
      name: data.name,
    });
    return res.data;
  }

  async fetchSearchWaitItem(searchTerm: string) {
    const res = await axios.get(`${URL}/waitlist/${searchTerm}`);

    return res.data;
  }

  async deleteItem(id: number) {
    const reqBody = {
      id: id,
    };
    return axios.delete(`${URL}/waitlist`, {
      data: reqBody,
    });
  }
}

export default new WaitlistService();
