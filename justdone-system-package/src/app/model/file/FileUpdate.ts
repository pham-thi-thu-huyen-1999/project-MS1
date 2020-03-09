import IFile from "./interfaces/IFile"; // eslint-disable-line

class FileUpdate {
    name: string;
    url?: string;
    prefix?: string;

    constructor(model: IFile) {
        if (!model)
            return;

        this.name = model.name;
        this.url = model.url;
        this.prefix = model.prefix;
    }
}

Object.seal(FileUpdate);
export default FileUpdate;
