
import { firestore } from "./firebaseConf.js";

const getUserSession = async (uid, sessionId) => {
    try {

        const documentRef = firestore.collection("users").doc(uid);
        const subcollectionRef = documentRef.collection("sessions");
        const querySnapshot = await subcollectionRef.get();
    
        const data = [];
    
        // Loop through the documents in the subcollection and store them in an array
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });
        
        let sessionDocument = data.filter((dat) => dat.id === sessionId);
        return sessionDocument[0];
        } catch (error) {
            console.error('Error querying subcollection: ', error);
            return [];
        }
}

export default getUserSession;