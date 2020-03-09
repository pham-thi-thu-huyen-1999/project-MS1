"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const gsc = require("@google-cloud/storage");
class GoogleStorageHelper {
    static gscClient() {
        return gsc({
            projectId: config_1.Config.PROJECT.GOOGLE_STORAGE.PROJECT_ID,
            keyFilename: config_1.Config.PROJECT.GOOGLE_STORAGE.KEY_FILENAME
        });
    }
    static uploadFile(localFile, prefix, fileName, bucketName) {
        return new Promise((resolve, reject) => {
            let gscClient = this.gscClient();
            gscClient.bucket(bucketName)
                .upload(localFile, { destination: `${prefix}${fileName}`, public: true })
                .then(() => {
                let url = `/${bucketName}${prefix}${fileName}`;
                resolve(url);
            })
                .catch(err => {
                reject(err);
            });
        });
    }
    static uploadCrunch(localFile, prefix, fileName, bucketName) {
        return new Promise((resolve, reject) => {
            let gscClient = this.gscClient();
            gscClient.bucket(bucketName)
                .upload(localFile, { destination: `${fileName}`, public: true })
                .then((result) => {
                let url = result[0].metadata.mediaLink;
                resolve(url);
            })
                .catch(err => {
                reject(err);
            });
        });
    }
    static moveFile(sourceFile, newPath, bucketName) {
        return new Promise((resolve, reject) => {
            let gscClient = this.gscClient();
            gscClient
                .bucket(bucketName)
                .file(sourceFile)
                .move(newPath)
                .then(() => {
                let url = `/${bucketName}${newPath}`;
                resolve(url);
            })
                .catch(err => {
                reject(err);
            });
        });
    }
    static deleteFile(filePath, bucketName) {
        return new Promise((resolve, reject) => {
            let gscClient = this.gscClient();
            gscClient
                .bucket(bucketName)
                .file(filePath)
                .delete()
                .then(() => {
                resolve(true);
            })
                .catch(err => {
                resolve(false);
            });
        });
    }
    static getListFile(prefix, bucketName) {
        return new Promise((resolve, reject) => {
            const options = {
                prefix: prefix,
            };
            gsc.bucket(bucketName)
                .getFiles(options)
                .then(results => {
                const files = results[0];
                resolve(files);
            })
                .catch(err => {
                reject(err);
            });
        });
    }
    static getProductPrefix(productId) {
        return `/product/${productId}/`;
    }
    static getAccountingPrefix(ownerId, productCode, year) {
        return `/${ownerId}/${productCode}/${year}/accounting/`;
    }
    static getProfilePrefix(ownerId, productCode) {
        return `/${ownerId}/${productCode}/profile/`;
    }
    static getBillingPrefix(ownerId, productCode, year) {
        return `/${ownerId}/${productCode}/${year}/billing/`;
    }
    static getTransactionPrefix(ownerId, productCode, year, type) {
        return `/${ownerId}/${productCode}/${year}/transaction/${type}/`;
    }
    static getBalanceSheetPrefix(ownerId, productCode, year) {
        return `/${ownerId}/${productCode}/${year}/balance-sheet/`;
    }
    static getReceiptPrefix(ownerId, productCode, year) {
        return `/${ownerId}/${productCode}/${year}/transaction/cash_reciept/`;
    }
    static getEvidencedPrefix(ownerId, productCode, year, month) {
        return `/${ownerId}/${productCode}/${year}/${month}/general-journal/evidenced/`;
    }
}
exports.default = GoogleStorageHelper;
;
