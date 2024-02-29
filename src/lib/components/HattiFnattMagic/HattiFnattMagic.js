import React, { useEffect, useState } from "react";
import { auth } from '../../../firebase'
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import '../../styles/animations.css';
import '../../styles/hattiFnattMagic.css'
import ConversationBox from './ConversationBox';
import sendPubSub from '../../functions/GCP/sendPubSub';
import { useLocation } from "react-router-dom";
//import ChooseHattiFnatt from "../lib/components/HattiFnattMagic/ChooseHattiFnatt"

//idle hattifnatt
import idleAnimWhiteLight from '../../media/IdleAnimWhiteLight.mp4';
import idleAnimWhiteDark from '../../media/IdleAnimWhiteDark.mp4';
import idleAnimYellowLight from '../../media/IdleAnimYellowLight.mp4';
import idleAnimYellowDark from '../../media/IdleAnimYellowDark.mp4';

//thinking hattifnatt
import thinkingAnimYellowLight from '../../media/ThinkingAnimYellowLight.mp4';
import thinkingAnimYellowDark from '../../media/ThinkingAnimYellowDark.mp4';
import thinkingAnimWhiteLight from '../../media/ThinkingAnimWhiteLight.mp4';
import thinkingAnimWhiteDark from '../../media/ThinkingAnimWhiteDark.mp4'
import ChooseHattiFnatt from "./ChooseHattiFnatt";

const HattiFnattMagic = () => {

    const [user] = useAuthState(auth);
    const history = useHistory();

    const [hattiFnatt, setHattiFnatt] = useState(idleAnimWhiteLight);
    const [chosenHattifnatt, setChosenHattifnatt] = useState(false);
    const [isThinkingAnim, setIsThinkingAnim] = useState(false);
    const [display, setIsDisplay] = useState("noDisplay");

    sendPubSub("visit", window.location.pathname, 2);

    //when coming frome Home.js (let's get started), the navbar isn't interacted with.
    //so the active title will manually be changed
    const setNavBarLink = () => {
        let navbarLinks = document.querySelectorAll("nav .links h4");
        navbarLinks.forEach((link) => link.firstElementChild.className = "");
        document.querySelector("nav #NavHattifnattmagic a").classList.add("navActive");
    }

    const location = useLocation();
    const { search } = location;
    //if url has error parameter
    if (search.indexOf('link') > -1) {
        const link = search.split('=').pop();
        //the conversations couldnt be fetched
        if (link === "chat") setNavBarLink();
    }

    //get keys from localstorage
    const mode = localStorage.getItem("mode");

    const checkUserModeAndHattiFnatt = () => {
        let hattifnatC = localStorage.getItem("hattifnatt");
        //checks which hattifnatt and which user mode
        if (isThinkingAnim === false) {
            if (mode === "Light" && hattifnatC === "White") { setHattiFnatt(idleAnimWhiteLight); }
            else if (mode === "Light" && hattifnatC === "Yellow") { setHattiFnatt(idleAnimYellowLight); }
            else if (mode === "Dark" && hattifnatC === "White") { setHattiFnatt(idleAnimWhiteDark); }
            else if (mode === "Dark" && hattifnatC === "Yellow") { setHattiFnatt(idleAnimYellowDark); }
        } else if (isThinkingAnim === true) {
            if (mode === "Light" && hattifnatC === "White") { setHattiFnatt(thinkingAnimWhiteLight); }
            else if (mode === "Light" && hattifnatC === "Yellow") { setHattiFnatt(thinkingAnimYellowLight); }
            else if (mode === "Dark" && hattifnatC === "White") { setHattiFnatt(thinkingAnimWhiteDark); }
            else if (mode === "Dark" && hattifnatC === "Yellow") { setHattiFnatt(thinkingAnimYellowDark); }
        }
    }

    // const checkUserModeAndTHINKINGHattiFnatt = () => {
    //     let hattifnatC = localStorage.getItem("hattifnatt");
    //     //checks which hattifnatt and which user mode


    const setHattiFnattColor = () => {
        document.querySelector(".overlay").remove();
        checkUserModeAndHattiFnatt();
        setChosenHattifnatt(true);
        setIsDisplay("yesDisplay")
    }

    useEffect(() => {
        //reload when the hattifnatt changes between 
        
        if(chosenHattifnatt === true && document.querySelector(".overlay")) setHattiFnattColor();
    }, [chosenHattifnatt]);

    useEffect(() => {
        //reload only when hattifnatt changes 
        setNavBarLink();

        if (!chosenHattifnatt == false) {
            checkUserModeAndHattiFnatt();
        }
    }, [hattiFnatt]);


    if (!user) {
        history.push("/");
    }

    return (
        <div id="hattifnattmagicWrapper">
            <video className="hattifnattVid" autoPlay loop src={hattiFnatt} type="video/mp4"></video>
            <div className="conversationAndSpacePlacer">
                <div className="space"></div>
                <div className="conversationWrapper">
                <div className={display}><ConversationBox setIsThinkingAnim={setIsThinkingAnim} isHattifnattChosen={chosenHattifnatt}></ConversationBox></div>
                <div className="overlay">
                        <ChooseHattiFnatt setChosenHattifnatt={setChosenHattifnatt}></ChooseHattiFnatt>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HattiFnattMagic;                        