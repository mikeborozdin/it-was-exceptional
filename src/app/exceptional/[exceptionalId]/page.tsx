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
import { LoadingSpinner } from "@/lib/frontend/components/LoadingSpinner/LoadingSpinner";

export default function ExceptionalThingPage({
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

  const onCancelClick = () => {
    setMode("view");
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
    <>
      {isLoading && <LoadingSpinner />}

      {exceptionalThing && (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold">{exceptionalThing.name}</h1>
            <div className="flex flex-row justify-end">
              in {exceptionalThing.address.city},{" "}
              {getCountry(exceptionalThing.address.country)}
            </div>
            <div className="flex flex-row justify-end">
              <Link
                href={exceptionalThing.googleMapsUrl}
                target="_blank"
                rel="nofollow noopener"
                className="underline"
              >
                Look up on Google Maps
              </Link>
            </div>
          </div>

          <div className="text-xl font-bold">
            <Link
              href={`/user/${exceptionalThing.user.id}`}
              className="underline"
            >
              {exceptionalThing.user.name}
            </Link>{" "}
            says
          </div>

          <div className="flex flex-col md:flex-row md:justify-between space-x-0 md:space-x-3">
            <div>
              {mode === "view" && (
                <>
                  <div
                    className="text-2xl italic"
                    dangerouslySetInnerHTML={{
                      __html: exceptionalThing.whatExceptionalAboutIt.replace(
                        /\n/g,
                        "<br />"
                      ),
                    }}
                  />

                  {authState && exceptionalThing.user.id === authState.uid && (
                    <div className="flex flex-row justify-end">
                      <button
                        className="underline hover:cursor-pointer"
                        onClick={onEditClick}
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {mode === "edit" && (
              <div>
                <div>
                  <textarea
                    value={
                      whatExceptionalAboutIt ||
                      exceptionalThing.whatExceptionalAboutIt
                    }
                    onChange={(e) => setWhatExceptionalAboutIt(e.target.value)}
                    className="w-full h-32 p-3 text-black text-2xl rounded-lg h-60"
                    placeholder="I had such a lovely time there..."
                  />
                </div>
                <div className="flex flex-row justify-end space-x-3">
                  <button
                    className="text-blue-500 p-3 border border-blue-500 font-bold rounded-full hover:cursor-pointer"
                    onClick={onCancelClick}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-500 p-3 text-white font-bold rounded-full hover:cursor-pointer"
                    onClick={onSaveClick}
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            {exceptionalThing.photos.length === 0 &&
              exceptionalThing.profilePhoto && (
                <div>
                  <p>Photo from Google</p>
                  <Image
                    src={exceptionalThing?.profilePhoto}
                    alt="photo from google"
                    height={700}
                    width={700}
                  />
                </div>
              )}
          </div>

          {exceptionalThing.photos && exceptionalThing.photos.length > 0 && (
            <div className="flex flex-col space-y-3">
              <p>User&apos;s photos</p>
              {exceptionalThing.photos.map((photo, index) => (
                <div key={index}>
                  <Image
                    src={photo}
                    alt="thing photo"
                    height={700}
                    width={700}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="space-y-0">
            <Link
              href={exceptionalThing?.googleMapsUrl || ""}
              target="_blank"
              rel="nofollow noopener"
              className="underline"
            >
              {exceptionalThing?.address.street}
              <br />
              {exceptionalThing?.address.city}{" "}
              {exceptionalThing?.address.postalCode}
              <br />
              {getCountry(exceptionalThing?.address.country || "")}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
