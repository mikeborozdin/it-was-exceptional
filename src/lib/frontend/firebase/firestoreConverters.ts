import { ExceptionalThing } from "@/lib/shared/types/ExceptionalThing";
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";

const exceptionalThingConverter: FirestoreDataConverter<ExceptionalThing> = {
  toFirestore: function (jobApplication: ExceptionalThing): DocumentData {
    return { ...jobApplication };
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options: SnapshotOptions
  ): ExceptionalThing {
    const data = snapshot.data(options);

    return {
      id: snapshot.id,
      googlePlaceId: data.googlePlaceId,
      name: data.name,
      whatExceptionalAboutIt: data.whatExceptionalAboutIt,
      address: {
        street: data.address.street,
        city: data.address.city,
        country: data.address.country,
        postalCode: data.address.postalCode,
      },
      user: {
        id: data.user.id,
        name: data.user.name,
      },
      website: data.url,
      profilePhoto: data.profilePhoto,
      googleMapsUrl: data.googleMapsUrl,
      photos: data.photos,
    };
  },
};

export { exceptionalThingConverter };
