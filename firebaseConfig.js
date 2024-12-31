import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    apiKey: "AIzaSyBYlWmlEj5BJz0cN6yMkEKu8GPYvXv4mKw",
    authDomain: "montyhacksvii.firebaseapp.com",
    projectId: "montyhacksvii",
    storageBucket: "montyhacksvii.appspot.com",
    messagingSenderId: "100271214310",
    appId: "1:100271214310:web:968171f82a0a76ee46b527",
    measurementId: "G-Y8WQ4JR5N7",
};

const app = initializeApp(firebaseConfig);
initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

export default app; 
