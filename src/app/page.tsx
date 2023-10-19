"use client";

import { getCountry } from "@/lib/frontend/countries/countries";
import { initFirestore } from "@/lib/frontend/firebase/firestore";
import { exceptionalThingConverter } from "@/lib/frontend/firebase/firestoreConverters";
import { FirestoreCollections } from "@/lib/shared/firestore/firestore";
import { collection, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import { useCollectionData } from "react-firebase-hooks/firestore";

export default function Home() {
  const [exceptionalThings] = useCollectionData(
    query(
      collection(initFirestore(), FirestoreCollections.exceptionalPlaces),
      orderBy("createdAt", "desc")
    ).withConverter(exceptionalThingConverter)
  );

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-extrabold">Latest exceptional things</h1>

      <div>
        <Link
          href="/add"
          className="bg-blue-500 text-white font-bold p-3 rounded-full hover:cursor-pointer hover:bg-blue-400"
        >
          Add yours
        </Link>
      </div>

      <div className="space-y-3">
        {exceptionalThings?.map((thing, index) => (
          <div key={index}>
            <div>
              {thing.user.name} says{" "}
              <Link
                href={`/exceptional/${thing.id}`}
                className="font-bold underline"
              >
                {thing.name}
              </Link>{" "}
              is exceptional in{" "}
              <strong>
                {thing.address.city}, {getCountry(thing.address.country)}
              </strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
