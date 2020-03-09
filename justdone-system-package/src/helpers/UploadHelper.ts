import * as multer from 'multer';
import * as fs from 'fs';
import * as _ from 'lodash';
import {Config} from '../config';
import FileHelper from './FileHelper';

export default class UploadHelper {
    private static diskStorage = multer.diskStorage({
        destination: (req, file: any, callback: Function) => {
            let tmpPath = Config.PROJECT.UPLOAD.TMP_PATH;

            if (!fs.existsSync(tmpPath))
                fs.mkdirSync(tmpPath);

            callback(null, tmpPath);
        },
        filename: (req, file: any, callback: Function) => {
            let name = `${file.fieldname}.${file.originalname.split('.').pop()}`;
            callback(null, name);
        }
    });

    private static fileFilter = (req, file: any, options: any, callback: Function) => {
        if (!options.mimetype || options.mimetype.indexOf(file.mimetype) === -1)
            return callback(new TypeError('common.upload.extension'));

        return callback(null, true);
    }

    private static memoryStorage = multer.memoryStorage();

    public static upload(options: any): any {
        // init multer
        let upload = multer({
            storage: options.storage === 'memory' ? UploadHelper.memoryStorage : UploadHelper.diskStorage,
            fileFilter: (req: any, file: any, callback: Function) => {
                UploadHelper.fileFilter(req, file, options, callback);
            },
            limits: {
                fileSize: options.fileSize || Config.PROJECT.UPLOAD.SIZE
            }
        });

        let cpUpload: any;
        // detect option upload data;
        if (options.single)
            cpUpload = upload.single(options.single);
        else if (options.array)
            cpUpload = upload.array(options.array.fieldname, options.array.maxCount);
        else if (options.fields)
            cpUpload = upload.fields(options.fields);

        return (req: any, res: any, next) => {
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
                            let arrayFile: Array<object> = [];
                            _.forEach(file, f => {
                                f.extension = f.filename.split('.').pop();
                                f.originalNameWithoutExtension = FileHelper.getFileNameWithoutExtension(f.originalname);
                                arrayFile.push(f);
                            });
                        }
                        else {
                            file = _.isArray(file) ? file[0] : file;
                            file.extension = file.filename.split('.').pop();
                            file.originalNameWithoutExtension = FileHelper.getFileNameWithoutExtension(file.originalname);
                        }
                    });
                    if (req.file) {
                        req.file.extension = req.file.filename.split('.').pop();
                        req.file.originalNameWithoutExtension = FileHelper.getFileNameWithoutExtension(req.file.originalname);
                    }
                }
                return next();
            });
        };
    }
};
