import { createContext, useContext, useState } from "react";
import { Notification } from "./Notification";
import not from "../notification/notification.module.scss";

const initialNotificationState = {
  showNotification: (
    message: string,
    type: "success" | "warning" | "failed"
  ) => {},
};
const NotificationContext = createContext(initialNotificationState);

const NotificationProvider = ({ children }: any) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [visible, setVisible] = useState(true);
  const showNotification = (
    message: string,
    type: "success" | "warning" | "failed"
  ) => {
    const newNotification = { message, id: Date.now(), type };
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      newNotification,
    ]);

    setTimeout(() => {
      removeNotification(newNotification.id);
      setVisible(false);
    }, 5000);
  };

  const removeNotification = (id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };
  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className={not.notification_container}>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            message={notification.message}
            visible={visible}
            type={notification.type}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export { NotificationProvider };

export const useNotification = () => {
  return useContext(NotificationContext);
};
