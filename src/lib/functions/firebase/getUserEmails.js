const getUserEmails = async () => {
        //"http://localhost:8080";
        const REACT_APP_deployed = "https://fnattimagebackend-ixdqvtcibq-ew.a.run.app";
        let userEmails = [];
    try {
        fetch(`${REACT_APP_deployed}/api/getUserEmails`).then(
            response => {
                if (response.ok) {
                    return response.json()
                }
            }
        ).then(
            data => {
                userEmails = data.meddelande;
                //return userEmails;
            }
        )
        return userEmails;
    } catch {
        alert("Failed to get user emails.");
    }
}

export default getUserEmails;