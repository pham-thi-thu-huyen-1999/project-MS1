import File from 'justdone-system-package/dest/app/model/file/File';
import FileCreate from 'justdone-system-package/dest/app/model/file/FileCreate'; // eslint-disable-line
import FileUpdate from 'justdone-system-package/dest/app/model/file/FileUpdate'; // eslint-disable-line
import IFileBusiness from './interfaces/IFileBusiness'; // eslint-disable-line
import AccountingPdf from 'justdone-system-package/dest/app/model/accounting/AccountingPdf'; // eslint-disable-line
import AccountingHtml from 'justdone-system-package/dest/app/model/accounting/AccountingHtml'; // eslint-disable-line
import FileRepository from 'justdone-system-package/dest/app/repository/FileRepository';

class FileBusiness implements IFileBusiness {
    private fileRepository: FileRepository;

    constructor() {
        this.fileRepository = new FileRepository();
    }

    async get(_id: string): Promise<File | null> {
        if (!_id)
            return null;

        let file = await this.fileRepository.get(_id);
        return file && new File(file);
    }

    async create(data: any): Promise<any> {}
    async update(data: any): Promise<any> {}
    async delete(data: any): Promise<any> {}
}

Object.seal(FileBusiness);
export default FileBusiness;
