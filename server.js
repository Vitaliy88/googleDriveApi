const express = require('express');
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
// const app = next({ dev });
const app = express();
// const handle = app.getRequestHandler();

const {google} = require('googleapis');

const {OAuth2Client} = require('google-auth-library');

const uuidv1 = require('uuid/v1');

app.use(express.static('public'));

const CLIENT_ID ='CLIENT_ID';
const CLIENT_SECRET = 'CLIENT_SECRET';
const REDIRECT_URL = 'REDIRECT_URL';
const REFRESH_TOKEN = 'REFRESH_TOKEN';

const oAuth2Client = new OAuth2Client(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);

oAuth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN
});

const drive = google.drive({
  version: 'v3',
  auth: oAuth2Client
});


drive.changes.getStartPageToken({}, function (err, res) {
  console.log('Start token:', res.data.startPageToken);
  pageToken = res.data.startPageToken;

  drive.changes.watch({
    pageToken: pageToken,
    mimeType: 'application/json',
    requestBody: {
      id: uuidv1(),
      type: 'web_hook',
      address: `${REDIRECT_URL}/notifications`,
    },
    contentType: 'application/json'
  }, function(err, result) {
    console.dir(err)
    debugger
    if(err) throw new Error(err)
    console.log(result)
  });
});


app.get("/", function(request, response){
  response.send("<h2>Express!</h2>");
});

app.post("/notifications", (req, res, next) => {
  console.log('notification')
  console.log(req)
  res.status(200)
});

app.listen(3000, ()=> '> Ready on http://localhost:3000');