import IFile from './interfaces/IFile'; // eslint-disable-line
import {FileType} from '../common/CommonType';
import DataHelper from '../../../helpers/DataHelper';

class File {
    _id: string;
    userId: any;
    productCode: number;
    name: string;
    isFolder: boolean;
    parentId?: string;
    size?: number;
    url?: string;
    type?: FileType;
    extension?: string;
    prefix?: string;

    createdAt?: Date;
    updatedAt?: Date;

    constructor(model: IFile) {
        if (!model)
            return;

        this._id = DataHelper.handleIdDataModel(model._id);
        this.userId = DataHelper.handleIdDataModel(model.userId);
        this.productCode = model.productCode;
        this.name = model.name;
        this.size = model.size;
        this.isFolder = model.isFolder;
        this.parentId = model.parentId;
        this.url = model.url;
        this.type = model.type;
        this.extension = model.extension;
        this.prefix = model.prefix;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
    }

    static parseArray(list: IFile[]): File[] {
        return list && Array.isArray(list) ? list.map(item => new File(item)) : [];
    }
}

Object.seal(File);
export default File;
