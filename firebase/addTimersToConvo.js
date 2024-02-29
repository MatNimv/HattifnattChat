import { firebase, firestore, updateDoc, db, doc, getDoc } from './firebaseConf.js';

const addTimersToConvo = async (uid, sessionId, apiTimer, clientTimer, res, color) => {
    try {
        const documentRef = firestore.collection("users").doc(uid);
        const subcollectionRef = documentRef.collection("sessions");
        const sessionDocRef = subcollectionRef.doc(sessionId);
        const sessionDocSnapshot = await sessionDocRef.get();

        if (sessionDocSnapshot.exists) {
            //editing the last output from the conversation.
            //adding two keys: apiTimer and ClientTimer
            const sessionData = sessionDocSnapshot.data();
            let convoLength = sessionData[`conversation${color}`].length;
            let lastConvo = sessionData[`conversation${color}`][convoLength - 1];

            lastConvo.apiTimer = apiTimer;
            lastConvo.clientTimer = clientTimer;

            let updatedTimeConversation = sessionData[`conversation${color}`];
            updatedTimeConversation.pop();

            updatedTimeConversation.push(lastConvo);

            await updateDoc(sessionDocRef, {
                [`conversation${color}`]: updatedTimeConversation
            });

            res.status(201).json("Document was updated");
        } else {
            res.status(400).json("Document not found");
        }   
    } catch (error) {
        res.status(400).json("Document was not updated");
    }
};

export default addTimersToConvo;
