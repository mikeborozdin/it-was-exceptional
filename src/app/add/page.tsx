"use client";

import { SavePlaceInput, savePlace } from "@/lib/backend/place/place";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { useAuthState } from "react-firebase-hooks/auth";
import { initFirebase } from "@/lib/frontend/firebase/firebase";
import { redirect } from "next/navigation";

const useServerActionMutate = (
  action: (input: SavePlaceInput) => Promise<any>
) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const mutate = async (input: SavePlaceInput) => {
    try {
      setIsLoading(true);
      await action(input);
      setIsSuccess(true);
    } catch (e) {
      setError(e);
    } finally {
      setIsLoading(false);
    }
  };

  return { error, isLoading, isSuccess, mutate };
};

initFirebase();

export default function AddPage() {
  const onChange = async (id: string) => {
    setPlaceId(id);
  };

  const [placeId, setPlaceId] = useState<string | null>(null);
  const [exceptionalThings, setExceptionalThings] = useState<string>("");

  const { mutate, isLoading, isSuccess } = useServerActionMutate(savePlace);

  const [authState, loading] = useAuthState(getAuth());

  useEffect(() => {
    if (!authState && !loading) {
      redirect("/signup");
    }
  }, [authState, loading]);

  if (isSuccess) {
    return (
      <div>
        <h1 className="text-3xl text-white font-extrabold">Thank you!</h1>
      </div>
    );
  } else {
    return (
      <div>
        <div>
          <h1 className="text-3xl text-white font-extrabold">
            Tell us what you&apos; found exceptional
          </h1>
        </div>

        <div className="w-full space-y-3">
          <label className="font-bold text-white">Place</label>
          <GooglePlacesAutocomplete
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
            selectProps={{
              className: "w-full text-black",
              onChange: (value) => {
                console.log(value);

                if (value) {
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
            value={exceptionalThings}
            onChange={(e) => setExceptionalThings(e.target.value)}
            className="w-full h-32 p-3 text-black text-2xl"
            placeholder="I had such a lovely time there..."
          />
        </div>

        <div className="w-full space-y-3">
          <input
            type="submit"
            value="Add"
            className="w-full bg-blue-500 p-3 rounded-full text-white font-bold hover:bg-blue-400 hover:cursor-pointer disabled:opacity-25"
            disabled={isLoading}
            onClick={async () => {
              if (placeId) {
                mutate({ id: placeId, exceptionalThings });
              }
            }}
          />
        </div>
      </div>
    );
  }
}
