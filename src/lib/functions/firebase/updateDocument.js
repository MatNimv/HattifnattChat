import { firestore, firebase, updateDoc }from "../../../firebase";
import getUserSession from './getUserSession';

const updateDocument = async (uid, sessionId, newData, role) => {
    try {
        const documentRef = firestore.collection("users").doc(uid);
        const subcollectionRef = documentRef.collection("sessions");
        const sessionDocRef = subcollectionRef.doc(sessionId);
        const sessionDocSnapshot = await sessionDocRef.get();

        if (sessionDocSnapshot.exists) {
        // Document exists, you can access its data using sessionDocSnapshot.data()
            const sessionData = sessionDocSnapshot.data();

            const userSession = await getUserSession();
    
            const newInput = { role: role, content: newData, apiTimer: "0", clientTimer: "0" };
    
            // stringifies the data in session and incoming input
            const stringifiedSessionConv = JSON.stringify(userSession[0].conversation);
            const stringifiedNonArr = stringifiedSessionConv.slice(0, -1);
            const stringifiedNewInput = JSON.stringify(newInput);
        
            //puts the old conversation with the new input together
            const updatedConversation = stringifiedNonArr + "," + stringifiedNewInput + "]";
        
            //makes it an object
            const objectedUpdatedConversation = JSON.parse(updatedConversation);
    
            //updates the session document
            //await sessionDocRef.update(updateData);
            await updateDoc(sessionDocRef, {
                conversation: objectedUpdatedConversation
            });
        } else {
            return
        }   
    } catch (error) {
        return
    }
};

export default updateDocument;