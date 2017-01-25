'use strict';

let api_key = process.env.MAILGUN_API_KEY,
    domain = process.env.MAILGUN_API_DOMAIN,
    mailgun = require('mailgun-js')({
      apiKey: api_key, domain: domain
    });

/**
 * Function to create the structure of Mailgun email. 
 * 
 */
function processData(event) {
  let body = JSON.parse(event.body);
  let data = {
    from: body.name + " <" + body.from  + ">",
    to: process.env.MAILGUN_API_EMAIL_TO,
    subject: process.env.MAILGUN_API_EMAIL_SUBJECT || 'Message From Site',
    text: body.message || ''
  };

  return data;

}

module.exports.hello = (event, context, callback) => {

  // Get the data
  let data = processData(event);

  // Send the message
  mailgun.messages().send(data, function (error, body) {
    
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
      },
      body: JSON.stringify({
          message: body
      }),
    };

    callback(null, response);
    
  });
  

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
