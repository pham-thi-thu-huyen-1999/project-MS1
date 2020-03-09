import IBaseModel from '../../common/interfaces/IBaseModel';

interface IMagicLink extends IBaseModel {
    userId: any;
    productCode: number;
    folderId: string;
    expiredAt: Date;
}

export default IMagicLink;
