import { useQuery } from "@tanstack/react-query";

async function search(title: string): Promise<any[]> {
  const headers = new Headers();
  headers.append("Access-Control-Allow-Origin", "*");
  const request = await fetch(
    `https://backlog-app-nest.vercel.app/api/v1/search/${title}`,
    { headers }
  );
  const data = await request.json();

  return data;
}

export function useSearch(searchTerm: string) {
  return useQuery({
    queryKey: ["search", searchTerm],
    queryFn: () => search(searchTerm),
    retryDelay: 3000,
    enabled: false,
    initialData: [],
  });
}
