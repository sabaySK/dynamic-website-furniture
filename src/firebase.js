import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBv50Vg81Y2fzBieR0keQOcLSOYnpAZz0I",
  authDomain: "furniture-website-fcac1.firebaseapp.com",
  projectId: "furniture-website-fcac1",
  storageBucket: "furniture-website-fcac1.firebasestorage.app",
  messagingSenderId: "404968232396",
  appId: "1:404968232396:web:ae9346ba81f10f7695f969",
  measurementId: "G-V7P3E7K70Y"
};

const app = initializeApp(firebaseConfig);
console.log("firebase initialized", firebaseConfig.projectId);

const messaging = getMessaging(app);

export { app, messaging };