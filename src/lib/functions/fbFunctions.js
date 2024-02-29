import { auth, db, logout } from "../../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const FetchUserName = async () => {
    //const currentUser = auth.currentUser;
    //const [name, setName] = useState("");

    //if(currentUser){
    //    const uid = currentUser.uid;
    //    const fname = "";

    //    try {
    //        const q = query(collection(db, "users"), where("id", "==", uid));
    //        const doc = await getDocs(q);
    //        const data = doc.docs[0].data();
    //        fname = data.fname;
    //        //setName(data.fname);
    //        return fname;
    //    } catch (err) {
    //        //setName("Spöket Laban");
    //        alert("Ett fel uppstod när användardatan hämtades. Försök igen.");
    //    }
    //}
    //return name;
}

export { FetchUserName };