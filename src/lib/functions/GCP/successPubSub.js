// /**
//  * Triggered from a message on a Cloud Pub/Sub topic.
//  *
//  * @param {!Object} event Event payload.
//  * @param {!Object} context Metadata for the event.
//  */
// exports.successPubSub = (event, context) => {
//     const message = event.data
//         ? Buffer.from(event.data, 'base64').toString()
//         : 'Click was successful.';
//     };