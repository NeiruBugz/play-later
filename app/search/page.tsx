"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { LucideCross, LucideX } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

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

export default function SearchPage() {
  const { register, handleSubmit, control } = useForm();
  const router = useRouter();
  const title = useWatch({
    control,
    name: "title",
  });
  const { data, refetch } = useQuery({
    queryKey: [],
    queryFn: () => search(title),
    enabled: false,
  });

  React.useEffect(() => {
    const keyPress = (event: KeyboardEvent) => {
      if (event.key === "esc") {
        router.back();
      }
    };

    document.addEventListener("keydown", keyPress);

    return () => {
      document.removeEventListener("keydown", keyPress);
    };
  }, [router]);

  const onSubmit = () => {
    refetch();
  };

  return (
    <div className="t-0 l-0 container absolute z-50 flex h-screen w-screen flex-col bg-slate-400/50 pt-11">
      <div className="flex w-full flex-row-reverse py-4">
        <Button variant="secondary" onClick={() => router.back()}>
          <LucideX />
        </Button>
      </div>
      <form className="flex w-full gap-2" onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="search"
          className="bg-background"
          placeholder="Enter game title"
          {...register("title")}
        />
        <Button>Search</Button>
      </form>
      <ScrollArea>
        {data?.length &&
          data.map((game) => {
            return (
              <Card key={game.id} className="my-2">
                <CardContent className="flex flex-row-reverse justify-end gap-4 p-3">
                  <div className="flex flex-col gap-2">
                    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                      {game.name}
                    </h2>
                    <section>
                      <Label className="mr-2 inline-block w-[88px]">
                        Playable on
                      </Label>
                      {game.platforms.map((platform: string) => {
                        return (
                          <Badge
                            className={cn("capitalize text-white", {
                              "bg-nintendo":
                                platform.toLowerCase() === "nintendo" ||
                                platform.toLowerCase().includes("nintendo"),
                              "bg-playstation":
                                platform.toLowerCase() === "playstation" ||
                                platform.toLowerCase().includes("playstation"),
                              "bg-xbox": platform.toLowerCase() === "xbox",
                              "bg-pc uppercase":
                                platform.toLowerCase() === "pc",
                            })}
                            key={platform}
                          >
                            {platform}
                          </Badge>
                        );
                      })}
                    </section>
                    <section>
                      <Label className="mr-2 inline-block w-[88px]">
                        Time to beat
                      </Label>
                      <Badge className="mr-1">Main: {game.gameplayMain}</Badge>
                      <Badge className="mr-1">
                        Main + Extra: {game.gameplayMainExtra}
                      </Badge>
                      <Badge className="mr-1">
                        100% walkthrough: {game.gameplayCompletionist}
                      </Badge>
                    </section>
                    <Link
                      href={`/add?title=${game.name}&image=${game.imageUrl}&id=${game.id}`}
                    >
                      <Button className="my-4 max-w-[256px]">Add game</Button>
                    </Link>
                  </div>
                  <Image
                    priority
                    alt={`${game.name} poster`}
                    src={
                      game.imageUrl
                        ? game.imageUrl
                        : "https://placehold.jp/1000x1000.png"
                    }
                    className="md:h-68 md:w-68 h-56 w-56 rounded-sm bg-slate-400/60 object-scale-down sm:h-64 sm:w-64"
                    width={256}
                    height={256}
                  />
                </CardContent>
              </Card>
            );
          })}
      </ScrollArea>
    </div>
  );
}