import BaseController from './base/BaseController';
import BusinessLoader from '../system/BusinessLoader';
import IGeneralJournalBusiness from '../app/business/interfaces/IGeneralJournalBusiness'; // eslint-disable-line
import UploadHelper from 'justdone-system-package/dest/helpers/UploadHelper';
import FileHelper from 'justdone-system-package/dest/helpers/FileHelper';
import {ErrorCommon} from 'justdone-system-package/dest/app/model/common/Error';
import GeneralJournalItemCreate from 'justdone-system-package/dest/app/model/generalJournalItem/GeneralJournalItemCreate';
import Authenticator from 'justdone-system-package/dest/system/Authenticator';

const uploadEvidencedOpt = {
    mimetype: ['image/jpg', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf'],
    single: 'fileobject'
};
class GeneralJournalController extends BaseController {
    private generalJournalBusiness: IGeneralJournalBusiness = BusinessLoader.generalJournalBusiness;

    constructor() {
        super();

        this.get('/', this.getGeneralJournal.bind(this));
        this.get('/total', this.getGeneralJournalTotal.bind(this));
        this.get('/item', this.getGeneralJournalItem.bind(this));
        this.get('/total-item', this.getGeneralJournalItemTotal.bind(this));
        this.post('/', this.createGeneralJournal.bind(this));
        this.post('/item', this.createGeneralJournalItem.bind(this));
        this.put('/:id', this.updateGeneralJournal.bind(this));
        this.put('/update-date-general-journal/:id', this.updateDateGeneralJournal.bind(this));
        this.put('/item/:id', this.updateGeneralJournalItem.bind(this));
        this.put('/evidenced/:id', UploadHelper.upload(uploadEvidencedOpt), this.updateEvidenced.bind(this));
        this.patch('/:id', this.updateGeneralJournalNote.bind(this));
        this.delete('/:id', Authenticator.isAuthenticated, this.deleteGeneralJournal.bind(this));
        this.delete('/item/:id', Authenticator.isAuthenticated, this.deleteGeneralJournalItem.bind(this));
    }

    async updateDateGeneralJournal(req) {
        return await this.generalJournalBusiness.updateDateGeneralJournal(req.params.id, Number(req.body.month), Number(req.body.year));
    }

    async getGeneralJournal(req) {
        return await this.generalJournalBusiness.getGeneralJournal(req.query.userId, Number(req.query.beginMonth), Number(req.query.beginYear), Number(req.query.endMonth), Number(req.query.endYear), Number(req.query.page), Number(req.query.limit));
    }

    async getGeneralJournalTotal(req) {
        return await this.generalJournalBusiness.getGeneralJournalTotal(req.query.userId, Number(req.query.beginMonth), Number(req.query.beginYear), Number(req.query.endMonth), Number(req.query.endYear));
    }

    async getGeneralJournalItem(req) {
        return this.generalJournalBusiness.getGeneralJournalItem(req.query.gjId, Number(req.query.page), Number(req.query.limit));
    }

    async getGeneralJournalItemTotal(req) {
        return this.generalJournalBusiness.getGeneralJournalItemTotal(req.query.gjId);
    }

    async createGeneralJournal(req) {
        return await this.generalJournalBusiness.createGeneralJournalAndItems(req.body.userId, Number(req.body.month), Number(req.body.year), Number(req.body.beginYear), req.body.note, GeneralJournalItemCreate.parseArray(req.body.items));
    }

    async createGeneralJournalItem(req) {
        return await this.generalJournalBusiness.createGeneralJournalItem(new GeneralJournalItemCreate(req.body));
    }

    async updateGeneralJournal(req) {
        if (!req.params.id)
            throw new ErrorCommon(101, 'Request');
        return await this.generalJournalBusiness.updateGeneralJournal(req.params.id, req.body.data);
    }

    async updateGeneralJournalItem(req) {
        if (!req.params.id)
            throw new ErrorCommon(101, 'Request');
        return await this.generalJournalBusiness.updateGeneralJournalItem(req.params.id, req.body);
    }

    async updateGeneralJournalNote(req) {
        if (!req.params.id)
            throw new ErrorCommon(101, 'Request');
        return await this.generalJournalBusiness.updateGeneralJournalNote(req.params.id, req.body.note);
    }

    async updateEvidenced(req) {
        if (!req.params.id)
            throw new ErrorCommon(101, 'Request');
        const fileCreate = {
            name: req.file.originalNameWithoutExtension,
            size: req.file.size,
            type: FileHelper.getFileTypeByExtension(req.file.extension),
            extension: req.file.extension,
            url: req.file.filename
        };
        return await this.generalJournalBusiness.updateEvidenced(req.params.id, fileCreate);
    }

    async deleteGeneralJournal(req) {
        return await this.generalJournalBusiness.deleteGeneralJournal(req[Authenticator.userKey]._id, req.params.id);
    }

    async deleteGeneralJournalItem(req) {
        return await this.generalJournalBusiness.deleteGeneralJournalItem(req[Authenticator.userKey]._id, req.params.id);
    }
}

Object.seal(GeneralJournalController);
export default GeneralJournalController;
