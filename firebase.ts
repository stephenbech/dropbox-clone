import {getApp, getApps, initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
   apiKey: "AIzaSyDdwbXBbKTqyfq2lUNHftgeuUvmpt_BeX4",
   authDomain: "dropbox-clone-bigman.firebaseapp.com",
   projectId: "dropbox-clone-bigman",
   storageBucket: "dropbox-clone-bigman.appspot.com",
   messagingSenderId: "491747238875",
   appId: "1:491747238875:web:433a708711a214c4cebdfe"
 };

 const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
 const db = getFirestore(app);
 const storage = getStorage(app);

 export { db, storage };