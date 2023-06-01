import { useQuery } from "@tanstack/react-query";
import { HowLongToBeatEntry } from "howlongtobeat";

async function search(title: string): Promise<HowLongToBeatEntry[]> {
  const request = await fetch(`api/search?q=${title}`);
  const { response } = await request.json();

  return response;
}

export function useSearch(searchTerm: string, enabled?: boolean) {
  return useQuery({
    queryKey: ["search", searchTerm],
    queryFn: () => search(searchTerm),
    retryDelay: 3000,
    enabled,
    initialData: [],
    onError: (error) => {
      console.error(error);
    },
  });
}

export function useGameInfo(searchTerm: string) {
  return useQuery({
    queryKey: ["gameInfo", searchTerm],
    queryFn: () => search(searchTerm),
  });
}
