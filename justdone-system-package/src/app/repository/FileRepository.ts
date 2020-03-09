import IFile from '../model/file/interfaces/IFile'; // eslint-disable-line
import FileSchema from '../dataAccess/schemas/FileSchema';
import BaseRepository from './base/BaseRepository';
import FileCreate from '../model/file/FileCreate'; // eslint-disable-line
import FileUpdate from '../model/file/FileUpdate'; // eslint-disable-line

class FileRepository extends BaseRepository<IFile> {
    constructor() {
        super(FileSchema);
    }

    async create(data: FileCreate): Promise<IFile> {
        return await super.create(data);
    }
}

Object.seal(FileRepository);
export default FileRepository;
