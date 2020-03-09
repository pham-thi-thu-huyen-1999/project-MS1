import ProductCreate from 'justdone-system-package/dest/app/model/product/ProductCreate';
import {ProductType, ProductCode} from 'justdone-system-package/dest/app/model/common/CommonType';

export default function getProducts(): {isRequired: boolean, data: ProductCreate}[] {
    return [
        {isRequired: true, data: <ProductCreate>{code: ProductCode.Management, config: {domain: 'https://ms-stag.precis.systems', colorScheme: 1, nameSupport: 'Server Name', emailSupport: 'servername@Namtech.com.au', financialYear: {beginMonth: 7, endMonth: 6}}, name: 'Management', type: ProductType.Management, isCompleted: true}},
        {isRequired: false, data: <ProductCreate>{code: ProductCode.Justdone, config: {domain: 'https://whitelabel.system/justdone', colorScheme: 1, nameSupport: 'Server Name', emailSupport: 'servername@Namtech.com.au', financialYear: {beginMonth: 7, endMonth: 6}}, name: 'Just Done', type: ProductType.Justdone, isCompleted: true}},
        {isRequired: false, data: <ProductCreate>{code: ProductCode.Precis, config: {clientLimit: -1, domain: 'https://fn-stag.precis.systems', colorScheme: 1, nameSupport: 'Server Name', emailSupport: 'servername@Namtech.com.au', financialYear: {beginMonth: 7, endMonth: 6}}, name: 'Precis', type: ProductType.FreshNumber, isCompleted: true, financeYear: {beginMonth: 7, endMonth: 6}}},
        {isRequired: false, data: <ProductCreate>{code: ProductCode.WhiteLabel, config: {clientLimit: -1, domain: 'https://wl-stag.precis.systems', colorScheme: 2, nameSupport: 'Server Name', emailSupport: 'servername@Namtech.com.au', financialYear: {beginMonth: 7, endMonth: 6}}, name: 'White Label', type: ProductType.WhiteLabel, isCompleted: true, financeYear: {beginMonth: 7, endMonth: 6}}},
    ];
};
