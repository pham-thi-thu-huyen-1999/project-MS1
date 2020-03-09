import * as _ from 'lodash';
import * as path from 'path';
import * as fs from 'fs';
import * as fse from 'fs-extra';
import {Config} from '../config';
import {FileType} from '../app/model/common/CommonType';
import * as request from 'request';
import * as mkdirp from 'mkdirp'; // eslint-disable-line
import * as pdf from 'html-pdf'; // eslint-disable-line

export default class FileHelper {
    static async toDataURL(url: string): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            request(
                {url: url, encoding: 'binary'}, ((error, imageResponse, imageBody) => {
                    if (error) reject(error);
                    let imageType = imageResponse.headers['content-type'];
                    let base64 = new Buffer(imageBody, 'binary').toString('base64');
                    resolve('data:' + imageType + ';base64,' + base64);
                })
            );
        });
    }

    static downloadFile(fileUrl: string, destPath: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let fileStreamer = fs.createWriteStream(destPath);
            let sendRequest = request.get(fileUrl);

            sendRequest.on('response', (response) => {
                if (response.statusCode !== 200)
                    reject(response);
            });

            // check for request errors
            sendRequest.on('error', function(err) {
                fs.unlink(destPath, (err) => {
                    reject(err);
                });
            });

            sendRequest.pipe(fileStreamer);
            fileStreamer.on('finish', async () => {
                fileStreamer.close();
                resolve();
            });
        });
    }

    static createDirPath(path: string): Promise<any> {
        return new Promise((resolve, reject) => {
            mkdirp(path, (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }

    static getFileTypeByExtension(extension: string): FileType | null {
        if ('png|jpg|jpeg|gif|svg'.split('|').indexOf(extension) >= 0)
            return FileType.Image;
        else if ('mp4|avi|3gp'.split('|').indexOf(extension) >= 0)
            return FileType.Video;
        else if ('doc|docx|xls|xlsx|pdf'.split('|').indexOf(extension) >= 0)
            return FileType.Document;
        else
            return FileType.Other;
    }

    static checkURLExist(url: string): Promise<boolean> {
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

    static move(src: string, dest: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (fse.existsSync(dest)) {
                // remove then move new file to
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
                // file not existed, only move file to
                fse.move(src, dest, err => {
                    if (err)
                        reject(err);
                    else
                        resolve(dest);
                });
            }
        });
    }

    static getFileNameFromUrlWithoutExtension(url: string): string {
        return url.slice(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
    }

    static getDirectories = function(sourcePath: string): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            fs.readdir(sourcePath, (err, list) => {
                if (err)
                    reject(err);
                else
                    resolve(list.filter(item => fs.statSync(path.join(sourcePath, item)).isDirectory()));
            });
        });
    }

    static getDirectoriesSync = function(sourcePath: string): string[] {
        return fs.readdirSync(sourcePath).filter(item => fs.statSync(path.join(sourcePath, item)).isDirectory());
    }

    static getFiles = function(sourcePath: string): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            fs.readdir(sourcePath, (err, list) => {
                if (err)
                    reject(err);
                else
                    resolve(list.filter(item => !fs.statSync(path.join(sourcePath, item)).isDirectory()));
            });
        });
    }

    static getFilesSync = function(sourcePath: string): string[] {
        return fs.readdirSync(sourcePath).filter(item => !fs.statSync(path.join(sourcePath, item)).isDirectory());
    }

    static getFileContent = (path):Promise<string> => {
        return new Promise((resolve, reject) => {
            fs.readFile(path, 'utf8', (err, data) => {
                if (err)
                    reject(err);
                else
                    resolve(data);
            });
        });
    }

    static writeFile = (path: string, content: string) => {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, content, (err) => {
                if (err)
                    reject(err);
                else
                    resolve(true);
            });
        });
    }

    static moveFilesByOwner = (idOwner: string, files: any, isVideo?: boolean, destPath?: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            let tasks: Promise<any>[] = [];
            let filePath = `${isVideo ? Config.PROJECT.UPLOAD.PATH_VIDEO : Config.PROJECT.UPLOAD.PATH_IMAGE}${idOwner}/${destPath || ''}`;
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
                let tmpFile = `${Config.PROJECT.UPLOAD.TMP_PATH}/${files}`;
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

    static removeFile = (sourcePath: string) => {
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
    }
}
