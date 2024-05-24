import axios, { AxiosError } from "axios";
import {
  IApiResponse,
  IWaitListAddItem,
  IWaitListItem,
} from "../app.interfaces";
import { $api } from "../http";

const URL = "http://localhost:5000/api";

class WaitlistService {
  async fetchWaitList(param: { column: string; orderBy: string }) {
    try {
      const res = await $api.get(`${URL}/waitlist`, {
        params: {
          column: param.column,
          orderBy: param.orderBy,
        },
      });
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

  async fetchSearchWaitItem(
    searchTerm: string,
    column: string,
    orderBy: string
  ) {
    const res = await $api.get(`${URL}/waitlist/${searchTerm}`, {
      params: {
        column: column,
        orderBy: orderBy,
      },
    });

    return res.data;
  }

  async deleteItem(id: number) {
    const reqBody = {
      id: id,
    };
    return $api.delete(`${URL}/waitlist`, {
      data: reqBody,
    });
  }

  mergeObjects(
    itemWithUpdatedField: any,
    existingItem: IWaitListItem
  ): IWaitListItem {
    const updatedObject = { ...existingItem };

    if (itemWithUpdatedField.hasOwnProperty("email")) {
      updatedObject.email = itemWithUpdatedField.email;
    }
    if (itemWithUpdatedField.hasOwnProperty("name")) {
      updatedObject.name = itemWithUpdatedField.name;
    }
    if (itemWithUpdatedField.hasOwnProperty("queue")) {
      updatedObject.queue = itemWithUpdatedField.queue;
    }

    return updatedObject;
  }
  findObjectById(array: IWaitListItem[], id: string | number | false) {
    return array.find((item) => item.id === id);
  }

  async updateWaitItem(newObject: IWaitListItem) {
    return await $api.put(`${URL}/waitlist`, newObject);
  }
}

export default new WaitlistService();
