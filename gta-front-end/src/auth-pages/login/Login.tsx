import { SubmitHandler } from "react-hook-form";
import login from "../auth.module.scss";
import { IAuthForm } from "../../app.interfaces";
import Form from "../../forms/Form";
import { useState } from "react";
import ErrorOutput from "../../error/ErrorOutput";
import { useLogin } from "../../hooks/useAuth";

export const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const { mutate } = useLogin({ setErrorMessage });

  const onSubmit: SubmitHandler<IAuthForm> = (data) => {
    mutate(data);
  };

  return (
    <div className={login.LoginPage}>
      <div className={login.wrapper}>
        <h2>Login</h2>
        <ErrorOutput error={errorMessage} errorMessage={errorMessage} />

        <Form onSubmit={onSubmit} />
      </div>
    </div>
  );
};
