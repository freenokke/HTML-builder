const fs = require('fs');
const path = require('path');

const input = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

try {
  (async () => {
    const filesInDirectory = await fs.promises.readdir(path.join(__dirname, 'styles'));
    const cssFiles = filesInDirectory.filter(item => /\.css/.test(path.extname(item)));
    cssFiles.forEach(item => {
      fs.readFile(path.join(__dirname, 'styles', item), (err, data) => {
        if (err) console.log(err);
        input.write(data);
        input.write('\n');
        input.write('\n');
      });
    });
  })();
} catch (error) {
  console.log(error);
}
