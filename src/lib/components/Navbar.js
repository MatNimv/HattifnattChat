import { useEffect, useState, React } from 'react';
import { Link } from 'react-router-dom';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout } from "../../firebase";
import sendPubSub from "../functions/GCP/sendPubSub";


const Navbar = () => {
    const [user, loading, error] = useAuthState(auth);

    //highlights the active link/page
    const setNavBarLink = (target) => {
        let navbarLinks = document.querySelectorAll("nav .links h4");
        navbarLinks.forEach((link) => link.firstElementChild.className = "");
        target.classList.add("navActive");
    }

    return (
        <nav>
            {user ? (
            <div className='links'>              
                <h4 id="NavHome" onClick={(e) => {setNavBarLink(e.target); sendPubSub("navbar", window.location.pathname, 1);}}><Link to="/">Home</Link></h4>
                <h4 id="NavHattifnattmagic" onClick={(e) => {setNavBarLink(e.target); sendPubSub("navbar", window.location.pathname, 2);}}><Link to="/hattifnattmagic">Hattifnatt Chat</Link></h4>
                <h4 id="NavSettings" onClick={(e) => {setNavBarLink(e.target); sendPubSub("navbar", window.location.pathname, 3);}}><Link to="/settings" >Settings</Link></h4> 
            </div>) : 
                (<h4></h4>)}
        </nav>
    )
}

export default Navbar;