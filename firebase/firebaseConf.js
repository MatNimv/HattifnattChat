import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import firebase from 'firebase/compat/app';
import { getStorage } from 'firebase/storage';
import { 
        getFirestore, 
        doc, 
        collection, 
        getDoc, 
        updateDoc 
    } from 'firebase/firestore'

//CONFIG
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: `AIzaSyB5WhkotlicTqotMYIzJD1qtSaCaRt-7sQ`,
    authDomain: `hattifnatt-c364f.firebaseapp.com`,
    projectId: `hattifnatt-c364f`,
    storageBucket: `storageBucket: hattifnatt-c364f.appspot.com`,
    messagingSenderId: `14724150177`,
    appId: `1:14724150177:web:bf2d9541de8e08532051e0`
};

// const firebaseConfig = {
//     apiKey: `${process.env.REACT_APP_apiKey}`,
//     authDomain: `${process.env.REACT_APP_authDomain}`,
//     projectId: `${process.env.REACT_APP_projectId}`,
//     storageBucket: `${process.env.REACT_APP_storageBucket}`,
//     messagingSenderId: `${process.env.REACT_APP_messagingSenderId}`,
//     appId: `${process.env.REACT_APP_appId}`
// };

const app = firebase.initializeApp(firebaseConfig)
const db = getFirestore(app);

firebase.initializeApp(firebaseConfig);
const storage = getStorage();
const firestore = firebase.firestore();

export {
    db,
    firebase,
    storage,
    firestore,
    doc,
    collection,
    getDoc,
    updateDoc,
}