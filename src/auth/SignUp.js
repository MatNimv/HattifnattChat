import { useState } from "react";
import LoadingCircles from "../lib/components/LoadingCircles";
import {v4 as uuidv} from 'uuid';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import addSessionToUser from "../lib/functions/firebase/addSessionToUser";
import setUserDetails from "../lib/functions/firebase/setUserDetails";
import {
    registerWithEmailAndPassword,
} from "../firebase";
import { Link } from 'react-router-dom';
import sendPubSub from "../lib/functions/GCP/sendPubSub";
import getUserEmails from "../lib/functions/firebase/getUserEmails";

const SignUp = () => {

    sendPubSub("visit", window.location.pathname, 5);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fname, setFName] = useState("");
    const [lname, setLName] = useState("");
    const [userLoading, setUserLoading] = useState(false);
    const history = useHistory();
    const [userEmails, setUserEmails] = useState([]);

    const register = async () => {
        //controls of the inputs 
        let userEmails = await getUserEmails();
        userEmails.forEach((Uemail) => {if(Uemail === email) alert("This email is already in use.");})
        if (!fname || !lname || !email || !password){
            alert("Please fill all fields.");
            setUserLoading(false);
        } else if (password.length <= 5){
            alert("Please write a password longer than 5 characters.");
            setUserLoading(false);
        } else if (!email.includes("@")){
            alert("Please write a functional email.");
            setUserLoading(false);
        }
        //all is fine, create the user
        else {
            //const uid = uuidv();
            const newSessionID = uuidv();
            const uid = await registerWithEmailAndPassword(fname, lname, email, password);

            const getUserDetails = async (uid) => {
                const isDetailsSet = await setUserDetails(uid);
                if (isDetailsSet === true) {
                    setUserLoading(false);
                    sendPubSub("success", window.location.pathname, 2);
                    alert("You have successfully registered an user. Welcome " + fname + "!");
                    history.push("/");
                } else {
                    alert("Your user details got stolen by the Hattifnatts. Please try again.");
                    setUserLoading(false);
                }
            }
            await getUserDetails(uid);
            addSessionToUser("users", uid, newSessionID);
        }
    }

    if (userLoading) {
        return <LoadingCircles message="Creating user..."/>
    }

    return (
        <div id="signUpWrapper">
            <h3>Sign Up</h3>
            <div className="signUpInputs">
                <div className="nameInputs">
                    <div className="fnameInput">
                        <p>Your First Name</p>
                        <input
                            type="text"
                            className="login__textBox"
                            value={fname}
                            onChange={(e) => setFName(e.target.value)}
                            onClick={() => {sendPubSub("input", window.location.pathname, 4)}}
                            placeholder="First Name"
                        />
                    </div>
                    <div className="lnameInput">
                        <p>Your Last Name</p>
                        <input
                            type="text"
                            className="login__textBox"
                            value={lname}
                            onChange={(e) => setLName(e.target.value)}
                            onClick={() => {sendPubSub("input", window.location.pathname, 5)}}
                            placeholder="Last Name"
                        />
                    </div>
                </div>
                <div className="emailInput">
                    <p>Your E-mail</p>
                    <input
                        type="text"
                        className="login__textBox"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onClick={() => {sendPubSub("input", window.location.pathname, 6)}}
                        placeholder="E-mail"
                    />
                </div>
                <div className="passInput">
                    <p>Your Password</p>
                    <input
                        type="password"
                        className="login__textBox"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onClick={() => {sendPubSub("input", window.location.pathname, 7)}}
                        placeholder="Password"
                    />
                </div>
                <button
                    onClick={() => {
                        setUserLoading(true);
                        register();
                        sendPubSub("button", window.location.pathname, 10);
                    }}> Register
                </button>
            </div>
            <div className="choices">
                    <h6>Already have an account?</h6>
                    <Link to="/login"><button onClick={sendPubSub("button", window.location.pathname, 11)}>Log In</button></Link>
                </div>
        </div>
    );
};

export default SignUp;
