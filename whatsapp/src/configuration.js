const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, '../config', 'default.json');
let cachedConfig = null;

const getConfig = () => {
  if (!cachedConfig) {
    cachedConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }
  return cachedConfig;
};

const updateConfig = (newConfig) => {
  try {
    fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));
    cachedConfig = newConfig;
  } catch (error) {
    console.log("Error writing config file: " + error);
    return;
  }

  console.log("Saved config file to: " + configPath);
};

module.exports = { getConfig, updateConfig };