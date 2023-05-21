import Image from "next/image";
import { MoreVertical } from "lucide-react";

import { firestoreOperations } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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

import { CardDialog } from "./dialog-content";

interface CardProps {
  id: string;
  title: string;
  platform: string;
  updateStatus: (status: string, id: string) => Promise<void>;
  review?: string;
  img?: string;
}

export function Card({
  id,
  title,
  img,
  platform,
  updateStatus,
  review,
}: CardProps) {
  const onDelete = async () => {
    await firestoreOperations.delete(id);
  };
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
                className="h-48 w-48 rounded-sm bg-slate-400/60 object-scale-down"
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
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <CardDialog firebaseId={id} title={title} review={review ?? ""} />
          <DialogFooter>
            <Button variant="destructive" onClick={onDelete}>
              Delete game
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
