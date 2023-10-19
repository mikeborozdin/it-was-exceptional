"use client";

import { getCountry } from "@/lib/frontend/countries/countries";
import { initFirestore } from "@/lib/frontend/firebase/firestore";
import { exceptionalThingConverter } from "@/lib/frontend/firebase/firestoreConverters";
import { FirestoreCollections } from "@/lib/shared/firestore/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { useState } from "react";
import Link from "next/link";

export default function ExceptionalThing({
  params,
}: {
  params: { exceptionalId: string };
}) {
  const [authState] = useAuthState(getAuth());

  const [exceptionalThing, isLoading] = useDocumentData(
    doc(
      initFirestore(),
      `${FirestoreCollections.exceptionalPlaces}/${params.exceptionalId}`
    ).withConverter(exceptionalThingConverter)
  );

  const [mode, setMode] = useState<"view" | "edit">("view");
  const [whatExceptionalAboutIt, setWhatExceptionalAboutIt] = useState<
    string | null
  >(null);

  const onEditClick = () => {
    setMode("edit");
  };

  const onSaveClick = async () => {
    if (exceptionalThing) {
      await updateDoc(
        doc(
          initFirestore(),
          `${FirestoreCollections.exceptionalPlaces}/${exceptionalThing.id}`
        ),
        {
          whatExceptionalAboutIt,
        }
      );
    }
    setMode("view");
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold">{exceptionalThing?.name}</h1>
        <div className="flex flex-row justify-end">
          in {exceptionalThing?.address.city}{" "}
          {getCountry(exceptionalThing?.address.country || "")}
        </div>
        <div className="flex flex-row justify-end">
          <Link
            href={exceptionalThing?.googleMapsUrl || ""}
            target="_blank"
            rel="nofollow noopener"
            className="underline"
          >
            This place on Google
          </Link>
        </div>
      </div>

      <div>{exceptionalThing?.user.name} says</div>

      <div className="flex flex-col md:flex-row md:justify-between space-x-0 md:space-x-3">
        <div>
          <div
            className="text-2xl italic"
            dangerouslySetInnerHTML={{
              __html:
                exceptionalThing?.whatExceptionalAboutIt.replace(
                  /\n/g,
                  "<br />"
                ) || "",
            }}
          />

          {authState &&
            mode === "view" &&
            exceptionalThing?.user.id === authState.uid && (
              <div className="flex flex-row justify-end">
                <button
                  className="underline hover:cursor-pointer"
                  onClick={onEditClick}
                >
                  Edit
                </button>
              </div>
            )}
        </div>

        {mode === "edit" && (
          <div>
            <div>
              <textarea
                value={
                  whatExceptionalAboutIt ||
                  exceptionalThing?.whatExceptionalAboutIt
                }
                onChange={(e) => setWhatExceptionalAboutIt(e.target.value)}
                className="w-full h-32 p-3 text-black text-2xl rounded-lg"
                placeholder="I had such a lovely time there..."
              />
            </div>
            <div className="flex flex-row justify-end">
              <button
                className="bg-blue-500 p-3 text-white font-bold  hover:cursor-pointer"
                onClick={onSaveClick}
              >
                Save
              </button>
            </div>
          </div>
        )}

        {exceptionalThing?.profilePhoto && (
          <Image
            src={exceptionalThing?.profilePhoto}
            alt="thing photo"
            className="w-full h-auto max-h-96"
            width={400}
            height={400}
          />
        )}
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
