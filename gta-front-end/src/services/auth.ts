import { AxiosResponse } from "axios";
import { $api } from "../http";
import { IAuthResponse } from "../app.interfaces";

class AuthServices {
  async login(
    email: string,
    password: string
  ): Promise<AxiosResponse<IAuthResponse>> {
    return $api.post<IAuthResponse>("/login", {
      email,
      password,
    });
  }

  async registration(
    email: string,
    password: string
  ): Promise<AxiosResponse<IAuthResponse>> {
    return $api.post<IAuthResponse>("/registration", {
      email,
      password,
    });
  }
  async logout(): Promise<void> {
    return $api.post("/logout");
  }
}

export default new AuthServices();
