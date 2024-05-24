import React, { ReactNode, useState } from "react";
import style from "./waitlist.module.scss";

interface IOwnProps {
  onClickTableHead: (value: string) => void;
  getSortingIcon: (column: string, isHovered: boolean) => ReactNode;
}

const TableHead: React.FC<IOwnProps> = ({
  onClickTableHead,
  getSortingIcon,
}) => {
  const [hoveredColumn, setHoveredColumn] = useState("");

  const onTableHeadLeave = () => {
    setHoveredColumn("");
  };
  return (
    <thead className={style.stickyHeader}>
      <tr>
        <th className={style.admin}></th>

        <th
          onMouseEnter={() => setHoveredColumn("email")}
          onMouseLeave={onTableHeadLeave}
          onClick={() => onClickTableHead("email")}
        >
          <div className={style.tableHead_container}>
            Email
            {getSortingIcon("email", hoveredColumn === "email")}
          </div>
        </th>

        <th
          onMouseEnter={() => setHoveredColumn("name")}
          onMouseLeave={onTableHeadLeave}
          onClick={() => onClickTableHead("name")}
        >
          <div className={style.tableHead_container}>
            Name
            {getSortingIcon("name", hoveredColumn === "name")}
          </div>
        </th>
        <th
          className={style.queue_cell}
          onMouseEnter={() => setHoveredColumn("queue")}
          onMouseLeave={onTableHeadLeave}
          onClick={() => onClickTableHead("queue")}
        >
          <div className={style.tableHead_container}>
            Queue
            {getSortingIcon("queue", hoveredColumn === "queue")}
          </div>
        </th>
      </tr>
    </thead>
  );
};

export default TableHead;
