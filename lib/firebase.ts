import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);

const firebaseAuth = getAuth(firebaseApp);
const firebaseDB = getFirestore(firebaseApp);

const addGame = async (data: any, collectionName: string) =>
  await addDoc(collection(firebaseDB, collectionName), { ...data });

const changeGameStatus = async (status: string, gameId: string) => {
  const ref = doc(firebaseDB, "games", gameId);
  try {
    await updateDoc(ref, {
      status: status,
    });
  } catch (e) {
    console.error(e);
  }
};

export { firebaseApp, firebaseAuth, firebaseDB, addGame, changeGameStatus };
