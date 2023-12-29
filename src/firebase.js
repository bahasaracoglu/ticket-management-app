import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDrrenVDhX-AND0GNEPsQ4yRZMIqvNxsak",
  authDomain: "fimple-final-case.firebaseapp.com",
  projectId: "fimple-final-case",
  storageBucket: "fimple-final-case.appspot.com",
  messagingSenderId: "332860838340",
  appId: "1:332860838340:web:1128e518c3d2c592d1d491",
  measurementId: "G-1YP3V2VF4H",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const storage = getStorage(app);
export const auth = getAuth();
