import IBaseModel from '../../common/interfaces/IBaseModel';
import {FileType} from '../../common/CommonType';

interface IFile extends IBaseModel {
    userId: any;
    productCode: number;
    parentId?: string;
    name: string;
    isFolder: boolean;
    size?: number;
    url?: string;
    type?: FileType;
    extension?: string;
    prefix?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export default IFile;
