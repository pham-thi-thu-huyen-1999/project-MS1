import IAbnBusiness from './interfaces/IAbnBusiness'; // eslint-disable-line
import {ErrorCommon} from 'justdone-system-package/dest/app/model/common/Error';
import AbnHelper from 'justdone-system-package/dest/helpers/AbnHelper';
// import module from 'justdone-system-package/dest/resources/permission/module';
// import Authenticator from 'justdone-system-package/dest/system/Authenticator';

class AbnBusiness implements IAbnBusiness {
    async abnLookUp(productCodeAuth: number, fromRoleCodeAuth: number, keyWord: string): Promise<any> {
        // if (! await Authenticator.checkPermission(module.ABN.claim.GET.code, productCodeAuth, fromRoleCodeAuth))
        //     throw new ErrorCommon(401);

        let lookupResult = await AbnHelper.abnLookup(keyWord);
        let entityName = '';
        let entityType = '';

        try {
            if (lookupResult.businessEntity201408.length > 0) {
                let infoABN = lookupResult.businessEntity201408[0];
                if (infoABN.legalName) {
                    entityName = infoABN.legalName[0].givenName[0] + ' ' + infoABN.legalName[0].familyName[0];
                    entityType = infoABN.entityType[0].entityDescription[0];
                }
                else {
                    entityName = infoABN.mainName[0].organisationName[0];
                    entityType = infoABN.entityType[0].entityDescription[0];
                }
            }
        }
        catch (error) {
            throw new ErrorCommon(101, 'Abn');
        }

        return {
            entityName: entityName,
            entityType: entityType
        };
    }

    async abnUKLookUp(keyWord: string): Promise<any> {
        // if (! await Authenticator.checkPermission(module.ABN.claim.GET.code, productCodeAuth, fromRoleCodeAuth))
        //     throw new ErrorCommon(401);

        return await AbnHelper.abnUKLookup(keyWord);
    }
}

Object.seal(AbnBusiness);
export default AbnBusiness;
