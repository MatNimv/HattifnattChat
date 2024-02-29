import { PubSub } from '@google-cloud/pubsub';

const pubsub = new PubSub();

const publishPubSub = async (req, res) => {
    try {
        //The name of your topic
        const topic = pubsub.topic('userInteract'); 

        //console.log("req.body:",req.body);
        //structure of the topic message to BQ
        
        const data = Buffer.from(req.body.data);
        
        const message = {
            data: data,
            attributes: req.body.attributes
        };
        console.log(message);
       // console.log("message: ",message);
        //console.log("topic: ",topic);
        //sends the message
        //console.log("topic:", topic);
        topic.publishMessage(message);

        //shall compare BQ data to firebase and update firebase 
        //depending on row field "firebase_export" is set to false

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export default publishPubSub;