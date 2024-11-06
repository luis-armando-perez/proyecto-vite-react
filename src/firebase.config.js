import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC5-5G-Vjf9b0dAwTak65OIENSVEUtWX7w",
  authDomain: "gestorreact.firebaseapp.com",
  projectId: "gestorreact",
  storageBucket: "gestorreact.appspot.com",
  messagingSenderId: "433890268148",
  appId: "1:433890268148:web:6dfe1456444dae12799fa1"
};


const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;