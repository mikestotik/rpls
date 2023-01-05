"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const args = process.argv.slice(2);
const tplPath = './tpl';
const getAllFiles = (dirPath, arrayOfFiles) => {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(file => {
        if (fs.statSync(dirPath + '/' + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
        }
        else {
            arrayOfFiles === null || arrayOfFiles === void 0 ? void 0 : arrayOfFiles.push(path.join(__dirname, dirPath, '/', file));
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
        args.push('// @ts-nocheck:');
        args.push('// @ts-ignore:');
        args.forEach(arg => {
            const value = arg.split(':');
            const re = new RegExp(value[0], 'g');
            result = result.replace(re, value[1]);
        });
        fs.writeFile(filePath, result, 'utf8', (err) => {
            if (err)
                return console.log(err);
        });
    });
});
