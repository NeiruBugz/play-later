"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

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

import { useAuthStore } from "../auth/lib/store";

export default function Form() {
  const params = useSearchParams();
  const router = useRouter();
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      title: params.get("title") ?? "",
      platform: "",
      status: "backlog",
    },
  });
  const { uid } = useAuthStore();

  const onSubmit = async (values: any) => {
    console.log(values);
    const gameData = {
      user: uid,
      id: params.get("id"),
      img: params.get("image"),
      ...values,
    };
    await addGame(gameData, "games");
    router.push("/library?status=backlog");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <div className="w-full">
        <Label htmlFor="title">Game Title</Label>
        <Input
          type="text"
          placeholder="Enter game title"
          {...register("title")}
        />
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
