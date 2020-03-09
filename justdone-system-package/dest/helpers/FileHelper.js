"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const path = require("path");
const fs = require("fs");
const fse = require("fs-extra");
const config_1 = require("../config");
const CommonType_1 = require("../app/model/common/CommonType");
const request = require("request");
const mkdirp = require("mkdirp");
class FileHelper {
    static toDataURL(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                request({ url: url, encoding: 'binary' }, ((error, imageResponse, imageBody) => {
                    if (error)
                        reject(error);
                    let imageType = imageResponse.headers['content-type'];
                    let base64 = new Buffer(imageBody, 'binary').toString('base64');
                    resolve('data:' + imageType + ';base64,' + base64);
                }));
            }));
        });
    }
    static downloadFile(fileUrl, destPath) {
        return new Promise((resolve, reject) => {
            let fileStreamer = fs.createWriteStream(destPath);
            let sendRequest = request.get(fileUrl);
            sendRequest.on('response', (response) => {
                if (response.statusCode !== 200)
                    reject(response);
            });
            sendRequest.on('error', function (err) {
                fs.unlink(destPath, (err) => {
                    reject(err);
                });
            });
            sendRequest.pipe(fileStreamer);
            fileStreamer.on('finish', () => __awaiter(this, void 0, void 0, function* () {
                fileStreamer.close();
                resolve();
            }));
        });
    }
    static createDirPath(path) {
        return new Promise((resolve, reject) => {
            mkdirp(path, (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
    static getFileTypeByExtension(extension) {
        if ('png|jpg|jpeg|gif|svg'.split('|').indexOf(extension) >= 0)
            return CommonType_1.FileType.Image;
        else if ('mp4|avi|3gp'.split('|').indexOf(extension) >= 0)
            return CommonType_1.FileType.Video;
        else if ('doc|docx|xls|xlsx|pdf'.split('|').indexOf(extension) >= 0)
            return CommonType_1.FileType.Document;
        else
            return CommonType_1.FileType.Other;
    }
    static checkURLExist(url) {
        return new Promise((resolve) => {
            fs.exists(url, exists => {
                if (exists)
                    resolve(true);
                else
                    resolve(false);
            });
        });
    }
    static getFileNameWithoutExtension(filePath) {
        let start = filePath.lastIndexOf('/') >= 0 ? filePath.lastIndexOf('/') + 1 : 0;
        let end = filePath.lastIndexOf('.') >= 0 ? filePath.lastIndexOf('.') : filePath.length;
        if (start >= end)
            return '';
        return filePath.slice(start, end);
    }
    static updateFileNameFromUrl(fileUrl, newName) {
        newName = newName.replace(/\s/g, '_');
        let fileName = this.getFileNameWithoutExtension(fileUrl);
        fileName = fileUrl.replace(fileName, newName);
        return fileName;
    }
    static move(src, dest) {
        return new Promise((resolve, reject) => {
            if (fse.existsSync(dest)) {
                fse.remove(dest, err => {
                    if (err)
                        return reject(err);
                    fse.move(src, dest, err => {
                        if (err)
                            reject(err);
                        else
                            resolve(dest);
                    });
                });
            }
            else {
                fse.move(src, dest, err => {
                    if (err)
                        reject(err);
                    else
                        resolve(dest);
                });
            }
        });
    }
    static getFileNameFromUrlWithoutExtension(url) {
        return url.slice(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
    }
}
FileHelper.getDirectories = function (sourcePath) {
    return new Promise((resolve, reject) => {
        fs.readdir(sourcePath, (err, list) => {
            if (err)
                reject(err);
            else
                resolve(list.filter(item => fs.statSync(path.join(sourcePath, item)).isDirectory()));
        });
    });
};
FileHelper.getDirectoriesSync = function (sourcePath) {
    return fs.readdirSync(sourcePath).filter(item => fs.statSync(path.join(sourcePath, item)).isDirectory());
};
FileHelper.getFiles = function (sourcePath) {
    return new Promise((resolve, reject) => {
        fs.readdir(sourcePath, (err, list) => {
            if (err)
                reject(err);
            else
                resolve(list.filter(item => !fs.statSync(path.join(sourcePath, item)).isDirectory()));
        });
    });
};
FileHelper.getFilesSync = function (sourcePath) {
    return fs.readdirSync(sourcePath).filter(item => !fs.statSync(path.join(sourcePath, item)).isDirectory());
};
FileHelper.getFileContent = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
};
FileHelper.writeFile = (path, content) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, content, (err) => {
            if (err)
                reject(err);
            else
                resolve(true);
        });
    });
};
FileHelper.moveFilesByOwner = (idOwner, files, isVideo, destPath) => {
    return new Promise((resolve, reject) => {
        let tasks = [];
        let filePath = `${isVideo ? config_1.Config.PROJECT.UPLOAD.PATH_VIDEO : config_1.Config.PROJECT.UPLOAD.PATH_IMAGE}${idOwner}/${destPath || ''}`;
        fse.ensureDirSync(filePath);
        if (_.isArray(files)) {
            _.forEach(files, (file, key) => {
                if (_.isArray(file)) {
                    _.forEach(file, f => {
                        let fileName = f.filename;
                        let tmpFile = f.path;
                        let mediaFile = `${filePath}/${fileName}`;
                        tasks.push(FileHelper.move(tmpFile, mediaFile));
                    });
                }
                else {
                    let fileName = file.filename;
                    let tmpFile = file.path;
                    let mediaFile = `${filePath}/${fileName}`;
                    tasks.push(FileHelper.move(tmpFile, mediaFile));
                }
            });
        }
        else {
            let tmpFile = `${config_1.Config.PROJECT.UPLOAD.TMP_PATH}/${files}`;
            let mediaFile = `${filePath}/${files}`;
            tasks.push(FileHelper.move(tmpFile, mediaFile));
        }
        Promise.all(tasks).then(values => {
            resolve(true);
        }, err => {
            console.error(err);
            resolve(false);
        });
    });
};
FileHelper.removeFile = (sourcePath) => {
    if (fse.existsSync(sourcePath)) {
        fse.remove(sourcePath, err => {
            if (err) {
                console.log('error remove file', err);
                return;
            }
            return;
        });
    }
    else {
        return;
    }
};
exports.default = FileHelper;
