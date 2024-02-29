import { firebase, firestore, updateDoc, db, doc, getDoc } from './firebaseConf.js';
import {v4 as uuidv} from 'uuid';

const addBQtFB = async (BQarray) => {
    try {
        const statisticsRef = firebase.firestore().collection("statistics");
        //const statisticsRef = firestore.collection("statistics");
        //const statisticsDocSnapShot = await statisticsRef.get();


        BQarray.forEach(BQfield => {
            
            const newFields = {
                "id": BQfield.message_id,
                "time": BQfield.publish_time.value,
                "data": BQfield.data,
                "location": BQfield.location,
                "attributes": BQfield.attributes
            }
//
        statisticsRef
            .doc(BQfield.message_id)
            .set(newFields)
            .catch((err) => {
                console.error(err);
            })
        });

        //res.status(201).json("Document was updated"); 
    } catch (error) {
        return;
        //res.status(400).json("Document was not updated");
    }
};

export default addBQtFB;
