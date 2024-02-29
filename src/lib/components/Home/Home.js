import '../../styles/Home.css';
import React from 'react';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { auth } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import sendPubSub from '../../functions/GCP/sendPubSub';
import Loading from '../LoadingCircles';
import hattifnattsPic from '../../media/3hattifnattLogo.png';


const Home = () => {
    const [user, loading] = useAuthState(auth);

    sendPubSub("visit", window.location.pathname, 1, user);

    //handle errors
    const history = useHistory();
    const location = useLocation();
    const { search } = location;

    //if url has error parameter
    if (search.indexOf('error') > -1) {
        const errorNum = search.split('=').pop();
        //the conversations couldnt be fetched
        if (errorNum === "1") history.push("/hattifnattmagic");
    }

    return (
        <div id="HomeWrapper">
            <h1>Hattifnatt Chat</h1>
            <h6>The webbapp where you get the opportunity to chat with Hattifnatts with specific personalities regarding project ideas!</h6>
            <img className="hattifnattPic" src={hattifnattsPic} alt="Logo of three Hattifnatts on a circular black background"></img>
            <div id="home">
                {!loading ? (
                    <div>
                        {user ? (
                            <div>
                                <h4>Let's get</h4>
                                <Link to="/hattifnattmagic?link=chat"><button onClick={(e) =>{sendPubSub("button", window.location.pathname, 1, true)}}>started!</button></Link>
                            </div>
                        ) : (
                            <div className='signOrReg'>
                                <Link to="/login" onClick={(e) =>{sendPubSub("button", window.location.pathname, 2, false)}}><button>Log In</button></Link>
                                <p>or</p>
                                <Link to="/register" onClick={(e) =>{sendPubSub("button", window.location.pathname, 3, false)}}><button>Sign Up</button></Link>
                            </div>)}
                    </div>
                ) : (
                    <Loading></Loading>
                )}
            </div>
        </div>
    )
}

export default Home;


//const handleClick = () => {
//    fetch("https://fnattimagev2-yrgp6cugha-ew.a.run.app/api").then(
//    response => 
//    {
//        if(response.ok){
//        return response.json()
//        }
//    }
//).then(
//    data => {
//    setBackendData(data.meddelande);
//    }
//)
//return backendData;
//}