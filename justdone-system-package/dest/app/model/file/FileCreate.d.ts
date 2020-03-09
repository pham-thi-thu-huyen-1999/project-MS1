import IFile from "./interfaces/IFile";
import { FileType } from '../common/CommonType';
declare class FileCreate {
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
    constructor(model: IFile);
}
export default FileCreate;
