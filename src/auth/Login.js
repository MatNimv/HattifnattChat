import React, { useEffect, useState } from "react";
import { auth, logInWithEmailAndPassword } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import LoadingCircles from '../lib/components/LoadingCircles';
import {v4 as uuidv} from 'uuid';
import addSessionToUser from "../lib/functions/firebase/addSessionToUser";
import setUserDetails from "../lib/functions/firebase/setUserDetails";
import "../lib/styles/auth.css";
import { Link } from 'react-router-dom';
import sendPubSub from "../lib/functions/GCP/sendPubSub";
import { sendPasswordReset } from "../firebase";
import getUserEmails from "../lib/functions/firebase/getUserEmails";

const Login = () => {

    sendPubSub("visit", window.location.pathname, 4);

    const currentUser = auth.currentUser;
    const [username, setUserName] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [email, setEmail] = useState("guest@user.com");
    const [password, setPassword] = useState("guestuser");
    const [user, loading, error] = useAuthState(auth);
    const [userLoading, setUserLoading] = useState(false);
    const history = useHistory();

    //checking user fields and sending to firebase auth
    const checkUserLogin = async () => {
        const isUserLoggiedIn = await logInWithEmailAndPassword(email, password);
        if (isUserLoggiedIn === true){
            sendPubSub("success", window.location.pathname, 1);
            alert("You have logged in.")
            setIsLoggedIn(true);
            history.push("/");
            
        } else {
            alert("The Hattifnatts cannot find the user. Please try again.")
            setUserLoading(false);
            setIsLoggedIn(false);
        }
    }

    const getUserDetails = async (uid) => {
        const isDetailsSet = await setUserDetails(uid);
        if (isDetailsSet === true){
            let fname  = localStorage.getItem('fname');
            let mode = localStorage.getItem('mode');
            setUserName(fname);
            setUserLoading(false);
            document.querySelector('.App').removeAttribute('id');
            document.querySelector('.App').setAttribute("id", mode + "Mode");
            history.push("/");
        } else {
            alert("Your user details got stolen by the Hattifnatts. Please try again.")
            setUserLoading(false);
        }
    }

    const resetPasswordChecks = async (writtenEmail) => {
        let userEmails = await getUserEmails();
        userEmails.forEach((Uemail) => {if(Uemail !== writtenEmail) alert("The Hattifnats doesn't recognise this email.");})
        if (!writtenEmail) alert("Please write an email.")
        else {
            sendPasswordReset(email);
        }
    }

    useEffect(() => {
        if (user){
            const newSessionID = uuidv();
            const uid = currentUser.uid;
            getUserDetails(uid);
            addSessionToUser("users", uid, newSessionID);
        } 
    }, [user, loading])

    if (userLoading) {
        return <LoadingCircles message="Logging in..."/>
    }

    return ( 
        <div id="loginWrapper">
            <h3>Log In</h3>
            <div className="loginInputs">
                <div className="emailInput">
                    <p>Your E-mail</p>
                    <input
                        type="text"
                        className="login__textBox"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onClick={() => {sendPubSub("input", window.location.pathname, 2)}}
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
                        onClick={() => {sendPubSub("input", window.location.pathname, 3)}}
                        placeholder="Password"
                    />
                </div>
                <button
                    onClick={() => {
                        checkUserLogin();
                        setUserLoading(true);
                        sendPubSub("button", window.location.pathname, 8);
                        }}>Log In
                </button>

            </div>
            <div className="choices login">
                <div>
                    <h6>Don't have an account?</h6>
                    <Link to="/register"><button onClick={() => {sendPubSub("button", window.location.pathname, 10)}}>Sign Up</button></Link>
                </div>
                <div>
                    <h6>Forgot your password?</h6>
                    <button onClick={() => { sendPubSub("button", window.location.pathname, 17); resetPasswordChecks(email) }}>Reset Password</button>
                </div>
            </div>
        </div>
    );
}

export default Login;