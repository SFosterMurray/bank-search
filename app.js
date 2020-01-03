// this is the server...
const express = require('express');
const app = express();

const path = require('path');
const dotenv = require('dotenv');
const https = require('https');

// always... get protection...
const helmet = require('helmet');
app.use(helmet());

// base google places search url...
const BANK_PLACES = 'https://maps.googleapis.com/maps/api/place/textsearch/json';

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));

// load environment variables from .env file...
const envpath = path.join(__dirname, '.env.variables');
dotenv.load({path: envpath});
// check the bank information
// diagnose ('Paris FCU');

// home route... usage information...
app.get('/', (req, res) => {
  // console.log(req)
  res.send(`
    <div style="text-align: center;">
    <img src="logo.png" style="width: 200px;">
    </div>
    <div>
    <h4>Bank-ATM search usage:<br/>
    /findBankAtm?lat=48.864716&lng=2.349014&search=Paris FCU<h4>
    </div>
  `);
});

// findBankAtm route... grab the data...
app.get('/findBankAtm', (req, res) => {
  // user input from the url...
  const {lat, lng, search} = req.query;

  // grab the bank information...
  const bankAccess=search.replace(' ', '_');
  // find the api key
  const bankKey = process.env[bankAccess + '_key'];
  // find the language
  const bankLang = process.env[bankAccess + '_lang'];
  // find the search type
  const searchType = process.env[bankAccess + '_type'];
  // better have an api key...
  if (bankKey === null) {
    res.status(500).send({error: 'Invalid Bank api key...'});
  }
  // build the place search url...
  const url = `${BANK_PLACES}?query=${search}&location=${lat},${lng}&type=${searchType}&language=${bankLang}&key=${bankKey}`;
  // console.log (url);
  // res.status(200).send({ info: 'Success... we did it!' });
  https.get(url, (response) => {
    let body = '';
    response.on('data', (chunk) => {
      body += chunk;
    });
    response.on('end', () => {
      const places = JSON.parse(body);
      const locations = places.results;
      console.log(locations);
      res.json(locations);
    });
  }).on('error', () => {
    console.log('error occured');
  });
});

// make sure the process.env is initialized...
function diagnose(bankName) {
  // key uses '_' not ' '
  const bankAccess=bankName.replace(' ', '_');
  console.log('bankAccess = ', bankAccess);
  // find the api key
  const bankKey = process.env[bankAccess + '_key'];
  console.log('bankKey = ', bankKey);
  // find the language
  const bankLang = process.env[bankAccess + '_lang'];
  console.log('bankLang = ', bankLang);
  // find the search type
  const searchType = process.env[bankAccess + '_type'];
  console.log('searchType = ', searchType);
}

// start the server...
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port`, PORT);
});
