"use client";

import { LoadingSpinner } from "@/lib/frontend/components/LoadingSpinner/LoadingSpinner";
import { getCountry } from "@/lib/frontend/countries/countries";
import { initFirestore } from "@/lib/frontend/firebase/firestore";
import { exceptionalThingConverter } from "@/lib/frontend/firebase/firestoreConverters";
import { FirestoreCollections } from "@/lib/shared/firestore/firestore";
import { collection, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import { useCollectionData } from "react-firebase-hooks/firestore";

export default function Home() {
  const [exceptionalThings, isLoading] = useCollectionData(
    query(
      collection(initFirestore(), FirestoreCollections.exceptionalPlaces),
      orderBy("createdAt", "desc")
    ).withConverter(exceptionalThingConverter)
  );

  return (
    <div className="space-y-10">
      {/* <p>
        How often people ask you what&apos; your favourite restaurant - and you
        struggle to answer?<br></br>
        Personally, I struggle. But... what I don't struggle with - is
        rememberbing all the exceptional places I've been to. So here's the
        website for all of us - lovers of exceptional things.
      </p> */}

      <h1 className="text-3xl font-extrabold">Latest exceptional things</h1>

      <div className="flex flex-row justify-center">
        <Link
          href="/add"
          className="bg-blue-500 text-white font-bold py-3 px-10 rounded-full hover:cursor-pointer hover:bg-blue-400"
        >
          Add yours
        </Link>
      </div>

      {isLoading && <LoadingSpinner />}

      <div className="space-y-3">
        {exceptionalThings?.map((thing, index) => (
          <div key={index}>
            <div>
              <Link
                href={`/user/${thing.user.id}`}
                className="font-bold underline"
              >
                {thing.user.name}
              </Link>{" "}
              says{" "}
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
