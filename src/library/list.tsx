"use client";

import React from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/src/auth/lib/store";
import { collection, query, where } from "firebase/firestore";
import { MoreVertical } from "lucide-react";
import { useCollection } from "react-firebase-hooks/firestore";

import { changeGameStatus, firebaseDB } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const platformFilters = ["", "playstation", "nintendo", "xbox"];

interface CardProps {
  id: string;
  title: string;
  platform: string;
  updateStatus: (status: string, id: string) => Promise<void>;
  img?: string;
}

function Card({ id, title, img, platform, updateStatus }: CardProps) {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div className="image-full relative h-48 w-48 rounded-sm shadow-sm cursor-pointer">
            <DropdownMenu>
              <DropdownMenuTrigger className="absolute stroke-white top-2 right-1 w-fit border-transparent p-0">
                <MoreVertical className="stroke-slate-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => updateStatus("backlog", id)}>
                  To Backlog
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => updateStatus("in-progress", id)}
                >
                  Start
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => updateStatus("completed", id)}
                >
                  Complete
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => updateStatus("abandoned", id)}
                >
                  Abandon
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <figure>
              <Image
                priority
                alt={`${title} poster`}
                src={img ? img : "https://placehold.jp/1000x1000.png"}
                className="h-48 w-48 rounded-sm object-cover"
                width={256}
                height={256}
              />
            </figure>
            <div className="max-h-1/3 absolute  bottom-0 left-0 w-full ">
              <div className="rounded-b-sm bg-gradient-to-r from-[#2d2d2d] to-transparent p-2 md:py-4 md:pl-4">
                <h2 className="mb-2 truncate text-[1.2em] font-bold text-white">
                  {title}
                </h2>
                <Badge
                  variant="platform"
                  className={cn("capitalize text-white", {
                    "bg-nintendo": platform.toLowerCase() === "nintendo",
                    "bg-playstation": platform.toLowerCase() === "playstation",
                    "bg-xbox": platform.toLowerCase() === "xbox",
                    "bg-pc uppercase": platform.toLowerCase() === "pc",
                  })}
                >
                  {platform}
                </Badge>
              </div>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div>Content</div>
          <DialogFooter>
            <Button variant="destructive">Delete game</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function FiltersList({
  changeFilter,
}: {
  changeFilter: (filter: string) => void;
}) {
  return (
    <>
      <Label>Platform Filters</Label>
      <div className="w-full">
        <Badge className="mr-2 cursor-pointer" onClick={() => changeFilter("")}>
          All
        </Badge>
        {platformFilters.map(
          (platform) =>
            Boolean(platform) && (
              <Badge
                key={platform}
                className={cn("mr-2 cursor-pointer capitalize text-white", {
                  "bg-nintendo": platform.toLowerCase() === "nintendo",
                  "bg-playstation": platform.toLowerCase() === "playstation",
                  "bg-xbox": platform.toLowerCase() === "xbox",
                  "bg-pc uppercase": platform.toLowerCase() === "pc",
                })}
                onClick={() => changeFilter(platform)}
              >
                {platform}
              </Badge>
            )
        )}
      </div>
    </>
  );
}

export default function List() {
  const { uid } = useAuthStore();
  const params = useSearchParams();
  const [value, loading] = useCollection(
    query(collection(firebaseDB, "games"), where("user", "==", uid)),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const [list, setList] = React.useState<any[]>([]);
  const [platformFilter, setPlatformFilter] = React.useState("");

  React.useEffect(() => {
    if (!loading) {
      const g = value?.docs.map((doc) => {
        const data = doc.data();
        if (data) {
          return {
            ...data,
            id: doc.id,
          };
        }
      });

      setList(g as any[]);
    }
  }, [value, loading]);

  const filteredGames = React.useMemo(() => {
    let result: any[] = [];
    const status = params.get("status") ?? "";

    if (status === "") {
      result = [...list];
    } else {
      result = list.filter((game) => game.status === status);
    }

    if (platformFilter === "") {
      result = [...result];
    } else {
      result = result.filter((game) => game.platform === platformFilter);
    }
    return result;
  }, [list, platformFilter, params]);

  const updateStatus = async (status: string, id: string) => {
    await changeGameStatus(status, id);
  };

  return (
    <div className="py-4">
      <FiltersList changeFilter={setPlatformFilter} />
      <div className="mt-4 flex flex-wrap justify-start gap-4">
        {filteredGames.map(({ title, platform, img, id, ...rest }) => {
          console.log(rest);
          return (
            <Card
              key={id}
              id={id}
              title={title}
              img={img}
              platform={platform}
              updateStatus={updateStatus}
            />
          );
        })}
      </div>
    </div>
  );
}
