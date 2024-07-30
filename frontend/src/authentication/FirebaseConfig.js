import { getFirestore } from "@firebase/firestore";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth,GoogleAuthProvider,signInWithPopup
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js'
import { initializeFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js'; // Import Firestore


const firebaseConfig = {
	apiKey: "AIzaSyBEIbORvHhm1jzrXh8ZlLDXh3J1iMzJc-I",
	authDomain: "vlabs-question-bank.firebaseapp.com",
	projectId: "vlabs-question-bank",
	storageBucket: "vlabs-question-bank.appspot.com",
	messagingSenderId: "593643579162",
	appId: "1:593643579162:web:148dbe748c954675af6ea3",
	measurementId: "G-JYXHPG9SJN"
};  

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

export { firebaseConfig, app, auth ,db}; // Export the auth object
