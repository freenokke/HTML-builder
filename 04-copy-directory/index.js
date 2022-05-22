const path = require('path');
const fs = require('fs');



try {
  (async () => {
    await fs.promises.mkdir(path.resolve(__dirname, 'copy-files'), {recursive: true});
    const copyFiles = await fs.promises.readdir(path.resolve(__dirname, 'copy-files'));
    const files = await fs.promises.readdir(path.resolve(__dirname, 'files'));
    if (copyFiles.length !== 0) {
      copyFiles.forEach((item) => {
        fs.promises.unlink(path.resolve(__dirname, 'copy-files', item));
      });
    }
    files.forEach((item) => {
      fs.promises.copyFile(path.resolve(__dirname, 'files', item), path.resolve(__dirname, 'copy-files', item));
    });
  })();
  console.log('The files have been copied');
} catch {
  console.log('The files could not be copied');
}


