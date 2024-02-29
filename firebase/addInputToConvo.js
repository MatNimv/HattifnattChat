import { firebase, firestore, updateDoc, db, doc, getDoc } from './firebaseConf.js';
import {v4 as uuidv} from 'uuid';

const addInputToConvo = async (uid, sessionId, newData, role, color) => {
    const getTime = () => {
        let date = new Date();
        let hour = date.getHours();
        let minutes = date.getMinutes();

        return `${hour}:${minutes}`;
    }
    try {
        const documentRef = firestore.collection("users").doc(uid);
        const subcollectionRef = documentRef.collection("sessions");
        const sessionDocRef = subcollectionRef.doc(sessionId);
        const sessionDocSnapshot = await sessionDocRef.get();

        if (sessionDocSnapshot.exists) {
        // Document exists, you can access its data using sessionDocSnapshot.data()
            const sessionData = sessionDocSnapshot.data();

            //const userSession = await getUserSession();
            const convID = uuidv()
            let newInput = {};
            if(role === "user"){
                newInput = { role: role, content: newData, time: getTime(), id: convID};
            } else {
                newInput = { role: role, content: newData, apiTimer: "0", clientTimer: "0", time: getTime(), id: convID};
            }

            // stringifies the data in session and incoming input
            const stringifiedSessionConv = JSON.stringify(sessionData[`conversation${color}`]);
            const stringifiedNonArr = stringifiedSessionConv.slice(0, -1);
            const stringifiedNewInput = JSON.stringify(newInput);
        
            //puts the old conversation with the new input together
            const updatedConversation = stringifiedNonArr + "," + stringifiedNewInput + "]";
        
            //makes it an object
            const objectedUpdatedConversation = JSON.parse(updatedConversation);
    
            //updates the session document
            //await sessionDocRef.update(updateData);
            await updateDoc(sessionDocRef, {
                [`conversation${color}`]: objectedUpdatedConversation
            });
        } else {
            return;
        }   
    } catch (error) {
        return;
    }
};

export default addInputToConvo;
