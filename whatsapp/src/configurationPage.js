const express = require('express');
const configuration = require('./configuration.js');
const app = express();

app.use(express.json());

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    let websiteConfig = { ...configuration.getConfig().website };
    res.render('index', websiteConfig);
});

app.use(express.urlencoded({ extended: true }));

app.post('/config', (req, res) => {
    const newConfig = { website: {} };
  
    for (const key in req.body) {
      newConfig.website[key] = req.body[key];
    }
    configuration.updateConfig(newConfig);
    res.redirect('/');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});