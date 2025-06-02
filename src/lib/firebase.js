import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDM1mTDEeRRUhqGhanw2KjbjvuiB6MoAJw",
  authDomain: "legitsoccertips.firebaseapp.com",
  projectId: "legitsoccertips",
  storageBucket: "legitsoccertips.firebasestorage.app",
  messagingSenderId: "411476431691",
  appId: "1:411476431691:web:87dd74b501411721274ece"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);