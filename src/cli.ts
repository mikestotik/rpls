#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';


interface Commands {
  tpl: string;
  outDir: string;
  rw: string[];
}


const cli: Commands = yargs(hideBin(process.argv))
  .strict()
  .alias({
    h: 'help',
    v: 'version'
  })
  .options({
    tpl: { type: 'string', demandOption: true, description: 'Template directory' },
    outDir: { type: 'string', description: 'Out directory', default: './' },
    rw: { type: 'array', demandOption: true, description: 'Rewrite string. Example: <fromString>:<toString>' }
  })
  .argv as Commands;


const getAllFiles = (dirPath: string, arrayOfFiles?: string[]): string[] => {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(file => {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
    } else {
      arrayOfFiles?.push(path.join(dirPath, '/', file));
    }
  });
  return arrayOfFiles;
};

getAllFiles(cli.tpl).forEach(tplFilePath => {
  let outFilePath = tplFilePath;

  cli.rw.map(i => i.split(':')).forEach(rw => {
    const re = new RegExp(rw[0], 'g');
    outFilePath = outFilePath.replace(re, rw[1]);
  });

  if (cli.outDir) {
    outFilePath = path.join(cli.outDir, '/', outFilePath);
  }

  const outFileDirPathList = outFilePath.split('/');
  const fileName = outFileDirPathList[outFileDirPathList.length - 1];
  fs.mkdirSync(outFilePath.replace(fileName, ''), { recursive: true });
  fs.copyFileSync(tplFilePath, outFilePath);

  fs.readFile(outFilePath, 'utf8', (error, data) => {
    if (error) {
      return console.log(error);
    }

    let result = data;

    cli.rw.map(i => i.split(':')).forEach(rw => {
      const re = new RegExp(rw[0], 'g');
      result = result.replace(re, rw[1]);
    });

    fs.writeFile(outFilePath, result, 'utf8', (err) => {
      if (err) return console.log(err);
    });
  });
});
