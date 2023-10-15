import { Firestore, initializeFirestore } from "firebase/firestore";
import { initFirebase } from "./firebase";

let firestore: Firestore | null = null;

const initFirestore = () => {
  if (!firestore) {
    firestore = initializeFirestore(initFirebase(), {});
  }

  return firestore;
};

export { initFirestore };
