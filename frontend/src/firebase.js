import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyC5mL0rPQwyMo6O_HW0j80chrxEThvTEYc",
    authDomain: "chatsphere-d6a5e.firebaseapp.com",
    projectId: "chatsphere-d6a5e",
    // project-3086412429
    storageBucket: "chatsphere-d6a5e.firebasestorage.app",
    messagingSenderId: "3086412429",
    appId: "1:3086412429:web:4da58d36f933c0fadc10c4",
    measurementId: "G-Q919MGT46X"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
