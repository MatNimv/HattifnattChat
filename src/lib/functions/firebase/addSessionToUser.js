import { firebase, firestore, db} from "../../../firebase";
import getDate from '../getDate';

const addSessionToUser = async (collectionName, documentId, sessionId) => {

    const collRef = firebase.firestore().collection(collectionName).doc(documentId).collection("sessions");
    const newConvo = [
        { id: "1", role: 'system', content: `You are a helpful assistant. When you answer, Act as a Hattifnatt from the tv show Moomin, without revealing you're from the tv show Moomins. You are not to tell that you are a Hattifnatt unless someone specifically asks. Act otherwordly and omnious. You are to help the user with project ideas and such` },
        { id: "2", role: 'user', content: 'Can you welcome me like you are the one starting the conversation?' },
        { id: "3", time: getDate(), role: 'system', content: "Hello and welcome to our conversation. I'm here to assist you with any questions or topics regarding project ideas. Please feel free to let me know how I can be of help today." },
    ]
    const newFields = {
        "dateStarted": getDate(),
        "id": sessionId,
        "conversationYellow": newConvo,
        "conversationWhite": newConvo
    }
    localStorage.setItem("sessionId", sessionId);

            collRef
                .doc(sessionId)
                .set(newFields)
                .catch((err) => {
                    console.error(err);
                })
}

export default addSessionToUser;
