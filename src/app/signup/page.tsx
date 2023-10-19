"use client";

import { initFirebase } from "@/lib/frontend/firebase/firebase";
import { getAuth } from "firebase/auth";
import { useState } from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";

initFirebase();

export default function SignUpPage() {
  const [placeId, setPlaceId] = useState<string | null>(null);
  const [exceptionalThings, setExceptionalThings] = useState<string>("");

  const [signInWithGoogle] = useSignInWithGoogle(getAuth());

  const onSignUpWithGoogleClick = () => {
    signInWithGoogle();
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl text-white font-extrabold">Sign up</h1>
      <button
        className="w-full bg-blue-500 p-3 rounded-full text-white font-bold hover:bg-blue-400 hover:cursor-pointer disabled:opacity-25"
        onClick={onSignUpWithGoogleClick}
      >
        Sign up with Google
      </button>
    </div>
  );
}
