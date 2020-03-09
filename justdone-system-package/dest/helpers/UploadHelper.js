"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const multer = require("multer");
const fs = require("fs");
const _ = require("lodash");
const config_1 = require("../config");
const FileHelper_1 = require("./FileHelper");
class UploadHelper {
    static upload(options) {
        let upload = multer({
            storage: options.storage === 'memory' ? UploadHelper.memoryStorage : UploadHelper.diskStorage,
            fileFilter: (req, file, callback) => {
                UploadHelper.fileFilter(req, file, options, callback);
            },
            limits: {
                fileSize: options.fileSize || config_1.Config.PROJECT.UPLOAD.SIZE
            }
        });
        let cpUpload;
        if (options.single)
            cpUpload = upload.single(options.single);
        else if (options.array)
            cpUpload = upload.array(options.array.fieldname, options.array.maxCount);
        else if (options.fields)
            cpUpload = upload.fields(options.fields);
        return (req, res, next) => {
            if (!cpUpload)
                return next(new TypeError('common.upload.type'));
            cpUpload(req, res, error => {
                if (error) {
                    console.log(error);
                    console.log(('Invalid field: ' + error.field));
                    return next(new TypeError('common.upload.failed'));
                }
                if (options.storage !== 'memory') {
                    _.forEach(req.files, (file, key) => {
                        if (_.isArray(file)) {
                            let arrayFile = [];
                            _.forEach(file, f => {
                                f.extension = f.filename.split('.').pop();
                                f.originalNameWithoutExtension = FileHelper_1.default.getFileNameWithoutExtension(f.originalname);
                                arrayFile.push(f);
                            });
                        }
                        else {
                            file = _.isArray(file) ? file[0] : file;
                            file.extension = file.filename.split('.').pop();
                            file.originalNameWithoutExtension = FileHelper_1.default.getFileNameWithoutExtension(file.originalname);
                        }
                    });
                    if (req.file) {
                        req.file.extension = req.file.filename.split('.').pop();
                        req.file.originalNameWithoutExtension = FileHelper_1.default.getFileNameWithoutExtension(req.file.originalname);
                    }
                }
                return next();
            });
        };
    }
}
UploadHelper.diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        let tmpPath = config_1.Config.PROJECT.UPLOAD.TMP_PATH;
        if (!fs.existsSync(tmpPath))
            fs.mkdirSync(tmpPath);
        callback(null, tmpPath);
    },
    filename: (req, file, callback) => {
        let name = `${file.fieldname}.${file.originalname.split('.').pop()}`;
        callback(null, name);
    }
});
UploadHelper.fileFilter = (req, file, options, callback) => {
    if (!options.mimetype || options.mimetype.indexOf(file.mimetype) === -1)
        return callback(new TypeError('common.upload.extension'));
    return callback(null, true);
};
UploadHelper.memoryStorage = multer.memoryStorage();
exports.default = UploadHelper;
;
