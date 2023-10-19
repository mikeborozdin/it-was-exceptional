"use client";

import { getAuth } from "firebase/auth";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { redirect } from "next/navigation";

export default function AccountPage() {
  const [authState, loading] = useAuthState(getAuth());

  useEffect(() => {
    if (!authState && !loading) {
      redirect("/signup");
    }
  }, [authState, loading]);

  const onLogoutClick = () => {
    getAuth().signOut();
  };

  return (
    <div className="space-y-3">
      <h1 className="text-3xl text-white font-extrabold">Your account</h1>

      <button
        onClick={onLogoutClick}
        className="font-bold border border-blue-500 p-3 rounded-full text-blue-500 hover:pointer-cursor"
      >
        Logout
      </button>
    </div>
  );
}
