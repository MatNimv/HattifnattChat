import React, { useEffect, useState } from "react";
import countClientTimer from '../../functions/countClientTimer';
import Loading from "../LoadingCircles";
import getTime from "../../functions/getTime";
import { v4 as uuidv } from 'uuid';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import sendPubSub from "../../functions/GCP/sendPubSub";

//import anim from '../../media/'

const ConversationBox = ({ isThinkingAnim, isHattifnattChosen }) => {

    //const { isThinkingAnim, setisThinkingAnim } = props
//"";http://localhost:8080
    //"
    const REACT_APP_deployed = "https://fnattimagebackend-ixdqvtcibq-ew.a.run.app";

    const [isLoading, setIsLoading] = useState(true);
    const history = useHistory();

    const [newConvoInputs, setNewConvoInputs] = useState([]);
    const [writtenReq, setWrittenReq] = useState("");
    const [startTimer, setStartTimer] = useState("");
    const [chatWrites, setChatWrites] = useState(false);
    const [conversationDate, setConversationDate] = useState("");
    const [conversation, setConversation] = useState([]);
    const [buttonIsDisabled, setButtonIsDisabled] = useState(false);

    const uid = localStorage.getItem("id");
    const sessionId = localStorage.getItem("sessionId");
    let color = localStorage.getItem("hattifnatt");

    const getConversation = async () => {

        const uid = localStorage.getItem("id");
        const sessionId = localStorage.getItem("sessionId");

        try {
            fetch(`https://fnattimagebackend-ixdqvtcibq-ew.a.run.app/api/getUserConvo?sessionId=${sessionId}&uid=${uid}`).then(
                response => {

                    if (response.ok) {
                        return response.json();
                    } else {
                        alert(response.status);
                    }
                }
            ).then(
                data => {
                    if (data.conversation === undefined || data.conversation === undefined) {
                        setIsLoading(false);
                        alert("It seems like the Hattifnatts ate your conversation. Nom.");
                        history.push("/home?error=1");
                    }
                    else {
                        setConversation(data.conversation[`conversation${color}`].splice(2));
                        setConversationDate(data.conversation.dateStarted);
                        setIsLoading(false);
                    }
                }
            )
        } catch {
            setIsLoading(false);
            return <div>Seems like the hattifnatts ate your conversation. Try again in a little while.</div>
        }

    }

    const messageBubble = (content, role) => {
        let messageObject = {
            content: content,
            time: getTime(),
            role: role
        }
        return messageObject
    }

    useEffect(() => {
        if (isHattifnattChosen === true) getConversation()
        //getConversation();
    }, [isHattifnattChosen])

    const handleSubmit = async (e) => {
        e.preventDefault();
        let requestTimeClient = new Date().getTime();

        //the fetch could take a long time or fail
        //const longFetchTime = 15000;
        //const id = setTimeout(() => setNewConvoInputs(newConvoInputs => [...newConvoInputs, messageBubble("Oh dear me. Typing with these fingers isn't as easy as it looks like. Please bear with me a moment longer.", "system")]), longFetchTime);

        setStartTimer(requestTimeClient);
        setChatWrites(true);
        setButtonIsDisabled(true);
        setWrittenReq("");

        //if input is empty
        if (writtenReq === "" || writtenReq.length === 0) {
            setNewConvoInputs(newConvoInputs => [...newConvoInputs, messageBubble(" ", "user")]);
            setNewConvoInputs(newConvoInputs => [...newConvoInputs, messageBubble("That is quite a lack of information. Please try again.", "system")]);
            setIsLoading(false);
            setButtonIsDisabled(false);
            setChatWrites(false);
        } else {
            setNewConvoInputs(newConvoInputs => [...newConvoInputs, messageBubble(writtenReq, "user")]);

            const requestContent = JSON.stringify({
                uid: uid,
                sessionId: sessionId,
                content: writtenReq,
                timer: requestTimeClient,
                color: localStorage.getItem("hattifnatt")
            });

            try {
                // Make a POST request to your API endpoint
                fetch(`${REACT_APP_deployed}/api`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: requestContent,
                })
                    .then((response) => {
                        //the hattifnatt shall not write that they are slow if the user sent a short message
                        //if(writtenReq.length > 12) clearTimeout(id);
                        
                        if (response.ok) {
                            return response.json();
                        } else {
                            //let hattifnattErrorMessage = "I just can't be bothered. Try again later."
                            setNewConvoInputs(newConvoInputs => [...newConvoInputs, messageBubble("I just can't be bothered. Try again later.", "system")]);
                            setIsLoading(false);
                            setButtonIsDisabled(false);
                            setChatWrites(false);
                        }
                    })
                    .then((data) => {
                        if (data && data.chatGPTContent) {
                            //props.setIsThinkingAnim(false);
                            setNewConvoInputs(newConvoInputs => [...newConvoInputs, messageBubble(data.chatGPTContent.message, "system")]);
                            setChatWrites(false);
                            setButtonIsDisabled(false);

                            //send in timers to api to add to firestore
                            const apiTimer = data.chatGPTContent.apiTimer;
                            let clientTime = countClientTimer(startTimer);
                            let requestContent = JSON.stringify({
                                uid: uid,
                                sessionId: sessionId,
                                apiTimer: apiTimer,
                                clientTimer: clientTime,
                                color: color
                            })

                            fetch(`${REACT_APP_deployed}/api/updateTimers`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: requestContent,
                            })
                                .then((response) => {
                                    if (response.ok) {
                                        // Handle success, reset form, or perform other actions
                                        return response.json();
                                    } else {
                                        console.error('Failed to update timers.');
                                        //throw new Error('Failed to update timers.');
                                    }
                                })
                                .catch((error) => {
                                    console.error('Error:', error);
                                    // Handle errors, show a message to the user, etc.
                                });
                        }else {
                            setNewConvoInputs(newConvoInputs => [...newConvoInputs, messageBubble("I just can not be bothered. Try again later.", "system")]);
                            setIsLoading("false");
                            setButtonIsDisabled(false);
                            setChatWrites(false);
                        }
                    });
            } catch {
                let messageObject = {
                    content: "I need more electricity to answer. Try again later.",
                    time: getTime(),
                    role: "system"
                }
                setNewConvoInputs(newConvoInputs => [...newConvoInputs, messageObject]);
                setButtonIsDisabled(false);
                setIsLoading(false);
                setChatWrites(false);
            }
        }
    }

    return (
        <div className="conversationBox">
            {isLoading ? (<div> <Loading class="conversations" message="Loading user conversation..."></Loading> </div>) :
                (
                    <div> <h6>Session started: {conversationDate} </h6>

                        {conversation.map((conv) => (
                            <div className={`oneMessage ${conv.role}`}>
                                <div key={uuidv()} className="messageContent">
                                    <p>{conv.time}</p><p>{conv.content}</p>
                                </div>
                            </div>
                        ))}
                        {newConvoInputs.map((conv) => (
                            <div className={`oneMessage ${conv.role}`}>
                                <div key={uuidv()} className="messageContent">
                                    <p>{conv.time}</p>
                                    <p>{conv.content}</p>
                                </div>
                            </div>
                        ))}
                        {chatWrites ? (<div><Loading class="chatWrites" message={"Hattifnatt is thinking..."}></Loading></div>) : (<p></p>)}
                        <form>
                            <input type="text" placeholder="Write a message..." value={writtenReq} onChange={(e) => setWrittenReq(e.target.value)} onClick={(e) => {sendPubSub("input", window.location.pathname, 1);}}></input>
                            <button className={`disabled${buttonIsDisabled}`} onClick={(e) => { handleSubmit(e); sendPubSub("button", window.location.pathname, 4, true, writtenReq.length) }}>Send Message</button>
                        </form>
                    </div>
                )}
        </div>
    );
}

export default ConversationBox;




