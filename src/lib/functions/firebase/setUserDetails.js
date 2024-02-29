import { db } from "../../../firebase";
import { query, getDocs, where, collection } from "firebase/firestore";

async function setUserDetails (uid) {
        
    try {
        const q = query(collection(db, "users"), where("id", "==", uid));
        const doc = await getDocs(q);
        const data = doc.docs[0].data();
        //setIsLoggedIn(true);
        //lägger till i localstorage
        localStorage.setItem("fname", data.info.fname);
        localStorage.setItem("lname", data.info.lname);
        localStorage.setItem("email", data.info.email);
        localStorage.setItem("id", data.id);
        localStorage.setItem("mode", data.mode);
        localStorage.setItem("dateJoin", data.dateJoin);
        return true;
    } catch (err) {
        //alert("Ett fel uppstod när användardatan hämtades. Försök igen.");
        return false;
    }
}

export default setUserDetails;