import sendPubSub from "../../functions/GCP/sendPubSub";
const ChooseHattiFnatt = ({ setChosenHattifnatt }) => {


    return (
        <div id="chooseHattifnattWrapper">
            <div id="chooseYellow" onClick={(e) => {setChosenHattifnatt(true); localStorage.setItem("hattifnatt", "Yellow"); sendPubSub("choose_color", window.location.pathname, 1); }}>
                <div className="title">
                    <h2>YELLOW</h2>
                </div>
                <div className="description">
                    <p>This Hattifnatt is optimistic and analyses your ideas with a positive light.</p>
                </div>
            </div>
            <div className="space">
                <h4>Choose a Hattifnatt to chat with!</h4>
            </div>
            <div id="chooseWhite" onClick={(e) => {setChosenHattifnatt(true); localStorage.setItem("hattifnatt", "White"); sendPubSub("choose_color", window.location.pathname, 2); }}>
                <div className="title">
                    <h2>WHITE</h2>
                </div>
                <div className="description">
                    <p>This HattiFnatt is neutral and analytic. It speaks FACTS.</p>
                </div>
            </div>
        </div>
    )
}

export default ChooseHattiFnatt;