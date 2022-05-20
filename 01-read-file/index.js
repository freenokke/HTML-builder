const fs  = require('fs');
const path = require('path');
const { stdout } = process;

const stream = fs.createReadStream(path.join(__dirname, 'text.txt'));
let finalString = '';
stream.on('data', (chunk) => {
  finalString += chunk;
});
stream.on('end', () => {
  stdout.write(finalString);
});