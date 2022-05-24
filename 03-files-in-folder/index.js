const fsp = require('fs/promises');
const fs = require('fs');
const path = require('path');

fsp.readdir(path.join(__dirname, 'secret-folder'))
  .then(data => {
    data.forEach(item => {
      fs.stat(path.join(__dirname, 'secret-folder', item), (err, stats) => {
        if (err) throw err;
        if (stats.isFile() === true) {
          const itemData = path.parse(item);
          const itemSize = stats.size; 
          console.log(`${itemData.name} - ${itemData.ext ? itemData.ext.slice(1) : 'file has no extension'} - ${itemSize} byte`);
        }
      });
    });
  }).catch(err => {
    console.log(err);
  });
