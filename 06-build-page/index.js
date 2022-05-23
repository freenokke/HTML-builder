const fs = require('fs');
const path = require('path');



async function loadFiles(place) {
  const files = await fs.promises.readdir(place);
  files.forEach(item => {
    fs.stat(path.join(place, item), (err, stats) => {
      if (err) throw err;
      if (stats.isFile() === false) {
        fs.promises.mkdir(path.resolve(__dirname, 'project-dist', 'assets', item), {recursive: true});
        loadFiles(path.join(place, item));
      } else {
        if(/\.jpg/.test(item)) {
          fs.promises.copyFile(path.resolve(place, item), path.resolve(__dirname, 'project-dist', 'assets', 'img', item));
        } else if (/\.svg/.test(item)) {
          fs.promises.copyFile(path.resolve(place, item), path.resolve(__dirname, 'project-dist', 'assets', 'svg', item));
        } else if (/\.woff/.test(item)) {
          fs.promises.copyFile(path.resolve(place, item), path.resolve(__dirname, 'project-dist', 'assets', 'fonts', item));
        } 
      }
    });
  });
}

async function mergeStyles() {
  const filesInDirectory = await fs.promises.readdir(path.join(__dirname, 'styles'));
  const cssFiles = filesInDirectory.filter(item => /\.css/.test(path.extname(item)));
  const input = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
  cssFiles.forEach(item => {
    fs.readFile(path.join(__dirname, 'styles', item), (err, data) => {
      if (err) console.log(err);
      input.write(data);
      input.write('\n');
      input.write('\n');
    });
  });
}

async function insertLayout(componentToInsert, template) {
  const component = await fs.promises.readFile(path.resolve(__dirname, 'components', `${componentToInsert}.html`), {encoding: 'utf-8'});
  // console.log(component)
  let newStr = template.replace(`{{${componentToInsert}}}`, component);
  return newStr;
}

async function checkOnVoid(place) {
  const directory = await fs.promises.readdir(place);
  if (directory.length != 0) {
    for (const item of directory) {
      const file = await fs.promises.stat(path.join(place, item));
      if(file.isFile()) {
        await fs.promises.unlink(path.resolve(place, item));
      } else {
        await fs.promises.rm(path.resolve(place, item), {recursive: true, force: true});
      }
    }
  }
}

try {
  (async () => {
    await fs.promises.mkdir(path.resolve(__dirname, 'project-dist'), {recursive: true});
    await checkOnVoid(path.resolve(__dirname, 'project-dist'));
    let template = await fs.promises.readFile(path.resolve(__dirname, 'template.html'), {encoding: 'utf-8'});
    await fs.promises.mkdir(path.resolve(__dirname, 'project-dist', 'assets'), {recursive: true});
    mergeStyles();
    loadFiles(path.join(__dirname, 'assets'));
    if (/\{\{header\}\}/.test(template)) {
      const record = await insertLayout('header', template);
      template = record;
    }
    if (/\{\{articles\}\}/.test(template)) {
      const record = await insertLayout('articles', template);
      template = record;
    }
    if (/\{\{footer\}\}/.test(template)) {
      const record = await insertLayout('footer', template);
      template = record;
    }
    if (/\{\{about\}\}/.test(template)) {
      const record = await insertLayout('about', template);
      template = record;
    }
    
    await fs.promises.appendFile(path.resolve(__dirname, 'project-dist', 'index.html'), template);
    
    

  })();
} catch(error) {
  console.log(error);
}
