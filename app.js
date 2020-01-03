const path = require('path');
const express = require('express');
const app = express();

const dotenv = require('dotenv');
const request = require('request');

const helmet = require('helmet')
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static('public'))

// load environment variables from .env file...
const envpath = path.join(__dirname, '.env.variables');
dotenv.load({ path: envpath });
// check the bank information
//diagnose ('Paris FCU');

app.get('/',(req, res) => {
    //console.log(req)
    res.send(`
    	<div style="text-align: center;">
    	<img src="logo.png" style="width: 200px;">
    	</div>
    	<div>
    	<h4>Bank-ATM search usage:<br/>
    	/findBankAtm?lat=48.864716&lng=2.349014&search=Paris FCU<h4>
    	</div>
    `)
})

// make sure the process.env is initialized...
function diagnose (bank_name) {
	// key uses '_' not ' '
	let bank_access=bank_name.replace (' ', '_');
	console.log ('bank_access = ', bank_access);
	// find the api key
	let bank_key = process.env[bank_access + '_key'];
	console.log ('bank_key = ', bank_key);
	// find the language
	let bank_lang = process.env[bank_access + '_lang'];
	console.log ('bank_lang = ', bank_lang);
	// find the search type
	let search_type = process.env[bank_access + '_type'];
	console.log ('search_type = ', search_type);
}

// start the server...
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port`, PORT);
});
