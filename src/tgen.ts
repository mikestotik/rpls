import * as fs from 'fs';
import * as path from 'path';


const args = process.argv.slice(2);

const tplPath = './tpl';

const getAllFiles = (dirPath: string, arrayOfFiles?: string[]): string[] => {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(file => {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
    } else {
      arrayOfFiles?.push(path.join(__dirname, dirPath, '/', file));
    }
  });
  return arrayOfFiles;
};

const tplFiles = getAllFiles(tplPath);

tplFiles.forEach(tplFilePath => {
  const filePath = tplFilePath
    .replace('tpl', 'result')
    .replace('entity', 'step')
    .replace('entity', 'step');

  const dirPathList = filePath.split('/');

  const fileName = dirPathList[dirPathList.length - 1];
  fs.mkdirSync(filePath.replace(fileName, ''), { recursive: true });
  fs.copyFileSync(tplFilePath, filePath);

  fs.readFile(filePath, 'utf8', (error, data) => {
    if (error) {
      return console.log(error);
    }

    let result = data;

    args.push('// @ts-nocheck:')
    args.push('// @ts-ignore:')

    args.forEach(arg => {
      const value = arg.split(':');
      const re = new RegExp(value[0], 'g');
      result = result.replace(re, value[1]);
    });

    fs.writeFile(filePath, result, 'utf8', (err) => {
      if (err) return console.log(err);
    });
  });
});