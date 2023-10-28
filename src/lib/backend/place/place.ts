"use server";

import { exceptionalThingConverter } from "@/lib/frontend/firebase/firestoreConverters";
import { FirestoreCollections } from "@/lib/shared/firestore/firestore";
import { ExceptionalThing } from "@/lib/shared/types/ExceptionalThing";
import { credential } from "firebase-admin";
import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const initFirebaseAdmin = () => {
  if (getApps().length === 0) {
    initializeApp({
      credential: credential.cert(
        JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string)
      ),
    });
  }
};

interface Place {
  googlePlaceId: string;
  name: string;
  website: string;
  address: {
    city: string;
    street: string;
    postalCode: string;
    country: string;
  };
  profilePhoto: string | null;
  googleMapsUrl: string;
}

type ZembraPlace = {
  name: string;
  website: string;
  address: {
    city: string;
    street: string;
    postalCode: string;
    country: string;
  };
  profileImage: string | null;
  url: string;
};

interface ZembraResult {
  data: ZembraPlace;
}

const getPlace = async (googlePlaceId: string): Promise<Place> => {
  initFirebaseAdmin();

  try {
    const res = await fetch(
      `https://api.zembra.io/business/google/?slug=${googlePlaceId}&fields[]=address&fields[]=name&fields[]=website&fields[]=profileImage&fields[]=url`,
      {
        headers: {
          Authorization: `Bearer ${process.env.ZEMBRA_API_KEY}`,
          accept: "application/json",
        },
      }
    );

    const json = (await res.json()) as ZembraResult;

    console.log(json);

    return {
      googlePlaceId,
      name: json.data.name,
      website: json.data.website,
      address: {
        street: json.data.address.street,
        city: json.data.address.city,
        postalCode: json.data.address.postalCode,
        country: json.data.address.country,
      },
      googleMapsUrl: json.data.url,
      profilePhoto: json.data.profileImage,
    };
  } catch (e) {
    console.error(e);

    throw e;
  }
};

type SavePlaceInput = Pick<
  ExceptionalThing,
  "googlePlaceId" | "whatExceptionalAboutIt" | "user" | "photos"
>;

const savePlace = async ({
  googlePlaceId,
  user,
  whatExceptionalAboutIt,
  photos,
}: SavePlaceInput) => {
  const place = await getPlace(googlePlaceId);

  const res = await getFirestore()
    .collection(FirestoreCollections.exceptionalPlaces)
    .add({
      ...place,
      user,
      whatExceptionalAboutIt,
      createdAt: new Date(),
      photos,
    });

  return res.id;
};

const getThings = async () => {
  initFirebaseAdmin();

  const things = await getFirestore()
    .collection(FirestoreCollections.exceptionalPlaces)
    .orderBy("createdAt", "desc")
    .withConverter(exceptionalThingConverter as any)
    .get();

  return things.docs.map((doc) => doc.data() as ExceptionalThing);
};

const getThing = async (id: string): Promise<ExceptionalThing> => {
  initFirebaseAdmin();

  const things = await getFirestore()
    .doc(`${FirestoreCollections.exceptionalPlaces}/${id}`)
    .withConverter(exceptionalThingConverter as any)
    .get();

  return things.data() as ExceptionalThing;
};

export { savePlace, type SavePlaceInput, getThing, getThings };
