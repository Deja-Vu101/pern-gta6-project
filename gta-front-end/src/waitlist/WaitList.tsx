import style from "./waitlist.module.scss";
import { IWaitListItem } from "../app.interfaces";
import { useEffect, useState } from "react";
import { useDebounce } from "../hooks";
import ErrorOutput from "../error/ErrorOutput";
import { Triangle } from "react-loader-spinner";
import {
  useDeleteItem,
  useSearchWaitItems,
  useUpdateItem,
  useWaitlist,
} from "../hooks/useWaitlist";
import { ProfileButton } from "../profile/ProfileButton";
import { MdDelete } from "react-icons/md";
import { FaUserEdit, FaUserCheck } from "react-icons/fa";
import { TableInput } from "./TableInput";
import waitlist from "../services/waitlist";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import TableHead from "./TableHead";
import { MusicPlayer } from "../MusicPlayer/MusicPlayer";

const WaitList = () => {
  const [searchedWaitItems, setSearchedWaitItems] = useState<IWaitListItem[]>(
    []
  );

  const [searchErrorMessage, setSearchErrorMessage] = useState<string>("");
  const [inputValue, setInputValue] = useState("");
  const [editMode, setEditMode] = useState<IWaitListItem[]>([]);

  const [filterSetting, setFilterSetting] = useState({
    column: "queue",
    orderBy: "asc",
  });

  const [sortedColumn, setSortedColumn] = useState(filterSetting.column);
  const [sortOrderBy, setSortOrderBy] = useState(filterSetting.orderBy);

  const { mutate, isError, isPending } = useSearchWaitItems({
    onSuccess: setSearchedWaitItems,
    setSearchErrorMessage: setSearchErrorMessage,
  });

  const { data, refetch } = useWaitlist(
    filterSetting.column,
    filterSetting.orderBy
  );

  const debounce = useDebounce(inputValue, 1000);

  const dataForTable =
    inputValue !== "" && searchedWaitItems ? searchedWaitItems : data;

  const { mutate: deleteWaitItem } = useDeleteItem();
  const deleteItem = (id: number) => {
    deleteWaitItem(id);
  };

  const { mutate: updateItem } = useUpdateItem();

  const editItem = async (
    id: number,
    name: string,
    email: string,
    queue: number
  ) => {
    const itemData = {
      id: id,
      name: name,
      email: email,
      queue: queue,
    };

    const isEditModeActive = editMode.some((item: any) => item.id === id);
    if (!isEditModeActive) {
      setEditMode((prev) => [...prev, itemData]);
    } else {
      const newObject = waitlist.findObjectById(editMode, id);

      if (newObject) {
        updateItem(newObject, {
          onSuccess: () => {
            if (inputValue !== "") {
              mutate({
                inputValue,
                column: filterSetting.column,
                orderBy: filterSetting.orderBy,
              });
            }
          },
        });
      }

      setEditMode((prev) => prev.filter((item: any) => item.id !== id));
    }
  };

  const handleInputChange = (
    itemId: number,
    field: string,
    newValue: string | number
  ) => {
    const updatedFieldItem = {
      id: itemId,
      name: field === "name" && newValue,
      email: field === "email" && newValue,
      queue: field === "queue" && newValue,
    };
    const filteredFieldsItem = Object.fromEntries(
      Object.entries(updatedFieldItem).filter(([key, value]) => value !== false)
    );

    const foundObject = waitlist.findObjectById(
      editMode,
      filteredFieldsItem.id
    );
    const newObject =
      foundObject && waitlist.mergeObjects(filteredFieldsItem, foundObject);

    const newArray =
      newObject &&
      editMode.map((item) => {
        if (item.id === filteredFieldsItem.id) {
          return newObject;
        } else {
          return item;
        }
      });

    if (newArray) {
      setEditMode(newArray);
    }
  };

  const getSortingIcon = (column: string, isHovered: boolean) => {
    if (isHovered) {
      return <FaArrowDown />;
    }

    if (sortedColumn === column) {
      return sortOrderBy === "asc" ? <FaArrowDown /> : <FaArrowUp />;
    }
    return null;
  };

  const onClickTableHead = (column: string) => {
    const sortBy = sortOrderBy === "asc" ? "desc" : "asc";
    if (column === filterSetting.column) {
      setSortOrderBy(sortBy);
      setFilterSetting({ column: column, orderBy: sortBy });
    } else {
      setSortedColumn(column);
      setSortOrderBy("asc");
      setFilterSetting({ column: column, orderBy: "asc" });
    }
  };

  useEffect(() => {
    const fetchData = () => {
      if (inputValue === "") {
        refetch();
      } else {
        setSearchErrorMessage("");
        if (inputValue !== "") {
          mutate({
            inputValue,
            column: filterSetting.column,
            orderBy: filterSetting.orderBy,
          });
        }
      }
    };
    fetchData();
  }, [debounce, filterSetting.column, filterSetting.orderBy]);

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
            <TableHead
              getSortingIcon={getSortingIcon}
              onClickTableHead={onClickTableHead}
            />
            <tbody>
              {!searchErrorMessage &&
                dataForTable.map((item: IWaitListItem) => (
                  <tr key={item.id}>
                    <td className={style.admin_cell}>
                      <div className={style.admin_buttons}>
                        <span onClick={() => deleteItem(item.id)}>
                          <MdDelete />
                        </span>

                        <span
                          onClick={() =>
                            editItem(item.id, item.name, item.email, item.queue)
                          }
                        >
                          {editMode.some(
                            (editItem: any) => editItem.id === item.id
                          ) ? (
                            <FaUserCheck color="#8bc34a" />
                          ) : (
                            <FaUserEdit />
                          )}
                        </span>
                      </div>
                    </td>
                    <td>
                      {editMode.some(
                        (editItem: any) => editItem.id === item.id
                      ) ? (
                        <TableInput
                          inputVlue={item.email}
                          type="text"
                          id={item.id}
                          registerType="email"
                          onChange={(newValue) =>
                            handleInputChange(item.id, "email", newValue)
                          }
                        />
                      ) : (
                        <span className="pl-1">{item.email}</span>
                      )}
                    </td>
                    <td>
                      {editMode.some(
                        (editItem: any) => editItem.id === item.id
                      ) ? (
                        <TableInput
                          inputVlue={item.name}
                          type="text"
                          id={item.id}
                          registerType="name"
                          onChange={(newValue) =>
                            handleInputChange(item.id, "name", newValue)
                          }
                        />
                      ) : (
                        <span className="pl-1">{item.name}</span>
                      )}
                    </td>
                    <td className={style.queue_cell}>
                      {editMode.some(
                        (editItem: any) => editItem.id === item.id
                      ) ? (
                        <TableInput
                          inputVlue={item.queue}
                          type="number"
                          id={item.id}
                          registerType="queue"
                          onChange={(newValue) =>
                            handleInputChange(item.id, "queue", newValue)
                          }
                        />
                      ) : (
                        <span className="pl-1">{item.queue}</span>
                      )}
                    </td>
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

      <MusicPlayer />
    </main>
  );
};

export default WaitList;
