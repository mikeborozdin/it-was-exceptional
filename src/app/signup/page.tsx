"use client";

import { LoadingSpinner } from "@/lib/frontend/components/LoadingSpinner/LoadingSpinner";
import { initFirebase } from "@/lib/frontend/firebase/firebase";
import { getAuth } from "firebase/auth";
import {
  useSignInWithGoogle,
  useCreateUserWithEmailAndPassword,
  useUpdateProfile,
} from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";

initFirebase();

interface SignupForm {
  name: string;
  email: string;
  password: string;
}

export default function SignUpPage() {
  const [signInWithGoogle] = useSignInWithGoogle(getAuth());
  const [createUserWithEmailAndPassword, _, isCreating, createError] =
    useCreateUserWithEmailAndPassword(getAuth());
  const [updateProfile, isUpdating] = useUpdateProfile(getAuth());

  const onSignUpWithGoogleClick = async () => {
    const res = await signInWithGoogle();

    if (res && res.user) {
      window.location.replace("/add");
    }
  };

  const { register, handleSubmit } = useForm<SignupForm>();

  const onSubmit = async (data: SignupForm) => {
    const res = await createUserWithEmailAndPassword(data.email, data.password);

    if (res?.user) {
      await updateProfile({
        displayName: data.name,
      });

      window.location.replace("/add");
    }
  };

  return (
    <>
      <div className="space-y-10">
        <h1 className="text-3xl text-white font-extrabold">Sign up</h1>

        {(isCreating || isUpdating) && <LoadingSpinner />}

        {createError && (
          <div className="text-red-500 font-bold">{createError.message}</div>
        )}

        {!isCreating && !isUpdating && (
          <>
            <button
              className="w-full bg-blue-500 p-3 rounded-full text-white font-bold hover:bg-blue-400 hover:cursor-pointer disabled:opacity-25"
              onClick={onSignUpWithGoogleClick}
            >
              Sign up with Google
            </button>

            <div className="text-center font-bold">...or...</div>

            <form
              className="flex flex-col space-y-3 w-full"
              onSubmit={handleSubmit(onSubmit)}
            >
              <input
                type="text"
                placeholder="Full name"
                className="border border-primary rounded-lg p-3 placeholder:font-bold text-black"
                {...register("name", { required: "Required" })}
              />
              <input
                type="email"
                placeholder="Email"
                className="border border-primary rounded-lg p-3 placeholder:font-bold text-black"
                {...register("email", { required: "Required" })}
              />
              <input
                type="password"
                placeholder="Password"
                className="border border-primary rounded-lg p-3 placeholder:font-bold text-black"
                {...register("password", { required: "Required" })}
              />

              <div className="flex flex-row justify-between">
                <input
                  type="submit"
                  className="w-full bg-blue-500 p-3 rounded-full text-white font-bold hover:bg-blue-400 hover:cursor-pointer disabled:opacity-25"
                  value="Sign up"
                />
              </div>
            </form>
          </>
        )}
      </div>
    </>
  );
}
