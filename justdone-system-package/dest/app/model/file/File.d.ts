import IFile from './interfaces/IFile';
import { FileType } from '../common/CommonType';
declare class File {
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
    constructor(model: IFile);
    static parseArray(list: IFile[]): File[];
}
export default File;
