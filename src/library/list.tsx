"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/src/auth/lib/store";
import { Card } from "@/src/library/components/card";
import { collection, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

import { firebaseDB, firestoreOperations } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

import { statusToReadable } from "./utils";

const platformFilters = ["", "playstation", "nintendo", "xbox"];

function FiltersList({
  changeFilter,
}: {
  changeFilter: (filter: string) => void;
}) {
  return (
    <div className="sticky z-10 my-2">
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
    </div>
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
    await firestoreOperations.changeStatus(status, id);
  };

  return (
    <div className="flex grow flex-col py-4">
      <h3 className="font-bold capitalize">
        Status: {statusToReadable(params.get("status") ?? "")}
      </h3>
      <FiltersList changeFilter={setPlatformFilter} />
      <div className="mb-12 overflow-hidden py-4 ">
        <ScrollArea className="h-full w-full">
          <div className="mt-4 flex w-full flex-wrap justify-start gap-4">
            {filteredGames.map(({ title, platform, img, id, ...rest }) => {
              return (
                <Card
                  key={id}
                  id={id}
                  title={title}
                  img={img}
                  platform={platform}
                  review={rest.review}
                  updateStatus={updateStatus}
                />
              );
            })}
            {loading && (
              <>
                <Skeleton className="h-48 w-48" />
                <Skeleton className="h-48 w-48" />
                <Skeleton className="h-48 w-48" />
                <Skeleton className="h-48 w-48" />
                <Skeleton className="h-48 w-48" />
                <Skeleton className="h-48 w-48" />
                <Skeleton className="h-48 w-48" />
                <Skeleton className="h-48 w-48" />
                <Skeleton className="h-48 w-48" />
                <Skeleton className="h-48 w-48" />
                <Skeleton className="h-48 w-48" />
                <Skeleton className="h-48 w-48" />
                <Skeleton className="h-48 w-48" />
                <Skeleton className="h-48 w-48" />
                <Skeleton className="h-48 w-48" />
                <Skeleton className="h-48 w-48" />
                <Skeleton className="h-48 w-48" />
                <Skeleton className="h-48 w-48" />
                <Skeleton className="h-48 w-48" />
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
