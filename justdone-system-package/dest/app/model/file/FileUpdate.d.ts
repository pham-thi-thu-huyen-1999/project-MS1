import IFile from "./interfaces/IFile";
declare class FileUpdate {
    name: string;
    url?: string;
    prefix?: string;
    constructor(model: IFile);
}
export default FileUpdate;
