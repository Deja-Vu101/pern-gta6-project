import { SubmitHandler } from "react-hook-form";
import register from "../auth.module.scss";
import { IAuthForm } from "../../app.interfaces";
import Form from "../../forms/Form";
import { useState } from "react";
import ErrorOutput from "../../error/ErrorOutput";
import { useRegister } from "../../hooks/useAuth";

const Register = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const { mutate } = useRegister({ setErrorMessage });

  const onSubmit: SubmitHandler<IAuthForm> = (data) => {
    mutate(data);
  };
  return (
    <div className={register.LoginPage}>
      <div className={register.wrapper}>
        <h2>Register</h2>
        <ErrorOutput error={errorMessage} errorMessage={errorMessage} />

        <Form onSubmit={onSubmit} />
      </div>
    </div>
  );
};

export default Register;
