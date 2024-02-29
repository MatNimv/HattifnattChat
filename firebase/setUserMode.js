import { firebase, firestore, updateDoc, db, doc, getDoc } from './firebaseConf.js';
import {v4 as uuidv} from 'uuid';

const setUserMode = async (uid, newMode) => {

    try {
        const documentRef = firestore.collection("users").doc(uid);
        const DocSnapshot = await documentRef.get();

        if (DocSnapshot.exists) {
        // Document exists, you can access its data using sessionDocSnapshot.data()

            await updateDoc(documentRef, {
                mode: newMode
            });
        } else {
            console.log("Document not found");
        }   
        console.log('Document updated successfully');
    } catch (error) {
        console.error('Error updating document: ', error);
    }
};

export default setUserMode;