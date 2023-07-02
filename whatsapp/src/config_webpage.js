const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

// Starten des Express-Servers
const app = express();
let configPath = __dirname + '\\..\\config\\config.json'
let htmlPath = __dirname + '\\..\\html'

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(htmlPath));

app.get('/', (req, res) => {
  res.redirect('/config.html');
});

let config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

app.get('/config', (req, res) => {
  res.json(config);
});

app.post('/config', (req, res) => {
  for (let key in req.body) {
    config[key].value = req.body[key].value;
  }

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');

  res.json(config);
});

app.listen(3000, () => {
  console.log('WebServer running on Port 3000');
});
