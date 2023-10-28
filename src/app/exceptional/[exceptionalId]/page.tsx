import { getThing } from "@/lib/backend/place/place";
import { ViewExceptionalThing } from "@/lib/frontend/components/ViewExceptionalThing/ViewExceptionalThing";
import { Metadata } from "next";

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
