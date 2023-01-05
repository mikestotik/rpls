#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const cli = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
    .strict()
    .alias({
    h: 'help',
    v: 'version'
})
    .options({
    tpl: { type: 'string', demandOption: true, description: 'Template directory' },
    outDir: { type: 'string', description: 'Out directory' },
    rw: { type: 'array', demandOption: true, description: 'Rewrite string. Example: <fromString>:<toString>' }
})
    .argv;
const getAllFiles = (dirPath, arrayOfFiles) => {
    const files = fs_1.default.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(file => {
        if (fs_1.default.statSync(dirPath + '/' + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
        }
        else {
            arrayOfFiles === null || arrayOfFiles === void 0 ? void 0 : arrayOfFiles.push(path_1.default.join(dirPath, '/', file));
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
        outFilePath = path_1.default.join(cli.outDir, '/', outFilePath);
    }
    const outFileDirPathList = outFilePath.split('/');
    const fileName = outFileDirPathList[outFileDirPathList.length - 1];
    fs_1.default.mkdirSync(outFilePath.replace(fileName, ''), { recursive: true });
    fs_1.default.copyFileSync(tplFilePath, outFilePath);
    fs_1.default.readFile(outFilePath, 'utf8', (error, data) => {
        if (error) {
            return console.log(error);
        }
        let result = data;
        cli.rw.map(i => i.split(':')).forEach(rw => {
            const re = new RegExp(rw[0], 'g');
            result = result.replace(re, rw[1]);
        });
        fs_1.default.writeFile(outFilePath, result, 'utf8', (err) => {
            if (err)
                return console.log(err);
        });
    });
});
