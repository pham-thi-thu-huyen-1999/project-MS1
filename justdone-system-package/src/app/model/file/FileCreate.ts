import IFile from "./interfaces/IFile"; // eslint-disable-line
import {FileType} from '../common/CommonType';

class FileCreate {
    userId: string;
    productCode: number;
    name: string;
    isFolder: boolean;
    parentId?: string;
    size?: number;
    url?: string;
    type?: FileType;
    extension?: string;
    prefix?: string;

    constructor(model: IFile) {
        if (!model)
            return;

        this.userId = model.userId;
        this.productCode = model.productCode;
        this.name = model.name;
        this.size = model.size;
        this.isFolder = model.isFolder;
        this.parentId = model.parentId;
        this.url = model.url;
        this.type = model.type;
        this.extension = model.extension;
        this.prefix = model.prefix;
    }
}

Object.seal(FileCreate);
export default FileCreate;
