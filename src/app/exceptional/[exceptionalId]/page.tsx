import { exceptionalThingConverter } from "@/lib/frontend/firebase/firestoreConverters";
import { FirestoreCollections } from "@/lib/shared/firestore/firestore";
import * as admin from "firebase-admin";
import { getApps } from "firebase-admin/app";
import { ExceptionalThing } from "@/lib/shared/types/ExceptionalThing";
import { ViewExceptionalThing } from "@/lib/frontend/components/ViewExceptionalThing/ViewExceptionalThing";
import { Metadata } from "next";

const getThing = async (id: string): Promise<ExceptionalThing> => {
  if (getApps().length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(
        JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string)
      ),
    });
  }

  const things = await admin
    .firestore()
    .doc(`${FirestoreCollections.exceptionalPlaces}/${id}`)
    .withConverter(exceptionalThingConverter as any)
    .get();

  return things.data() as ExceptionalThing;
};

export const generateMetadata = async ({
  params,
}: {
  params: { exceptionalId: string };
}): Promise<Metadata> => {
  const exceptionalThing = await getThing(params.exceptionalId);

  return {
    title: exceptionalThing.name,
    openGraph: {
      images: [
        "/api/og?thing=" +
          exceptionalThing.name +
          "&whatExceptionalAboutIt=" +
          exceptionalThing.whatExceptionalAboutIt,
      ],
    },
  };
};

export default async function ExceptionalThingPage({
  params,
}: {
  params: { exceptionalId: string };
}) {
  const exceptionalThing = await getThing(params.exceptionalId);

  return <ViewExceptionalThing exceptionalThing={exceptionalThing} />;
}
