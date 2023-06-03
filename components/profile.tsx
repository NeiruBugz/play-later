"use client";

import { useAuthStore } from "@/src/auth/lib/store";

import { Avatar, AvatarImage } from "./ui/avatar";
import { Label } from "./ui/label";

export default function Profile() {
  const { username, avatarUrl, authorized } = useAuthStore();

  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarImage src={avatarUrl} />
      </Avatar>
      <Label className="hidden font-semibold sm:block">{username}</Label>
    </div>
  );
}
