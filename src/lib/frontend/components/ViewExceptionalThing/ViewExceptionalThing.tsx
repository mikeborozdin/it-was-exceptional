"use client";

import { ExceptionalThing } from "@/lib/shared/types/ExceptionalThing";
import Link from "next/link";
import { getCountry } from "../../countries/countries";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import { FirestoreCollections } from "@/lib/shared/firestore/firestore";
import { getAuth } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { initFirestore } from "../../firebase/firestore";
import { exceptionalThingConverter } from "../../firebase/firestoreConverters";

interface Props {
  exceptionalThing: ExceptionalThing;
}

const ViewExceptionalThing: React.FC<Props> = ({ exceptionalThing }) => {
  const [authState] = useAuthState(getAuth());

  const [exceptionalThingSnapshot] = useDocumentData(
    doc(
      initFirestore(),
      `${FirestoreCollections.exceptionalPlaces}/${exceptionalThing.id}`
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

  const data = exceptionalThingSnapshot || exceptionalThing;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">{data.name}</h1>
        <div className="flex flex-row justify-end">
          in {data.address.city}, {getCountry(data.address.country)}
        </div>
        <div className="flex flex-row justify-end">
          <Link
            href={data.googleMapsUrl}
            target="_blank"
            rel="nofollow noopener"
            className="underline"
          >
            Look up on Google Maps
          </Link>
        </div>
      </div>

      <div className="text-xl font-bold">
        <Link href={`/user/${data.user.id}`} className="underline">
          {data.user.name}
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
                  __html: data.whatExceptionalAboutIt.replace(/\n/g, "<br />"),
                }}
              />

              {authState && data.user.id === authState.uid && (
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
                value={whatExceptionalAboutIt || data.whatExceptionalAboutIt}
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

        {data.photos.length === 0 && data.profilePhoto && (
          <div>
            <p>Photo from Google</p>
            <Image
              src={data.profilePhoto}
              alt="photo from google"
              height={700}
              width={700}
            />
          </div>
        )}
      </div>

      {data.photos && data.photos.length > 0 && (
        <div className="flex flex-col space-y-3">
          <p>User&apos;s photos</p>
          {data.photos.map((photo, index) => (
            <div key={index}>
              <Image src={photo} alt="thing photo" height={700} width={700} />
            </div>
          ))}
        </div>
      )}

      <div className="space-y-0">
        <Link
          href={data.googleMapsUrl || ""}
          target="_blank"
          rel="nofollow noopener"
          className="underline"
        >
          {data.address.street}
          <br />
          {data.address.city} {data.address.postalCode}
          <br />
          {getCountry(data.address.country || "")}
        </Link>
      </div>
    </div>
  );
};

export { ViewExceptionalThing };
