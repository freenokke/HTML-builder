const {stdout} = process;
const fs = require('fs');
const path = require('path');

const readline = require('node:readline');
const write = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const rl = readline.createInterface({
  input: process.stdin,
  output: write
});
stdout.write('Процесс записи запущен.\nВведите слова\n'); 
rl.on('line', (line) => {
  if (line.trim() === 'exit') process.exit(0);
  else write.write(`${line}\n`);
});
process.on('SIGINT', () => {
  process.exit(1);
});
process.on('exit', (code) => {
  if(code !== 0) stdout.write('Процесс завершен через Ctrl + C'); 
  else stdout.write('Процесс завершен через комманду "exit"'); 
});