import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { IAuthForm } from "../app.interfaces";
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
      navigate("/waitlist");
    },
    onError: (error: AxiosError) => {
      const errorResponse = error.response?.data as { message: string };
      const errorMessage = errorResponse?.message;
      setErrorMessage(errorMessage);
    },
  });
};
