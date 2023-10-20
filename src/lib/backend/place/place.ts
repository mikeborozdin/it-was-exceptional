"use server";

import { FirestoreCollections } from "@/lib/shared/firestore/firestore";
import { ExceptionalThing } from "@/lib/shared/types/ExceptionalThing";
import { credential } from "firebase-admin";
import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { put } from "@vercel/blob";
import { PhotoUpload } from "@/lib/shared/types/PhotoUpload";

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
  "googlePlaceId" | "whatExceptionalAboutIt" | "user"
> & {
  photosBase64: PhotoUpload[];
};

const savePlace = async ({
  googlePlaceId,
  user,
  whatExceptionalAboutIt,
  photosBase64,
}: SavePlaceInput) => {
  const place = await getPlace(googlePlaceId);

  const photos = await Promise.all(
    photosBase64.map(async (photoUpload) => {
      const binary = Buffer.from(photoUpload.base64, "base64");

      const res = await put("photos/photo", binary, {
        access: "public",
      });

      return res.url;
    })
  );

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

export { savePlace, type SavePlaceInput };
