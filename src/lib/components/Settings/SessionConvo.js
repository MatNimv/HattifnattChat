import {v4 as uuidv} from 'uuid';

const SessionConvo = ( { isConvoOpen, setIsConvoOpen, handleConvoClose, conversation }) => {

    if (!isConvoOpen) {
        return null;
    }

    return (
        <div id="sessionConvoWrapper">
            <div onClick={() => {handleConvoClose(); setIsConvoOpen(false);}}> ◄ Return to sessionlist</div>
            {conversation.map((conv) => (
                <div key={uuidv()} className={conv.role}>
                    <p>{conv.time}</p><p>{conv.content}</p>
                </div>
            ))}
        </div>
    )
}

export default SessionConvo;