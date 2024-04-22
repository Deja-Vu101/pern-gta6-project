import React, { useEffect, useState } from "react";
import style from "./waitlist.module.scss";

interface IOwnProps {
  id: number;
  registerType: "email" | "name" | "queue";
  inputVlue: string | number;
  type: "text" | "number";
  onChange: (newValue: any) => void;
}
const TableInput: React.FC<IOwnProps> = ({
  inputVlue,
  type,
  onChange,
  id,
  registerType,
}) => {
  const [inputValue, setInputValue] = useState(inputVlue);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\s+/g, " ");
    setInputValue(newValue);

    switch (registerType) {
      case "email" || newValue.trim() === "":
        const isValidEmail =
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(newValue);
        if (!isValidEmail) {
          setError("Invalid email");
        } else {
          onChange(newValue);
          setError(null);
        }
        break;

      case "name" || newValue.trim() === "":
        const isValidName = newValue.trim().length > 5;

        if (!isValidName) {
          setError("Invalid name");
        } else {
          onChange(newValue);
          setError(null);
        }
        break;
      case "queue" || newValue.trim() === "":
        const isValidQueue = /^[1-9]\d*$/.test(newValue);

        if (!isValidQueue) {
          setError("Invalid");
        } else {
          onChange(Number(newValue));
          setError(null);
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setInputValue(inputValue);
  }, [inputValue]);
  return (
    <div className={style.ErrorMessage_Container}>
      {error && <div className={style.ErrorMessage}>{error}</div>}
      <input
        className={style.Wait_Input}
        type={type}
        value={inputValue}
        onChange={handleInputChange}
      />
    </div>
  );
};

export { TableInput };
