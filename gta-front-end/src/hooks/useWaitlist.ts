import { useMutation, useQuery } from "@tanstack/react-query";
import waitlist from "../services/waitlist";
import { IUseSearchWaitItems, IWaitListItem } from "../app.interfaces";
import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useNotification } from "../notification/NotificationContext";

export const useWaitlist = (column: string, orderBy: string) => {
  return useQuery({
    queryKey: ["waitlist"],
    queryFn: () => waitlist.fetchWaitList({ column, orderBy }),
  });
};
interface SearchParams {
  inputValue: string;
  column: string;
  orderBy: string;
}
export const useSearchWaitItems = ({
  onSuccess,
  setSearchErrorMessage,
}: IUseSearchWaitItems) => {
  return useMutation<IWaitListItem[], AxiosError, SearchParams>({
    mutationKey: ["search waitlist item"],
    mutationFn: ({
      inputValue,
      column,
      orderBy,
    }: {
      inputValue: string;
      column: string;
      orderBy: string;
    }) => waitlist.fetchSearchWaitItem(inputValue, column, orderBy),
    onSuccess: (searchedItems: IWaitListItem[]) => {
      setSearchErrorMessage("");
      onSuccess(searchedItems);
    },
    onError: (error: AxiosError) => {
      const errorResponse = error.response?.data as { message: string };
      const errorMessage = errorResponse?.message;
      setSearchErrorMessage(errorMessage);
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationKey: ["deleteItem"],
    mutationFn: async (id: number) => await waitlist.deleteItem(id),
    onSuccess(data) {
      showNotification(data.data.message, "success");

      queryClient.invalidateQueries({ queryKey: ["waitlist"] });
    },
    onError(error: AxiosError) {
      const errorResponse = error.response?.data as { message: string };
      const errorMessage = errorResponse?.message;
      showNotification(
        `Something went wrong while deleting. ${errorMessage}`,
        "failed"
      );
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationKey: ["updateItem"],
    mutationFn: async (newObject: IWaitListItem) =>
      await waitlist.updateWaitItem(newObject),
    onSuccess(data) {
      showNotification(data.data.message, "success");

      queryClient.invalidateQueries({ queryKey: ["waitlist"] });
    },
    onError(error: AxiosError) {
      const errorResponse = error.response?.data as { message: string };
      const errorMessage = errorResponse?.message;
      if (error.response?.status === 403) {
        showNotification(errorMessage, "warning");
      } else {
        showNotification(errorMessage, "failed");
      }
    },
  });
};
