import { LoadingSpinner } from "@/lib/frontend/components/LoadingSpinner/LoadingSpinner";
import { FirestoreCollections } from "@/lib/shared/firestore/firestore";
import Link from "next/link";
import * as admin from "firebase-admin";
import { getApps } from "firebase-admin/app";
import { exceptionalThingConverter } from "@/lib/frontend/firebase/firestoreConverters";
import { ExceptionalList } from "@/lib/frontend/components/ExceptionalList/ExceptionalList";
import { ExceptionalThing } from "@/lib/shared/types/ExceptionalThing";

const getThings = async (): Promise<ExceptionalThing[]> => {
  if (getApps().length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(
        JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string)
      ),
    });
  }

  const things = await admin
    .firestore()
    .collection(FirestoreCollections.exceptionalPlaces)
    .orderBy("createdAt", "desc")
    .withConverter(exceptionalThingConverter as any)
    .get();

  return things.docs.map((doc) => doc.data()) as ExceptionalThing[];
};

export default async function Home() {
  const exceptionalThings = await getThings();
  const isLoading = false;

  return (
    <div className="space-y-10">
      {/* <p>
        How often people ask you what&apos; your favourite restaurant - and you
        struggle to answer?<br></br>
        Personally, I struggle. But... what I don't struggle with - is
        rememberbing all the exceptional places I've been to. So here's the
        website for all of us - lovers of exceptional things.
      </p> */}

      <h1 className="text-3xl font-extrabold">Latest exceptional things</h1>

      <div className="flex flex-row justify-center">
        <Link
          href="/add"
          className="bg-blue-500 text-white font-bold py-3 px-10 rounded-full hover:cursor-pointer hover:bg-blue-400"
        >
          Add yours
        </Link>
      </div>

      {isLoading && <LoadingSpinner />}

      <ExceptionalList exceptionalThings={exceptionalThings} />
    </div>
  );
}
