"use client";

import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { redirect } from "next/navigation";
import { exceptionalThingConverter } from "@/lib/frontend/firebase/firestoreConverters";
import { FirestoreCollections } from "@/lib/shared/firestore/firestore";
import { collection, deleteDoc, doc, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { initFirestore } from "@/lib/frontend/firebase/firestore";
import { useEffect } from "react";
import { getCountry } from "@/lib/frontend/countries/countries";
import Link from "next/link";

const getOwnExceptionalThings = (userId?: string) => {
  if (userId) {
    return query(
      collection(initFirestore(), FirestoreCollections.exceptionalPlaces),
      where("user.id", "==", userId)
    ).withConverter(exceptionalThingConverter);
  } else {
    return null;
  }
};

export default function AccountPage() {
  const [authState, loading] = useAuthState(getAuth());

  const [exceptionalThings] = useCollectionData(
    getOwnExceptionalThings(authState?.uid)
  );

  useEffect(() => {
    if (!authState && !loading) {
      redirect("/signup");
    }
  }, [authState, loading]);

  const onLogoutClick = () => {
    getAuth().signOut();
  };

  const deleteThing = (id: string) => {
    deleteDoc(
      doc(initFirestore(), `${FirestoreCollections.exceptionalPlaces}/${id}`)
    );
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

      {exceptionalThings && exceptionalThings.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">
            Your exceptional things
          </h2>

          <div className="space-y-3">
            {exceptionalThings?.map((thing) => (
              <div key={thing.id} className="flex flex-row justify-between">
                <div>
                  <Link
                    href={`/exceptional/${thing.id}`}
                    className="font-bold underline"
                  >
                    {thing.name}
                  </Link>{" "}
                  in{" "}
                  <strong>
                    {thing.address.city}, {getCountry(thing.address.country)}
                  </strong>
                </div>
                <button
                  className="text-red-500 hover:cursor-pointer hover:underline"
                  onClick={() => deleteThing(thing.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
