"use client";

import { initFirebase } from "@/lib/frontend/firebase/firebase";
import { getAuth } from "firebase/auth";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { initFirestore } from "@/lib/frontend/firebase/firestore";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FirestoreCollections } from "@/lib/shared/firestore/firestore";

initFirebase();

const createUserIfNeeded = async (userId: string, name: string) => {
  const firestore = initFirestore();

  const userRef = await getDoc(
    doc(firestore, FirestoreCollections.users, userId)
  );

  if (!userRef.exists()) {
    await setDoc(doc(firestore, FirestoreCollections.users, userId), { name });
  }
};

export default function SignUpPage() {
  const [signInWithGoogle] = useSignInWithGoogle(getAuth());

  const onSignUpWithGoogleClick = async () => {
    try {
      const res = await signInWithGoogle();
      if (res && res.user) {
        await createUserIfNeeded(
          res.user.uid,
          res.user.displayName || res.user.email || ""
        );

        window.location.replace("/account");
      }
    } catch (e) {
      console.error(e);
    }
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
