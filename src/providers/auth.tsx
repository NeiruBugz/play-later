"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";

import { firebaseAuth } from "@/lib/firebase";

import { useAuthStore } from "../auth/lib/store";

export default function AuthProvider({ children }: React.PropsWithChildren) {
  const [user, loading] = useAuthState(firebaseAuth);
  const { setUser } = useAuthStore();
  const router = useRouter();
  React.useEffect(() => {
    if (user) {
      router.prefetch("/library");
      const { displayName, uid, photoURL } = user;
      if (displayName && uid) {
        setUser({
          username: displayName,
          uid,
          avatarUrl: photoURL ?? "",
          authorized: true,
        });
        router.push("/library");
      }
    }
  }, [user, setUser, router]);
  return <>{children}</>;
}
