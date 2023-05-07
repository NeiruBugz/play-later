"use client";

import React from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/src/auth/lib/store";
import { collection, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

import { firebaseDB } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

const platformFilters = ["", "playstation", "nintendo", "xbox"];

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

  return (
    <div className="py-4">
      <>
        <Label>Platform Filters</Label>
        <div className="w-full">
          <Badge
            className="mr-2 cursor-pointer"
            onClick={() => setPlatformFilter("")}
          >
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
                  onClick={() => setPlatformFilter(platform)}
                >
                  {platform}
                </Badge>
              )
          )}
        </div>
      </>
      <div className="mt-4 flex flex-wrap gap-x-2 gap-y-4">
        {filteredGames.map(({ title, platform, img, id }) => {
          return (
            <div
              className="md:h-68 md:w-68 card image-full relative h-56 w-56 cursor-pointer rounded-sm sm:h-64 sm:w-64"
              key={id}
            >
              <figure>
                <Image
                  priority
                  alt={`${title} poster`}
                  src={img ? img : "https://placehold.jp/1000x1000.png"}
                  className="md:h-68 md:w-68 h-56 w-56 rounded-sm object-cover sm:h-64 sm:w-64"
                  width={256}
                  height={256}
                />
              </figure>
              <div className="card-body h-/14 max-h-1/3 absolute  bottom-0 left-0 w-full ">
                <div className="rounded-b-sm bg-gradient-to-r from-[#2d2d2d] to-transparent p-2 md:py-4 md:pl-4">
                  <h2 className="mb-2 truncate text-[1.2em] font-bold text-white">
                    {title}
                  </h2>
                  <Badge
                    className={cn("capitalize text-white", {
                      "bg-nintendo": platform.toLowerCase() === "nintendo",
                      "bg-playstation":
                        platform.toLowerCase() === "playstation",
                      "bg-xbox": platform.toLowerCase() === "xbox",
                      "bg-pc uppercase": platform.toLowerCase() === "pc",
                    })}
                  >
                    {platform}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
