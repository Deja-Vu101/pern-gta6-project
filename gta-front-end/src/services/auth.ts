import { AxiosResponse } from "axios";
import { $api } from "../http";
import { IAuthResponse, ILoginedUser } from "../app.interfaces";

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

  async fetchUser(): Promise<AxiosResponse<ILoginedUser>> {
    return $api.get("/user");
  }
}

export default new AuthServices();
