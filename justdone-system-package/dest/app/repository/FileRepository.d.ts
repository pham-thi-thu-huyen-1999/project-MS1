import IFile from '../model/file/interfaces/IFile';
import BaseRepository from './base/BaseRepository';
import FileCreate from '../model/file/FileCreate';
declare class FileRepository extends BaseRepository<IFile> {
    constructor();
    create(data: FileCreate): Promise<IFile>;
}
export default FileRepository;
