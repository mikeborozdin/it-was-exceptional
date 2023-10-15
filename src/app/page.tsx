"use client";

import { initFirestore } from "@/lib/frontend/firebase/firestore";
import { FirestoreCollections } from "@/lib/shared/firestore/firestore";
import { collection } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

export default function Home() {
  const [exceptionalThings] = useCollectionData(
    collection(initFirestore(), FirestoreCollections.exceptionalPlaces)
  );

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Latest exceptional things</h1>

      {exceptionalThings?.map((thing, index) => (
        <div key={index}>
          <div>{thing.exceptionalThings}</div>
        </div>
      ))}
    </div>
  );
}
