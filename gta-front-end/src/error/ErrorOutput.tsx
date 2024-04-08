import React from "react";
import style from "./error.module.scss";
import { FieldError } from "react-hook-form";

interface IOwnProps {
  error: string | undefined | FieldError;
  errorMessage: string | undefined;
}

const ErrorOutput: React.FC<IOwnProps> = ({ error, errorMessage }) => {
  return (
    <div className={style.Error_Output}>{error && <p>{errorMessage}</p>}</div>
  );
};

export default ErrorOutput;
