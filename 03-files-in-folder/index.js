const fsp = require('fs/promises');
const fs = require('fs');
const path = require('path');

function foo(place) {
  fsp.readdir(place)
    .then(data => {
      data.forEach(item => {
        fs.stat(path.join(place, item), (err, stats) => {
          if (err) throw err;
          if (stats.isFile() === false) {
            foo(path.join(place, item));
          } else {
            const itemData = path.parse(item);
            const itemSize = stats.size; 
            console.log(`${itemData.name} - ${itemData.ext ? itemData.ext : 'file has no extension'} - ${itemSize} byte`);
          }
        });
      });
    }).catch(err => {
      console.log(err);
    });
}

foo(__dirname);