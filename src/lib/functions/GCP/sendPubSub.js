import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout } from "../../../firebase";
import { useState } from "react";

const getUserLocation = () => {
    var requestOptions = {
        method: 'GET',
    };
    return fetch("https://api.geoapify.com/v1/ipinfo?&apiKey=25295c1e27bd4f1ebb9042a3ba0dfc2b", requestOptions)
        .then(response => response.json())
        .then(result => result.city.name)
        .catch(error => console.log(""));
}

const sendPubSub = async (type, page, type_id = 0, loggedIn = false, input_length = 0) => {

    let usersCity = await getUserLocation();

    let mode = localStorage.getItem("mode");
    let color = localStorage.getItem("hattifnatt");

    //type_id: which type of interaction.
    //button
    //input
    //open_convo
    //choose_color
    //visit
    //navbar
    //success

    const interactionInfo = {
        "data": type,
        "location": usersCity,
        "attributes": {
            "page": page,
            [`${type}_id`]: `${type_id}`,
            "mode": `${mode}`
        }
    }

    //check which page


    //the only page which has the possibility to be not logged in is Home.js
    if(loggedIn !== null) loggedIn = true;
    if (page === "/") interactionInfo["attributes"]["logged_in"] = `${loggedIn}`;

    //hattifnattmagic only has one button, and that is the submit message
    if (page === "/hattifnattmagic" && type === "button") interactionInfo["attributes"]["input_length"] = `${input_length}`;

    //send through which color / mode the user chose
    if(page === "/hattifnattmagic") interactionInfo["attributes"]["color"] = `${color}`;

    if(page === "/settings" && type_id === 12) interactionInfo["attributes"]["mode_change_to"] = `${mode}`;

    const postedContent = JSON.stringify(interactionInfo);

    //"http://localhost:8080";
    const REACT_APP_deployed = "https://fnattimagebackend-ixdqvtcibq-ew.a.run.app";
    //Make a POST request to your API endpoint
    fetch(`${REACT_APP_deployed}/api/pubsub`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: postedContent,
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to send topic HU');
            }
        })
        .then((data) => {
            return
            // Handle success, reset form, or perform other actions
        })
        .catch((error) => {
            return
            // Handle errors, show a message to the user, etc.
        });
    }


    export default sendPubSub;