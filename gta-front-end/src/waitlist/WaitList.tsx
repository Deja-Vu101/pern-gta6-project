import style from "./waitlist.module.scss";
import { IWaitListItem } from "../app.interfaces";
import { useEffect, useState } from "react";
import { useDebounce } from "../hooks";
import ErrorOutput from "../error/ErrorOutput";
import { Triangle } from "react-loader-spinner";
import { useSearchWaitItems, useWaitlist } from "../hooks/useWaitlist";

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

  useEffect(() => {
    setSearchErrorMessage("");
    if (inputValue !== "") {
      mutate(inputValue);
    }
  }, [debounce]);

  const dataForTable =
    inputValue !== "" && searchedWaitItems ? searchedWaitItems : data;

  return (
    <main className={style.Waitlist}>
      <h1>WaitList</h1>
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
                <th>Email</th>
                <th>Name</th>
                <th className={style.queue_cell}>Queue</th>
              </tr>
            </thead>
            <tbody>
              {!searchErrorMessage &&
                dataForTable.map((item: IWaitListItem) => (
                  <tr key={item.id}>
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
    </main>
  );
};

export default WaitList;
