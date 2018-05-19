const express = require('express');
const mailjet = require('node-mailjet').connect(process.env.MJ_KEY, process.env.MJ_SECRET);
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('dist'));

app.get('/', function (req, res) {
  res.sendFile(`${__dirname}/dist/index.html`);
});

app.post('/api/send-mail', (req, res) => {
  const body = req.body;
  mailjet
    .post('send')
    .request({
      FromEmail: body.from_mail,
      FromName: body.from_name,
      Subject: body.subject,
      'Html-part': body.content,
      Recipients: [{'Email': 'remi.michel38@gmail.com'}]
    }).then(() => {
    res.send('OK');
  }, (err) => {
    console.log(err);
    res.status(500).send(err);
  })
});

app.listen(port, function () {
  console.log(`Server listening on ${port}`);
});