import Crunch from 'justdone-system-package/dest/app/model/crunch/Crunch'; // eslint-disable-line
import CrunchCreate from 'justdone-system-package/dest/app/model/crunch/CrunchCreate';// eslint-disable-line
import {ProductCode} from 'justdone-system-package/dest/app/model/common/CommonType';// eslint-disable-line
interface ICrunchBusiness {
    create: (data: CrunchCreate) => Promise<any>;
}

export default ICrunchBusiness;

