"use server";

import { FirestoreCollections } from "@/lib/shared/firestore/firestore";
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
}

type ZembraPlace = Place;

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

const getPlace = async (id: string): Promise<Place> => {
  const res = await fetch(
    `https://api.zembra.io/business/google/?slug=${id}&fields[]=address&fields[]=name&fields[]=phone&fields[]=photos&fields[]=website`,
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
    googlePlaceId: id,
    name: json.data.name,
    website: json.data.website,
    address: {
      street: json.data.address.street,
      city: json.data.address.city,
      postalCode: json.data.address.postalCode,
      country: json.data.address.country,
    },
  };
};

interface SavePlaceInput {
  id: string;
  exceptionalThings: string;
}

const savePlace = async ({ id, exceptionalThings }: SavePlaceInput) => {
  const place = await getPlace(id);

  const d = await getFirestore()
    .collection(FirestoreCollections.exceptionalPlaces)
    .add({
      ...place,
      exceptionalThings,
    });

  return { placeId: id, exceptionalThings };
};

export { savePlace, type SavePlaceInput };
