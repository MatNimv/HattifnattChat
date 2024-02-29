//const functions = require('@google-cloud/functions-framework');
// import { functions } from '@google-cloud/functions-framework';
// import { PubSub } from '@google-cloud/pubsub';

// Register a CloudEvent callback with the Functions Framework that will
// be executed when the Pub/Sub trigger topic receives a message.
// functions.cloudEvent('testingPubSub', cloudEvent => {
//   // The Pub/Sub message is passed as the CloudEvent's data payload.
//   const base64name = cloudEvent.data.message.data;

//   const name = base64name
//     ? Buffer.from(base64name, 'base64').toString()
//     : 'World';

//   console.log(`Hello, ${name}!`);
// });



// 1. We import the PubSub class from the @google-cloud/pubsub library and create a pubsub object.
// 2. Inside the helloWorld function, we retrieve the test attribute from the request body.
// 3. We specify the name of the topic you want to publish to.
// 4. We create a Buffer for the message data (which is empty in your Python code) and define the message attributes.
// 5. We use pubsub.topic(topicName).publish(data, attributes) to publish the message to the specified topic.
// 6. We handle errors and return an appropriate response.

// const pubsub = new PubSub();

// exports.testingPubSub = async (req, res) => {
//   try {
//     const testAttribute = req.body.test;
//     const topicName = 'userClickv3'; // The name of your topic

//     const data = Buffer.from('');
//     const attributes = { testAttribute: testAttribute };

//     await pubsub.topic(topicName).publish(data, attributes);
    
//     res.status(200).send('OK');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Not OK');
//   }
// };

// export default testingPubSub;
