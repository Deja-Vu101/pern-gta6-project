import React, { useEffect } from "react";
import { IWaitListItem } from "../app.interfaces";
import style from "./success.module.scss";
import { Link } from "react-router-dom";
import { PlayNotification } from "../notification/notificationSound";

interface IOwnProps {
  data: IWaitListItem;
}

const SuccessMessage: React.FC<IOwnProps> = ({ data: { queue } }) => {
  useEffect(() => {
    PlayNotification("success");
  }, []);
  return (
    <div className={style.Success_Message}>
      <h2>Form submitted successfully</h2>
      <p>
        Your number <span>№{queue}</span> in the queue
      </p>
      <button>
        <Link to={"/waitlist"}>Watch full waitlist</Link>
      </button>
    </div>
  );
};

export default SuccessMessage;
