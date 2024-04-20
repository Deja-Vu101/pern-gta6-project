import style from "./waitlist.module.scss";
import { IWaitListItem } from "../app.interfaces";
import { useEffect, useState } from "react";
import { useDebounce } from "../hooks";
import ErrorOutput from "../error/ErrorOutput";
import { Triangle } from "react-loader-spinner";
import {
  useDeleteItem,
  useSearchWaitItems,
  useWaitlist,
} from "../hooks/useWaitlist";
import { ProfileButton } from "../profile/ProfileButton";
import { MdDelete } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";

const WaitList = () => {
  const [searchedWaitItems, setSearchedWaitItems] = useState<IWaitListItem[]>(
    []
  );
  const [searchErrorMessage, setSearchErrorMessage] = useState<string>("");
  const [inputValue, setInputValue] = useState("");

  const { mutate, isError, isPending } = useSearchWaitItems({
    onSuccess: setSearchedWaitItems,
    setSearchErrorMessage: setSearchErrorMessage,
  });

  const { data } = useWaitlist();

  const debounce = useDebounce(inputValue, 1000);

  const dataForTable =
    inputValue !== "" && searchedWaitItems ? searchedWaitItems : data;

  const { mutate: deleteWaitItem } = useDeleteItem();
  const deleteItem = (id: number) => {
    deleteWaitItem(id);
  };

  useEffect(() => {
    setSearchErrorMessage("");
    if (inputValue !== "") {
      mutate(inputValue);
    }
  }, [debounce]);
  return (
    <main className={style.Waitlist}>
      <div className={style.table_name}>
        <h1>WaitList</h1>
      </div>

      <input
        type="text"
        className="Input"
        placeholder="Find an item on the waiting list..."
        value={inputValue}
        onChange={(e) => {
          setSearchErrorMessage("");
          setInputValue(e.target.value.trim());
        }}
      />
      <div
        className={`${style.container} ${
          isError || isPending ? style.disable : ""
        }`}
      >
        {dataForTable && (
          <table>
            <thead className={style.stickyHeader}>
              <tr>
                <th></th>
                <th>Email</th>
                <th>Name</th>
                <th className={style.queue_cell}>Queue</th>
              </tr>
            </thead>
            <tbody>
              {!searchErrorMessage &&
                dataForTable.map((item: IWaitListItem) => (
                  <tr key={item.id}>
                    <td className={style.admin_cell}>
                      <div>
                        <span onClick={() => deleteItem(item.id)}>
                          <MdDelete />
                        </span>

                        <FaUserEdit />
                      </div>
                    </td>
                    <td>{item.email}</td>
                    <td>{item.name}</td>
                    <td className={style.queue_cell}>{item.queue}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
        {isPending && (
          <Triangle
            visible={true}
            height="100"
            width="100"
            color="#d67b9f"
            ariaLabel="triangle-loading"
            wrapperStyle={{}}
            wrapperClass={style.Loader}
          />
        )}
        <ErrorOutput
          error={searchErrorMessage}
          errorMessage={searchErrorMessage}
        />
      </div>

      <ProfileButton />
    </main>
  );
};

export default WaitList;
