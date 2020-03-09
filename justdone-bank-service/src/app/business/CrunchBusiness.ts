import BusinessLoader from '../../system/BusinessLoader';// eslint-disable-line
import ICrunchBusiness from './interfaces/ICrunchBusiness'; // eslint-disable-line
import CrunchRepository from 'justdone-system-package/dest/app/repository/CrunchRepository';
import Crunch from 'justdone-system-package/dest/app/model/crunch/Crunch';// eslint-disable-line
import CrunchCreate from 'justdone-system-package/dest/app/model/crunch/CrunchCreate';// eslint-disable-line
import {ProductCode} from 'justdone-system-package/dest/app/model/common/CommonType';// eslint-disable-line
class CrunchBusiness implements ICrunchBusiness {
    private crunchRepository: CrunchRepository;

    constructor() {
        this.crunchRepository = new CrunchRepository();
    }

    async create(data: CrunchCreate): Promise<any> {
        return await this.crunchRepository.create(data);
    }
}

Object.seal(CrunchBusiness);
export default CrunchBusiness;
