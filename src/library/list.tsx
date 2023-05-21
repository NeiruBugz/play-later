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

const platformFilters = ["", "playstation", "nintendo", "xbox"];

function FiltersList({
  changeFilter,
}: {
  changeFilter: (filter: string) => void;
}) {
  return (
    <div className="sticky z-10">
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
    <div className="flex-col py-4">
      <FiltersList changeFilter={setPlatformFilter} />
      <div className="py-4 overflow-hidden">
        <ScrollArea className="w-full">
          <div className="w-full mt-4 flex flex-wrap justify-start gap-4 min-h-[600px] max-h-[1200px]">
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
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
