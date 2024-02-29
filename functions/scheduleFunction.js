import fetchBQData from "../gcloud/fetchBQData.js";

const scheduleFunction = async () => {
    // Get the current date and time in your local timezone
    const now = new Date();
  
    // Calculate the time until the next 2 AM
    //const timeUntil2AM = new Date(
    //  now.getFullYear(),
    //  now.getMonth(),
    //  now.getDate(),
    //  2, // 2 AM 
    //  0, // 0 minutes
    //  0, // 0 seconds
    //  0 // 0 milliseconds
    //) - now;
  
    // If it's already past 2 AM, schedule for the next day
    //const delay = timeUntil2AM > 0 ? timeUntil2AM : timeUntil2AM + 24 * 60 * 60 * 1000;
  
    // Set up an interval to run the function every 24 hours
    setInterval( async () => {
      console.log("nu kör den" + new Date);
      await fetchBQData();
    }, 7200000); // every 2 hours
  // * 60 * 60 * 1000
    // Run the function immediately
    //runFunction();
  }
  
  export default scheduleFunction;