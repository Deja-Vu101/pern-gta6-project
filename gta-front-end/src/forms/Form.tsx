import { SubmitHandler, useForm } from "react-hook-form";
import ErrorOutput from "../error/ErrorOutput";
import { IAuthForm } from "../app.interfaces";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import form from "../auth-pages/auth.module.scss";

interface IOwnProps {
  onSubmit: (data: IAuthForm) => void;
}

const Form: React.FC<IOwnProps> = ({ onSubmit }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const path = pathname.replace("/", "");
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<IAuthForm>();

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatedPass, setShowRepeatedPass] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  const toggleShowRepeatedPass = () => {
    setShowRepeatedPass((prev) => !prev);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Invalid email address",
          },
        })}
        type="text"
        placeholder="Email"
        className="Input"
      />
      <ErrorOutput error={errors.email} errorMessage={errors.email?.message} />

      <div className={form.Input_Wrapper}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="Input"
          {...register("password", {
            minLength: {
              value: 6,
              message: "Password should be at least 6 characters",
            },
            maxLength: {
              value: 32,
              message: "Password should not exceed 32 characters",
            },
            required: "Password is required",
          })}
        />

        <div onClick={toggleShowPassword}>
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </div>
      </div>

      <ErrorOutput
        error={errors.password}
        errorMessage={errors.password?.message}
      />
      {path === "register" && (
        <>
          <div className={form.Input_Wrapper}>
            <input
              type={showRepeatedPass ? "text" : "password"}
              placeholder="Repeat password"
              className="Input"
              {...register("repeated", {
                minLength: {
                  value: 6,
                  message: "Password should be at least 6 characters",
                },
                maxLength: {
                  value: 32,
                  message: "Password should not exceed 32 characters",
                },
                required: "Password is required",
                validate: (value) =>
                  value === watch("password") || "The passwords do not match",
              })}
            />
            <div onClick={toggleShowRepeatedPass}>
              {showRepeatedPass ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          <ErrorOutput
            error={errors.repeated}
            errorMessage={errors.repeated?.message}
          />
        </>
      )}

      <button className="Button">{path}</button>
      <div>
        <span
          className="cursor-pointer"
          onClick={() => navigate(path === "login" ? "/register" : "/login")}
        >
          {path === "login"
            ? "create new account..."
            : "login in exist account"}
        </span>
      </div>
    </form>
  );
};

export default Form;
