import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCiPFnSmgxFBu18kCR2OWonqCEzs7CIUIw",
  authDomain: "calling-system-project.firebaseapp.com",
  projectId: "calling-system-project",
  storageBucket: "calling-system-project.appspot.com",
  messagingSenderId: "762907241182",
  appId: "1:762907241182:web:8de66bac3ae6976d64304f",
  measurementId: "G-15ZHPN6EDQ"
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, db, storage };