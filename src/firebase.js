import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import "firebase/compat/database";

const firebaseConfig = {
    apiKey: "AIzaSyBKCq6Hts-2NGd1k4BRRp7q1HlPpg7aqYg",
    authDomain: "siyacine-1db03.firebaseapp.com",
    databaseURL: "https://siyacine-1db03-default-rtdb.firebaseio.com",
    projectId: "siyacine-1db03",
    storageBucket: "siyacine-1db03.appspot.com",
    messagingSenderId: "635200211259",
    appId: "1:635200211259:web:2f2cd0c711a9e6ed33cf1e"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();
const provider = new firebase.auth.GoogleAuthProvider();
const database = firebaseApp.database();

export { db, auth, provider, storage, database };