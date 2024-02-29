const port = process.env.PORT || 8080;
import dotenv from 'dotenv';
dotenv.config();

import express from "express";
const app = express();
import bodyParser from "body-parser";
import cors from "cors";
import axios from "axios";
import { encode, decode } from 'gpt-3-encoder';

//FUNCTIONS 
import getUserSession from "./firebase/getUserSession.js";
import publishPubSub from './gcloud/publishPubSub.js';
import addInputToConvo from './firebase/addInputToConvo.js';
import fetchBigQueryData from './gcloud/fetchBQData.js';
import addTimersToConvo from './firebase/addTimersToConvo.js';
import setUserMode from './firebase/setUserMode.js';
import getUserEmails from './firebase/getUserEmails.js';
import scheduleFunction from './functions/scheduleFunction.js';
import fetchBQData from './gcloud/fetchBQData.js';
import addBQtFB from './firebase/addBQtoFB.js';

/* CORS */
//, ${process.env.REACT_APP_LOCAL}
const allowedOrigins = [`${process.env.REACT_APP_DEPLOY}`,];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS ey'));
    }
  },
};

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(cors(corsOptions));

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

///////////////////////////////////////
///////////////////////////////////////
////////////* BIGQUERY *///////////////

//bigquery will update every two hours now that
//the streaming buffer data wont be in the way.
setInterval(async () => {
  try {
    console.log("nu kör den" + new Date());
    await fetchBQData();
  } catch (error) {
    console.error("Error in setInterval:", error);
  }
}, 7200000); // every 2 hours



///////////////////////////////////////
///////////////////////////////////////
//////////////* PUBSUB *///////////////

app.get("/api/pubsub", (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({ "meddelande": `pubsub` })
})

app.post('/api/pubsub', (req, res) => {
  //checks to see if publish to BigQuery went through. 
  const publishToBQ = async () => {
    const pub = await publishPubSub(req, res);
    if (pub === true) res.status(201).json("BQ gick bra.");
    if (pub === false) res.status(201).json("BQ gick inte bra.");
  }
  publishToBQ();
})

////////////////////////////////////////
////////////////////////////////////////
////////* CHAT GPT POST *///////////////

app.get("/api", (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({ "meddelande": `chatgpt` })
})

const sendRequestToOpenAI = async (userID, userSessionID, content, timer, res, color) => {

  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  const endpoint = 'https://api.openai.com/v1/chat/completions'; // Replace with the specific API endpoint you want to use
  try {
    const response = await axios.post(endpoint, content, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status >= 300) res.status(400).json({ chatGPTContent: "Hattifnatt got too tired. Try something easier to ask." });
    else {
      //Handle the response from OpenAI here
      await addInputToConvo(userID, userSessionID, response.data.choices[0].message.content, "system", color);
      //console.log('Response from OpenAI:', response.data.choices[0].message.content);

      let endTime = Date.now();
      let timeDiff = endTime - timer;
      let apiTime = timeDiff /= 1000;

      //add timer status to specific conversation
      let chatGPTContent = {
        apiTimer: apiTime,
        message: response.data.choices[0].message.content
      }
      return chatGPTContent;
    }


  } catch (error) {
    // Handle any errors that occur during the request
    //if(response === undefined || response === null || !response || response.status > 300) res.status(400).json( { chatGPTContent: "I just can't be bothered. Ask me again in a little while thank you." } );
    let endTime = Date.now();
    let timeDiff = endTime - timer;
    let apiTime = timeDiff /= 1000;
    console.error('Error sending request to OpenAI:', error);
    let chatGPTMessage = {
      apiTimer: apiTime,
      message: 'Thy conversation is undoubtely marvelous, however, I need to refill my electric charges. Try messaging me again later.'
    }
    res.status(250).json({ chatGPTContent: chatGPTMessage });
  }
};

