const stripe = require('stripe')('sk_test_51NWDwjJVxmlf4m0IagVHLI5Ety7bUPZrlFzEaMI9axHQkMbaDBdscHhZn5MGx7ZslSkj6irIZCMDLC1kPbOaeESr00csY2mIIG');
const nodemailer = require('nodemailer');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json()); // Use JSON body parser
app.use(bodyParser.urlencoded({ extended: true })); 
app.get('/', (req, res) => {
    res.send('Hello World!');
});

const endpointSecret = "whsec_LCPdXcadY8jFRNp4V7zNZfZxBASvCGUB";
let session;

app.post('/webhook', express.raw({type: 'application/json'}), async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.async_payment_failed':
        session = event.data.object;
        console.log(session);
      // Then define and call a function to handle the event checkout.session.async_payment_failed
      break;
      case 'checkout.session.completed':
        session = event.data.object;
        console.log(session);

        let emailTo = session.customer_details.email;
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              // TODO: replace `user` and `pass` values from <https://forwardemail.net>
              user: 'francismwanik254@gmail.com',
              pass: 'Franc@254'
            }
          });
          
          
          // async..await is not allowed in global scope, must use a wrapper
        //   async function main() {
        //     // send mail with defined transport object
        //     const info = await transporter.sendMail({
        //       from: 'francismwanik254@gmail.com', // sender address
        //       to: "acewearske@gmail.com", // list of receivers
        //       subject: "Hello ✔", // Subject line
        //       text: "Hello world?", // plain text body
        //       html: "<b>Hello world?</b>", // html body
        //     });
          
        //     console.log("Message sent: %s", info.messageId);
        //     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
          
        //     //
        //     // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
        //     //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
        //     //       <https://github.com/forwardemail/preview-email>
        //     //
        //   }
          
        //   main().catch(console.error);
          
           
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Then define and call a function to handle the event checkout.session.async_payment_succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

/* webhooks from tinypesa */
app.post('/tinypesa', async (request, response) => {
    try {
        // console.log(request.body);
        // console.log(request.body.data);
        console.log(request.body);
        
    } catch (error) {
        console.log(error);
        
    }
});
    

app.listen(3000, () => console.log('Server is running on port 3000'));