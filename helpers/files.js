// requiring path and fs modules
const path = require('path');
const fs = require('fs');
const logger = require('../logger/logger');

const configDir = path.join(__dirname, '../preset-config/');

function GetConfig() {
  const configFiles = [];
  let files;
  try {
    files = fs.readdirSync(configDir);
  } catch (err) {
    logger.error('GetConfigFiles', { error: err });
    return;
  }
  try {
    files.forEach((file) => {
      if (file !== 'global.json') {
        const fileContent = fs.readFileSync(configDir + file, 'utf-8');
        const fileJSON = JSON.parse(fileContent);
        configFiles.push({ fileName: file, name: fileJSON.name });
      }
    });
  } catch (err) {
    logger.error('GetConfigFiles', { error: err });
  }

  return configFiles;
}

module.exports = { GetConfig };
