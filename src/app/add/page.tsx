"use client";

import { SavePlaceInput, savePlace } from "@/lib/backend/place/place";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { useAuthState } from "react-firebase-hooks/auth";
import { initFirebase } from "@/lib/frontend/firebase/firebase";
import { redirect } from "next/navigation";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import Link from "next/link";
import { LoadingMessages } from "@/lib/frontend/components/LoadingMessages/LoadingMessages";
import { LoadingSpinner } from "@/lib/frontend/components/LoadingSpinner/LoadingSpinner";

const useServerActionMutate = (
  action: (input: SavePlaceInput) => Promise<any>
) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<any>(null);

  const mutate = async (input: SavePlaceInput) => {
    try {
      setIsMutating(true);

      const newResult = await action(input);

      setResult(newResult);
      setIsSuccess(true);
    } catch (e) {
      setError(e);
    } finally {
      setIsMutating(false);
    }
  };

  return { error, isMutating, isSuccess, mutate, result };
};

initFirebase();

export default function AddPage() {
  const [placeId, setPlaceId] = useState<string | null>(null);
  const [whatExceptionalAboutIt, setWhatExceptionalAboutIt] =
    useState<string>("");

  const { mutate, isMutating, isSuccess, result } =
    useServerActionMutate(savePlace);

  const [authState, loading] = useAuthState(getAuth());

  const { width, height } = useWindowSize();

  useEffect(() => {
    if (!authState && !loading) {
      redirect("/signup");
    }
  }, [authState, loading]);

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center space-y-10">
        <Confetti width={width} height={height} />
        <h1 className="text-3xl text-white font-extrabold">Thank you!</h1>

        <Link
          href={`/exceptional/${result}`}
          className="text-2xl font-bold underline"
        >
          See what you&apos;ve added
        </Link>
      </div>
    );
  } else if (isMutating) {
    return (
      <div className="flex flex-col items-center space-y-10">
        <h1 className="text-3xl text-white font-extrabold">Adding...</h1>

        <LoadingMessages
          messages={[
            "Getting the place from the Internet...",
            "Saving it all...",
          ]}
          delay={1500}
          className="flex flex-row justify-center text-2xl text-white font-bold"
        />

        <LoadingSpinner />
      </div>
    );
  } else {
    return (
      <div className="space-y-3">
        <div>
          <h1 className="text-3xl text-white font-extrabold">
            Tell us what you&apos;ve found exceptional
          </h1>
        </div>

        <div className="w-full space-y-3">
          <label className="font-bold text-white">Place</label>
          <GooglePlacesAutocomplete
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
            selectProps={{
              className: "w-full text-black",
              onChange: (value) => {
                if (value) {
                  console.log({ value });
                  setPlaceId(value.value.place_id);
                }
              },
            }}
          />
        </div>

        <div className="w-full space-y-3">
          <label className="font-bold text-white">
            What&apos; exceptional about it?
          </label>
          <textarea
            value={whatExceptionalAboutIt}
            onChange={(e) => setWhatExceptionalAboutIt(e.target.value)}
            className="w-full h-60 p-3 text-black text-2xl rounded-lg"
            placeholder="I had such a lovely time there..."
          />
        </div>

        <div className="w-full">
          <input
            type="submit"
            value="Add"
            className="w-full bg-blue-500 p-3 rounded-full text-white font-bold hover:bg-blue-400 hover:cursor-pointer disabled:opacity-25"
            disabled={
              !placeId ||
              !whatExceptionalAboutIt ||
              !(
                whatExceptionalAboutIt &&
                whatExceptionalAboutIt.trim().length >= 10
              )
            }
            onClick={async () => {
              if (placeId) {
                mutate({
                  googlePlaceId: placeId,
                  user: {
                    id: authState!.uid,
                    name: authState!.displayName || authState!.email || "",
                  },
                  whatExceptionalAboutIt,
                });
              }
            }}
          />
        </div>
      </div>
    );
  }
}
