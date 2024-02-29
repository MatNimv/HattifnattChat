import { useEffect, useState, React } from 'react';
import { auth, db, logout } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import '../../styles/settings.css';
import SessionsList from './SessionsList';
import LoadingCircles from '../LoadingCircles';
import sendPubSub from "../../functions/GCP/sendPubSub";


const Settings = () => {

    sendPubSub("visit", window.location.pathname, 3);

    const [user, loading, error] = useAuthState(auth);
    const history = useHistory();

    const [userMode, setUserMode] = useState(localStorage.getItem("mode"));
    const [modeButton, setModeButton] = useState(localStorage.getItem("mode"));
    const [isModeLoad, setIsModeLoad] = useState(false);
    const [dateJoin, setDateJoin] = useState(localStorage.getItem("dateJoin"));

    /*popup*/
    const [isListOpen, setIsListOpen] = useState(false);
    const handleOpen = () => {setIsListOpen(true); setIsOpac(true)}
    const handleClose = () => {setIsListOpen(false); setIsOpac(false)}
    const [isOpac, setIsOpac] = useState(false);


    //let fname = localStorage.getItem("fname");
    const [fname, setFname] = useState(localStorage.getItem("fname"));

    //co""http://localhost:8080";
    const REACT_APP_deployed = "https://fnattimagebackend-ixdqvtcibq-ew.a.run.app";

    //toggles between light and dark mode
    //checks the ini user mode from .App and then 
    //changes the ID of the element,
    //changes localstorage mode variable,
    //and the text on the button depending
    //on mode.
    const toggleUserMode = async (e) => {
        setIsModeLoad(true);
        let app = document.querySelector(".App");
        let localUserMode = localStorage.getItem("mode");
        let switchToMode = "";

        if(localUserMode === "Light") switchToMode = "Dark";
        if(localUserMode === "Dark") switchToMode = "Light";

        const requestContent = JSON.stringify({
            uid: localStorage.getItem("id"),
            newMode: switchToMode
        });

        try {
            fetch(`${REACT_APP_deployed}/api/newUserMode`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: requestContent,
            })
        } catch {
            alert("Couldn't change user mode.");
        }

        setUserMode(switchToMode);
        app.removeAttribute("id");
        app.setAttribute("id", `${switchToMode}Mode`);
        localStorage.setItem("mode", `${switchToMode}`);
        setModeButton(`${localUserMode}`);
        setIsModeLoad(false);
    }

    useEffect(() => {
        let localUserMode = localStorage.getItem("mode");

        if(localUserMode === "Light") setModeButton("Dark");
        if(localUserMode === "Dark") setModeButton("Light");
    }, []);
    

    if(!user) history.push("/");

    return (
        <div id="settingsWrapper">
            <SessionsList isListOpen={isListOpen} handleClose={handleClose}></SessionsList>
            <div id='introText' className={`opac${isOpac}`}>
                <h3>Hi, {fname}!</h3>
                <p className="dateJoin" >You joined the Hattifnatts on {dateJoin}!</p>
                <h6>This is your settings page. Here you can visit earlier conversations with Hattifnatts. You can also set your mode preferences.</h6>
                <div className="userInformation">
                    <div className='modes'>
                        <h6>Switch to </h6>
                        <button onClick={(e) => {toggleUserMode(e.target.innerHTML); sendPubSub("button", window.location.pathname, 12, true, 0, modeButton)}}>{isModeLoad ? (<div><LoadingCircles class="modeLoad" message={""}></LoadingCircles></div>) : (<span>{modeButton} mode</span>)}</button>
                    </div>
                    <div className='chats'>
                        <h6>See earlier conversations</h6>
                        <button onClick={() => {handleOpen(); sendPubSub("button", window.location.pathname, 13)} }>Open History</button>
                    </div>
                </div>
                
                <button className="logout" onClick={() => {logout(); sendPubSub("button", window.location.pathname, 14)}}>Log out</button>
            </div>
        </div>
    )
}

export default Settings;