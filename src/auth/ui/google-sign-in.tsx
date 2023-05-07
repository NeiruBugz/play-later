"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/auth/lib/store";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";

import { firebaseAuth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";

export default function GoogleSignIn() {
  const [signInWithGoogle] = useSignInWithGoogle(firebaseAuth);
  const { setUser } = useAuthStore();
  const router = useRouter();

  const onLogin = () => {
    signInWithGoogle().then((resultUser) => {
      if (resultUser) {
        const {
          user: { displayName, photoURL, uid },
        } = resultUser;
        if (displayName) {
          setUser({
            uid,
            username: displayName,
            avatarUrl: photoURL ?? "",
            authorized: true,
          });
          router.push("/library");
        }
      }
    });
  };

  return <Button onClick={onLogin}>Sign In with Google</Button>;
}
