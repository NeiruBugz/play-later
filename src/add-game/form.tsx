"use client";

import React, { AllHTMLAttributes } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/src/auth/lib/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { useSearch } from "@/lib/api";
import { addGame } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  title: z.string({ required_error: "Game title is required" }).min(1),
  platform: z.string({ required_error: "Platform is required" }).min(1),
  status: z.string({ required_error: "Status is required" }).min(1),
});

type Fields = z.infer<typeof schema>;

function SuggestBox({
  results,
  onSelect,
}: {
  results: any[];
  onSelect: (payload: { title: string; id: string; img?: string }) => void;
}) {
  return (
    <div className="absolute z-10 w-full rounded-md bg-background shadow-md p-1">
      {results.map((result) => (
        <div
          className="px-2 py-1 hover:bg-slate-300 hover:rounded-sm cursor-pointer"
          key={result.id}
          onClick={() =>
            onSelect({
              title: result.name,
              id: result.id,
              img: result.imageUrl,
            })
          }
        >
          {result.name}
        </div>
      ))}
    </div>
  );
}

export default function Form() {
  const params = useSearchParams();
  const router = useRouter();
  const ref = React.useRef<HTMLElement>(null);
  const { register, control, handleSubmit, watch, ...methods } =
    useForm<Fields>({
      resolver: zodResolver(schema),
      defaultValues: {
        title: params.get("title") ?? "",
        platform: "",
        status: "backlog",
      },
    });
  const gameTitle = watch("title");
  const [gameInfo, setGameInfo] = React.useState({});

  const { uid } = useAuthStore();
  const { data: searchResults, refetch } = useSearch(gameTitle);

  React.useEffect(() => {
    if (gameTitle.length !== 0) {
      refetch();
    }
  }, [gameTitle]);

  const onSubmit = async (values: Fields) => {
    try {
      const gameData = {
        user: uid,
        id: params.get("id"),
        img: params.get("image"),
        ...values,
      };
      await addGame(gameData, "games");
      router.push("/library?status=backlog");
    } catch (err) {
      console.error(err);
    }
  };

  const onGameSelect = (value: { title: string; id: string; img?: string }) => {
    setGameInfo(value);
    methods.setValue("title", value.title);
  };

  console.log(gameInfo);
  console.log(searchResults);
  console.log(ref.current?.getBoundingClientRect().width);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <div className="w-full relative">
        <Label htmlFor="title">Game Title</Label>
        <Input
          type="text"
          placeholder="Enter game title"
          className="w-full"
          {...register("title")}
        />
        <SuggestBox results={searchResults} onSelect={onGameSelect} />
      </div>
      <div className="w-full">
        <Label htmlFor="platform">Platform</Label>
        <Controller
          name="platform"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger {...field}>
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pc">PC</SelectItem>
                <SelectItem value="nintendo">Nintendo</SelectItem>
                <SelectItem value="playstation">Playstation</SelectItem>
                <SelectItem value="xbox">Xbox</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="w-full">
        <Label htmlFor="status">Status</Label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger {...field}>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="backlog">Backlog</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="abandoned">Abandoned</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <Button>Add game</Button>
    </form>
  );
}
