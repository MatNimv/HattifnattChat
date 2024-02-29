import firebase from "../../../firebase";

const ref = firebase.firestore().collection("users");

function AddProjekt(newUser) {
    console.log("laddar upp user på fb");
    ref
        .doc(newUser.id)
        .set(newUser)
        .catch((err) => {
            console.error(err);
        })
}

export default AddProjekt;