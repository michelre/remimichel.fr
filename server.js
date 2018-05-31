const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const compression = require('compression');

const app = express();
const port = process.env.PORT || 3000;
const {GMAIL_LOGIN, GMAIL_PASS} = process.env;

const poolConfig = {
  pool: true,
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use TLS
  auth: {
    user: GMAIL_LOGIN,
    pass: GMAIL_PASS
  }
};

const transporter = nodemailer.createTransport(poolConfig);

app.use(compression());
app.use(bodyParser.json());
app.use(express.static('dist'));

app.get('/', function (req, res) {
  res.sendFile(`${__dirname}/dist/index.html`);
});

app.post('/api/send-mail', (req, res) => {
  const body = req.body;
  const message = {
    to: 'remi.michel38@gmail.com',
    subject: body.subject,
    html: `${body.content}<br/> ---- <br />From: ${body.name} - ${body.mail}`
  };
  transporter.sendMail(message, (err) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.send('OK')
    }
  });
});

app.listen(port, function () {
  console.log(`Server listening on ${port}`);
});
