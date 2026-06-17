import { initializeApp } from "firebase/app";

import AsyncStorage from "@react-native-async-storage/async-storage";
// @ts-ignore
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6ZEfAAkGs6jtVN8nr-5lLGg-FsJNUapk",
  authDomain: "studysprint-7fd4e.firebaseapp.com",
  projectId: "studysprint-7fd4e",
  storageBucket: "studysprint-7fd4e.firebasestorage.app",
  messagingSenderId: "1039976772413",
  appId: "1:1039976772413:web:3562f5901efff5e3078b54",
  measurementId: "G-9R7CQDLTX9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage Persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
