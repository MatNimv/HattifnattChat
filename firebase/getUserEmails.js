import { firestore } from "./firebaseConf.js";

const getUserEmails = async () => {
    try {
        const documentRef = firestore.collection("users");
        const querySnapshot = await documentRef.get();
        const data = [];

        // Loop through the documents in the subcollection and store them in an array
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });

        const emails = data.flatMap((user) => user.info.email);

        return emails;
    } catch (error) {
        console.error('Error querying document users: ', error);
        return [];
    }
}

export default getUserEmails;