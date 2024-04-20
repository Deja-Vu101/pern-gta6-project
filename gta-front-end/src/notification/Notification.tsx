import React, { useEffect } from "react";
import style from "./notification.module.scss";
import { PlayNotification } from "./notificationSound";

interface IOwnProps {
  type: "success" | "warning" | "failed";
  message: string;
  visible: boolean;
}
const Notification: React.FC<IOwnProps> = ({ message, visible, type }) => {
  useEffect(() => {
    PlayNotification(type);
  }, []);

  return (
    <div
      className={`${style.notification} ${type} ${
        visible ? "visible" : "hidden"
      }`}
    >
      {message}
    </div>
  );
};

export { Notification };
