"use client";

import { ExceptionalThing } from "@/lib/shared/types/ExceptionalThing";
import Link from "next/link";
import { getCountry } from "../../countries/countries";
import { FirestoreCollections } from "@/lib/shared/firestore/firestore";
import { query, collection, orderBy } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { initFirestore } from "../../firebase/firestore";
import { exceptionalThingConverter } from "../../firebase/firestoreConverters";

interface Props {
  exceptionalThings: ExceptionalThing[];
}

const ExceptionalList: React.FC<Props> = ({ exceptionalThings }) => {
  const [exceptionalThingsSnapshot, isLoading] = useCollectionData(
    query(
      collection(initFirestore(), FirestoreCollections.exceptionalPlaces),
      orderBy("createdAt", "desc")
    ).withConverter(exceptionalThingConverter)
  );

  const data =
    exceptionalThingsSnapshot && !isLoading
      ? exceptionalThingsSnapshot
      : exceptionalThings;

  return (
    <div className="space-y-3">
      {data.map((thing, index) => (
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
  );
};

export { ExceptionalList };
