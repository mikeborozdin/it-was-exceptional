"use client";

import { getAuth } from "firebase/auth";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { initFirebase } from "@/lib/frontend/firebase/firebase";

initFirebase();

const TopNavigation: React.FC = () => {
  const [authState, loading] = useAuthState(getAuth());

  return (
    <div className="w-full flex flex-row justify-between">
      <Link className="text-white font-extrabold" href="/">
        💎 It is exceptional
      </Link>
      {authState && !loading && <strong>Hello, {authState.displayName}</strong>}
    </div>
  );
};

export { TopNavigation };
