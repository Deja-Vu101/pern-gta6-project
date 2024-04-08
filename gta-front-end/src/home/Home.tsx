import { SubmitHandler, useForm } from "react-hook-form";
import style from "./home.module.scss";
import { useMutation } from "@tanstack/react-query";
import waitlist from "../services/waitlist";
import { IWaitListAddItem, IWaitListItem } from "../app.interfaces";
import { useState } from "react";
import ErrorOutput from "../error/ErrorOutput";
import SuccessMessage from "../successMessage/SuccessMessage";

interface IFormState {
  email: string;
  name: string;
}

function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormState>();

  const [requestError, setRequestError] = useState("");
  const [requestResponseData, setRequestResponseData] = useState<IWaitListItem>(
    {} as IWaitListItem
  );
  const [isSuccess, setIsSuccess] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationKey: ["create requst"],
    mutationFn: (data: IWaitListAddItem) => waitlist.addToListWaitItem(data),
    onSuccess(data) {
      setRequestError("");
      setIsSuccess(true);

      setRequestResponseData(data);
    },
    onError(error: any) {
      setRequestError(error.response.data.message);
    },
  });

  const onSubmit: SubmitHandler<IFormState> = (data) => {
    mutate(data);
  };

  return (
    <main className={style.wrapper}>
      {isSuccess ? (
        <SuccessMessage data={requestResponseData} />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <h1>GTA 6 - Leave Your Request</h1>
          <input
            type="text"
            placeholder="Enter Name:"
            className="Input"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 5,
                message: "Length must be more than 5 characters",
              },
            })}
          />
          <ErrorOutput
            error={errors.name}
            errorMessage={errors.name?.message}
          />
          <input
            type="email"
            placeholder="Enter Email:"
            className="Input"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            })}
          />
          <ErrorOutput
            error={errors.email}
            errorMessage={errors.email?.message}
          />

          <ErrorOutput error={requestError} errorMessage={requestError} />

          <button disabled={isPending}>Get It!</button>
        </form>
      )}
    </main>
  );
}

export default Home;
