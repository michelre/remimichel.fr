const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const compression = require('compression');
const dotenv = require('dotenv');
dotenv.config();


const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || '127.0.0.1';

const poolConfig = {
  pool: true,
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  //secure: true, // use TLS
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD
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
    from: 'contact@remimichel.fr',
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

app.listen(port, host, function () {
  console.log(`Server listening on ${port}`);
});
