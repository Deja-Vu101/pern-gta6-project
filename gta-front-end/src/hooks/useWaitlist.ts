import { useMutation, useQuery } from "@tanstack/react-query";
import waitlist from "../services/waitlist";
import { IUseSearchWaitItems, IWaitListItem } from "../app.interfaces";
import { AxiosError } from "axios";

export const useWaitlist = () => {
  return useQuery({
    queryKey: ["waitlist"],
    queryFn: waitlist.fetchWaitList,
  });
};

export const useSearchWaitItems = ({
  onSuccess,
  setSearchErrorMessage,
}: IUseSearchWaitItems) => {
  return useMutation({
    mutationKey: ["search waitlist item"],
    mutationFn: (inputValue: string) =>
      waitlist.fetchSearchWaitItem(inputValue),
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
