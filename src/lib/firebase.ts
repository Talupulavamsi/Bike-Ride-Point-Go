import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDOeQeNm5VCrpXPOZNyBUqzC3TeldPu6gE',
  authDomain: 'bikebuddies-716e3.firebaseapp.com',
  projectId: 'bikebuddies-716e3',
  storageBucket: 'bikebuddies-716e3.appspot.com',
  messagingSenderId: '574142558321',
  appId: '1:574142558321:web:afb5a45cc16e83808e2bd0',
  // measurementId: 'G-3BCBGRKG4F', // optional, only if you use analytics
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;