// Route to handle POST requests
app.post('/api', (req, res) => {
  const MAX_TOKENS = 4096;
  let chatGPTMessage = "";
  let prompt = "";
  let basePrompt = "Act as a Hattifnatt from the Moomin series which are otherwordly and omnious, do not mention that you are acting in the reply. You are to assist regarding project ideas.";

  const awaitAndSendConversation = async () => {
    await addInputToConvo(req.body.uid, req.body.sessionId, req.body.content, "user", req.body.color);
    const userSessionDoc = await getUserSession(req.body.uid, req.body.sessionId)
    if (req.body.color == "white") { prompt = "Answer with facts and information and neutrality. Seek the truth and don't generate ideas. Short sentences." }
    if (req.body.color == "yellow") { prompt = "Answer with sunshine and optimism. Look for opportunities and benifits. " }

    //chatGPT only wants content and role as input 
    //in an object to render an answer.
    const chatGPTformatConversation = [];
    let inputCounter = 0;
    let tokenInputCounter = 0;
    userSessionDoc[`conversation${req.body.color}`].map((conv) => {
      let oneInput = {
        content: conv.content,
        role: conv.role
      }
      inputCounter = oneInput.content.length + inputCounter;
      tokenInputCounter = oneInput.content + tokenInputCounter;
      chatGPTformatConversation.push(oneInput);
    })

    let numTokens = encode(tokenInputCounter);

    //checking the token limit
    if (numTokens.length >= MAX_TOKENS) {
      //remove half the array - the first part
      chatGPTformatConversation.splice(0, Math.floor(chatGPTformatConversation.length / 2));
    }
    //let lengthPrompt = "answer a short length answer.";
    //dont start a sentence with ah,
    let wishPrompts = "";

    //modifies the prompt to the chatGPT 
    let lastConv = chatGPTformatConversation.length;
    chatGPTformatConversation[lastConv - 1].content = chatGPTformatConversation[lastConv - 1].content + basePrompt + prompt + wishPrompts;

    const requestData = {
      messages: chatGPTformatConversation,
      model: 'gpt-3.5-turbo', // Specify the desired model variant here
    };

    chatGPTMessage = await sendRequestToOpenAI(req.body.uid, req.body.sessionId, requestData, req.body.timer, res, req.body.color);
    res.status(201).json({ chatGPTContent: chatGPTMessage });
  }
  awaitAndSendConversation();
});

//////////////////////////
//// GET CONVERSATION ////

app.get('/api/getUserConvo', (req, res) => {

  //gets the user session conversation and 
  //returns it to the client
  const getConversation = async () => {
    const userSessionContent = await getUserSession(req.query.uid, req.query.sessionId);
    if (userSessionContent === null || undefined) res.status(400).json("Error in getting user conversation");
    else { res.status(201).json({ "conversation": userSessionContent }); }
  }
  getConversation();
})


//////////////////////////
//// POST TIMERS /////////

app.post('/api/updateTimers', (req, res) => {

  const updateLastOutPutConvo = async () => {
    await addTimersToConvo(req.body.uid, req.body.sessionId, req.body.apiTimer, req.body.clientTimer, res, req.body.color);
  }
  updateLastOutPutConvo();
})


//////////////////////////
//// POST NEW MODE /////////

app.post('/api/newUserMode', (req, res) => {

  const updateUserMode = async () => {
    await setUserMode(req.body.uid, req.body.newMode);
  }
  updateUserMode();
  if (updateUserMode === false) res.status(400).json("User mode could not change.");
  else res.status(201).json("User mode is updated.");
})

//////////////////////////
//// GET USER EMAILS /////////

app.get('/api/getUserEmails', (req, res) => {

  const fetchEmails = async () => {
    const userEmails = await getUserEmails();
    if (userEmails === null || undefined) res.status(400).json("Error in getting user emails");
    else { res.status(201).json({ "meddelande": userEmails }); }
  }
  fetchEmails();
})



