"use server";

import { FirestoreCollections } from "@/lib/shared/firestore/firestore";
import { ExceptionalThing } from "@/lib/shared/types/ExceptionalThing";
import { credential } from "firebase-admin";
import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

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

if (getApps().length === 0) {
  initializeApp({
    credential: credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string)
    ),
  });
}

const getPlace = async (googlePlaceId: string): Promise<Place> => {
  const res = await fetch(
    `https://api.zembra.io/business/google/?slug=${googlePlaceId}&fields[]=address&fields[]=name&fields[]=website&fields[]=profileImage&fields[]=url`,
    {
      headers: {
        Authorization:
          "Bearer 2oAdRl1Q5bd5s4VAKIChLes0KjVRfYUurKEWddM6IMyeJ8o12tzuYh7KELmjyrhZZEAiGLK9c8W041on12zWEbleg1k9QCWUirclMd1lchni5MLyfEfei4PYK39ea5KW",
        accept: "application/json",
      },
    }
  );

  const json = (await res.json()) as ZembraResult;

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
};

type SavePlaceInput = Pick<
  ExceptionalThing,
  "googlePlaceId" | "whatExceptionalAboutIt" | "user"
>;

const savePlace = async ({
  googlePlaceId,
  user,
  whatExceptionalAboutIt,
}: SavePlaceInput) => {
  const place = await getPlace(googlePlaceId);

  await getFirestore()
    .collection(FirestoreCollections.exceptionalPlaces)
    .add({
      ...place,
      user,
      whatExceptionalAboutIt,
      createdAt: new Date(),
    });
};

export { savePlace, type SavePlaceInput };
