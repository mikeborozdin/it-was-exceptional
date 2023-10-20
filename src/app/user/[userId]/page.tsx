"use client";

import { getCountry } from "@/lib/frontend/countries/countries";
import { initFirestore } from "@/lib/frontend/firebase/firestore";
import { exceptionalThingConverter } from "@/lib/frontend/firebase/firestoreConverters";
import { FirestoreCollections } from "@/lib/shared/firestore/firestore";
import { query, collection, where } from "firebase/firestore";
import Link from "next/link";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { ClipLoader } from "react-spinners";

export default function UserPage({
  params: { userId },
}: {
  params: { userId: string };
}) {
  const [exceptionalThings, isLoading] = useCollectionData(
    query(
      collection(initFirestore(), FirestoreCollections.exceptionalPlaces),
      where("user.id", "==", userId)
    ).withConverter(exceptionalThingConverter)
  );

  return (
    <>
      {isLoading && (
        <div className="flex flex-row justify-center">
          <ClipLoader color="#3b82f6" size={100} />
        </div>
      )}

      {!isLoading && exceptionalThings && exceptionalThings.length > 0 && (
        <div className="space-y-10">
          <h1 className="text-3xl font-extrabold">
            Exceptional things by {exceptionalThings[0].user.name}
          </h1>

          <div className="space-y-6">
            {exceptionalThings.map((thing) => (
              <div key={thing.id}>
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
            ))}
          </div>
        </div>
      )}
    </>
  );
}
