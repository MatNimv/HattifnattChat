//fetches the conversation of the session the user is in.
const getConversation = async (link) => {

    const uid = localStorage.getItem("id");
    const sessionId = localStorage.getItem("sessionId");

    fetch(`${link}/api/getUserConvo?sessionId=${sessionId}&uid=${uid}`).then(
        response => {
            //?uid=${uid}
            if (response.ok) {
                return response.json();
            } else {
                alert(response.status);
            }
        }
    ).then(
        data => {
            //convInfo.conversation = data.conversation.conversation.splice(2);
            //convInfo.conversationDate = data.conversation.dateStarted;
            let conversation = data.conversation.conversation.splice(2);
            let conversationDate = data.conversation.dateStarted;

            // let convInfo = {
            //     conversation,
            //     conversationDate
            // };
            return data.conversation
        }
    )
}

export default getConversation;