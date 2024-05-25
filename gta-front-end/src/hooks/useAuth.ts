import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { IAuthForm, IAuthResponse, ILoginedUser } from "../app.interfaces";
import auth from "../services/auth";
import { AxiosError } from "axios";

interface IUseLogin {
  setErrorMessage: (message: string) => void;
}

export const useLogin = ({ setErrorMessage }: IUseLogin) => {
  const navigate = useNavigate();
  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (data: IAuthForm) => {
      const res = await auth.login(data.email, data.password);
      return res.data;
    },
    onSuccess(data) {
      localStorage.setItem("accessToken", data.accessToken);
      addAuthDataInSessionStorage(data.user);
      navigate("/waitlist");
    },
    onError: (error: AxiosError) => {
      const errorResponse = error.response?.data as { message: string };
      const errorMessage = errorResponse?.message;
      setErrorMessage(errorMessage);
    },
  });
};

export const useRegister = ({ setErrorMessage }: IUseLogin) => {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["register"],
    mutationFn: async (data: IAuthForm) => {
      const res = await auth.registration(data.email, data.password);
      return res.data;
    },
    onSuccess(data) {
      localStorage.setItem("accessToken", data.accessToken);
      addAuthDataInSessionStorage(data.user);
      navigate("/waitlist");
    },
    onError: (error: AxiosError) => {
      const errorResponse = error.response?.data as { message: string };
      const errorMessage = errorResponse?.message;
      setErrorMessage(errorMessage);
    },
  });
};

export const useUser = () => {
  return useMutation({
    mutationKey: ["fetch_user"],
    mutationFn: async () => {
      const res = await auth.fetchUser();
      return res.data;
    },
  });
};

export const addAuthDataInSessionStorage = (data: ILoginedUser) => {
  const { email, id, isActivated } = data;
  sessionStorage.setItem("auth-email", email);
  sessionStorage.setItem("auth-id", id);
  sessionStorage.setItem("auth-isActivated", isActivated.toString());
};
