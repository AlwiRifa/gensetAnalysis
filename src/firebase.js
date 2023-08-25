import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import "firebase/compat/database";
import "firebase/compat/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAI2GDRtf4c1fcLVt99KONn8b9Z6uAHWPE",
  authDomain: "genset-ta.firebaseapp.com",
  databaseURL: "https://genset-ta-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "genset-ta",
  storageBucket: "genset-ta.appspot.com",
  messagingSenderId: "474425495575",
  appId: "1:474425495575:web:4c91202155195353678c52"
};

firebase.initializeApp(firebaseConfig);

export default firebase;