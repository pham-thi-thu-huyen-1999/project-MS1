import RoleCreate from 'justdone-system-package/dest/app/model/role/RoleCreate';
import {RoleCode} from 'justdone-system-package/dest/app/model/common/CommonType';
import {ProductType} from 'justdone-system-package/dest/app/model/common/CommonType';

export default function getRoles(): {isRequired: boolean, data: RoleCreate}[] {
    return [
        {isRequired: true, data: new RoleCreate(<any>{name: 'Super Administrator', code: RoleCode.SuperAdmin, level: 1, products: [ProductType.Management]})}, // administrator, justdone, white label, cunning fox
        {isRequired: true, data: new RoleCreate(<any>{name: 'Region Administrator', code: RoleCode.RegionAdmin, level: 2, products: [ProductType.Management]})}, // administrator, justdone, white label, cunning fox
        {isRequired: true, data: new RoleCreate(<any>{name: 'Product Administrator', code: RoleCode.ProductAdmin, level: 3, products: [ProductType.WhiteLabel]})}, // administrator, justdone, white label, cunning fox
        {isRequired: true, data: new RoleCreate(<any>{name: 'Product Manager', code: RoleCode.ProductManager, level: 4, products: [ProductType.WhiteLabel]})}, // administrator, justdone, white label, cunning fox
        {isRequired: true, data: new RoleCreate(<any>{name: 'Supervisor', code: RoleCode.Supervisor, level: 5, products: [ProductType.Management]})}, // white label
        {isRequired: true, data: new RoleCreate(<any>{name: 'Case Manager', code: RoleCode.CaseManager, level: 6, products: [ProductType.Management]})}, // administrator, justdone, white label, cunning fox
        {isRequired: true, data: new RoleCreate(<any>{name: 'Tax Agent', code: RoleCode.TaxAgent, level: 7, products: [ProductType.Management]})}, // administrator, justdone, cunning fox
        {isRequired: true, data: new RoleCreate(<any>{name: 'Client', code: RoleCode.Client, level: 8, products: [ProductType.FreshNumber, ProductType.WhiteLabel]})}, // administrator, justdone, precis, mobile, white label, cunning fox
    ];
};
