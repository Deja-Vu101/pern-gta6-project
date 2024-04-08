import axios from "axios";
import { IWaitListAddItem, IWaitListItem } from "../app.interfaces";

const URL = "http://localhost:5000/api";

class WaitlistService {
  async fetchWaitList() {
    const res = await axios.get(`${URL}/waitlist`);

    return res.data;
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
}

export default new WaitlistService();
