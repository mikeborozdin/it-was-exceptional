"use client";

import { getCountry } from "@/lib/frontend/countries/countries";
import { initFirestore } from "@/lib/frontend/firebase/firestore";
import { exceptionalThingConverter } from "@/lib/frontend/firebase/firestoreConverters";
import { FirestoreCollections } from "@/lib/shared/firestore/firestore";
import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";

export default function ExceptionalThing({
  params,
}: {
  params: { exceptionalId: string };
}) {
  const [exceptionalThing, isLoading] = useDocumentData(
    doc(
      initFirestore(),
      `${FirestoreCollections.exceptionalPlaces}/${params.exceptionalId}`
    ).withConverter(exceptionalThingConverter)
  );

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-extrabold">{exceptionalThing?.name}</h1>

      <div>Mike says</div>

      <div className="text-2xl italic">
        &quot;{exceptionalThing?.whatExceptionalAboutIt}&quot;
      </div>

      <div className="space-y-0">
        <div>{exceptionalThing?.address.street}</div>
        <div>{exceptionalThing?.address.city}</div>
        <div>{exceptionalThing?.address.postalCode}</div>
        <div>{getCountry(exceptionalThing?.address.country || "")}</div>
      </div>
    </div>
  );
}
