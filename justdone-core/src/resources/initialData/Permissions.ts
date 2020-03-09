// import {ProductCode} from 'justdone-system-package/dest/app/model/common/CommonType';
import {ProductType} from 'justdone-system-package/dest/app/model/common/CommonType';
// import BusinessLoader from '../../system/BusinessLoader';

export async function getPermissions(productType: number): Promise<{product: number, claim: number, fromRole: number, toRole: number | null}[]> {
    let requireObj;

    switch (productType) {
    case 1:
        requireObj = require(`../templates/permission/Management`);
        break;
    case 3:
        requireObj = require(`../templates/permission/FreshNumber`);
        break;
    case 4:
        requireObj = require(`../templates/permission/WhiteLabel`);
        break;
    default:
        break;
    }
    let list = requireObj && requireObj.getPermissions() || [];
    return list;

    // return [
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.ABN.claim.GET.code, fromRole: RoleCode.Client, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.SYSTEM.claim.ACCESS.code, fromRole: RoleCode.ProductAdmin, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.SYSTEM.claim.ACCESS.code, fromRole: RoleCode.SuperAdmin, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.SYSTEM.claim.ACCESS.code, fromRole: RoleCode.ProductManager, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.SYSTEM.claim.ACCESS.code, fromRole: RoleCode.Client, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.MANAGER.claim.GET.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.RegionAdmin}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.MANAGER.claim.GET.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.ProductAdmin}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.MANAGER.claim.GET.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.ProductManager}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.MANAGER.claim.GET.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.Supervisor}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.MANAGER.claim.GET.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.CaseManager}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.MANAGER.claim.GET.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.TaxAgent}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.MANAGER.claim.GET_CLIENT.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.Client}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.MANAGER.claim.GET_CLIENT.code, fromRole: RoleCode.ProductAdmin, toRole: RoleCode.Client}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.MANAGER.claim.GET_CLIENT.code, fromRole: RoleCode.ProductManager, toRole: RoleCode.Client}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.USER.claim.GET.code, fromRole: RoleCode.Client, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.ROLE.claim.GET.code, fromRole: RoleCode.SuperAdmin, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.ROLE.claim.GET.code, fromRole: RoleCode.RegionAdmin, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.ROLE.claim.GET.code, fromRole: RoleCode.ProductAdmin, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.ROLE.claim.GET.code, fromRole: RoleCode.ProductManager, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.ROLE.claim.GET.code, fromRole: RoleCode.Supervisor, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.ROLE.claim.GET.code, fromRole: RoleCode.CaseManager, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.ROLE.claim.GET.code, fromRole: RoleCode.TaxAgent, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.MENU.claim.TRANSACTION.code, fromRole: RoleCode.Client, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.MENU.claim.BUSINESS_DETAIL.code, fromRole: RoleCode.Client, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.MENU.claim.DASHBOARD.code, fromRole: RoleCode.SuperAdmin, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.MENU.claim.DASHBOARD.code, fromRole: RoleCode.ProductAdmin, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.MENU.claim.DASHBOARD.code, fromRole: RoleCode.ProductManager, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.MENU.claim.TEAM_MANAGEMENT.code, fromRole: RoleCode.SuperAdmin, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.MENU.claim.TEAM_MANAGEMENT.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.ProductAdmin}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.MENU.claim.TEAM_MANAGEMENT.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.ProductManager}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.MENU.claim.TEAM_MANAGEMENT.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.CaseManager}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.MENU.claim.TEAM_MANAGEMENT.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.Supervisor}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.MENU.claim.TEAM_MANAGEMENT.code, fromRole: RoleCode.ProductAdmin, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.MENU.claim.TEAM_MANAGEMENT.code, fromRole: RoleCode.ProductManager, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.MENU.claim.TEAM_MANAGEMENT.code, fromRole: RoleCode.ProductAdmin, toRole: RoleCode.ProductManager}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.MENU.claim.CLIENT_MANAGEMENT.code, fromRole: RoleCode.SuperAdmin, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.MENU.claim.CLIENT_MANAGEMENT.code, fromRole: RoleCode.ProductAdmin, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.MENU.claim.CLIENT_MANAGEMENT.code, fromRole: RoleCode.ProductManager, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.MENU.claim.DATA_REPORT.code, fromRole: RoleCode.ProductAdmin, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.MENU.claim.DATA_REPORT.code, fromRole: RoleCode.ProductManager, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.MENU.claim.SETTING.code, fromRole: RoleCode.ProductAdmin, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.WhiteLabel, claim: module.MENU.claim.SETTING.code, fromRole: RoleCode.ProductManager, toRole: null}},

    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.ROLE.claim.GET.code, fromRole: RoleCode.SuperAdmin, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.ROLE.claim.GET.code, fromRole: RoleCode.RegionAdmin, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.ROLE.claim.GET.code, fromRole: RoleCode.ProductAdmin, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.ROLE.claim.GET.code, fromRole: RoleCode.ProductManager, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.ROLE.claim.GET.code, fromRole: RoleCode.Supervisor, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.ROLE.claim.GET.code, fromRole: RoleCode.CaseManager, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.ROLE.claim.GET.code, fromRole: RoleCode.TaxAgent, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.MANAGER.claim.GET.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.RegionAdmin}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.MANAGER.claim.GET.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.ProductAdmin}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.MANAGER.claim.GET.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.ProductManager}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.MANAGER.claim.GET.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.Supervisor}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.MANAGER.claim.GET.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.CaseManager}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.MANAGER.claim.GET.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.TaxAgent}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.MENU.claim.DASHBOARD.code, fromRole: RoleCode.SuperAdmin, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.MENU.claim.PRODUCT_MANAGEMENT.code, fromRole: RoleCode.SuperAdmin, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.MENU.claim.CLIENT_MANAGEMENT.code, fromRole: RoleCode.SuperAdmin, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.MENU.claim.MESSAGE.code, fromRole: RoleCode.SuperAdmin, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.MENU.claim.SERVER_INFORMATION.code, fromRole: RoleCode.SuperAdmin, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.MENU.claim.DATA_REPORT.code, fromRole: RoleCode.SuperAdmin, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.MENU.claim.CHART_OF_ACCOUNT.code, fromRole: RoleCode.SuperAdmin, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.MENU.claim.SETTING.code, fromRole: RoleCode.SuperAdmin, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.MENU.claim.TEAM_MANAGEMENT.code, fromRole: RoleCode.Supervisor, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.MENU.claim.CLIENT_MANAGEMENT.code, fromRole: RoleCode.Supervisor, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.MENU.claim.MESSAGE.code, fromRole: RoleCode.Supervisor, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.MENU.claim.SERVER_INFORMATION.code, fromRole: RoleCode.Supervisor, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.MENU.claim.DATA_REPORT.code, fromRole: RoleCode.Supervisor, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.MENU.claim.CHART_OF_ACCOUNT.code, fromRole: RoleCode.Supervisor, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.MENU.claim.SETTING.code, fromRole: RoleCode.Supervisor, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.MENU.claim.CLIENT_MANAGEMENT.code, fromRole: RoleCode.CaseManager, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.MENU.claim.MESSAGE.code, fromRole: RoleCode.CaseManager, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.MENU.claim.SERVER_INFORMATION.code, fromRole: RoleCode.CaseManager, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.MENU.claim.DATA_REPORT.code, fromRole: RoleCode.CaseManager, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.MENU.claim.CHART_OF_ACCOUNT.code, fromRole: RoleCode.CaseManager, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.MENU.claim.SETTING.code, fromRole: RoleCode.CaseManager, toRole: null}},

    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.MENU.claim.TEAM_MANAGEMENT.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.RegionAdmin}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.MENU.claim.TEAM_MANAGEMENT.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.ProductAdmin}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.MENU.claim.TEAM_MANAGEMENT.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.ProductManager}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.MENU.claim.TEAM_MANAGEMENT.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.Supervisor}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.MENU.claim.TEAM_MANAGEMENT.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.CaseManager}},

    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.MENU.claim.TEAM_MANAGEMENT.code, fromRole: RoleCode.ProductAdmin, toRole: null}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.MENU.claim.TEAM_MANAGEMENT.code, fromRole: RoleCode.ProductAdmin, toRole: RoleCode.ProductAdmin}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.MENU.claim.TEAM_MANAGEMENT.code, fromRole: RoleCode.ProductAdmin, toRole: RoleCode.Supervisor}},
    //     {isRequired: true, data: <any>{product: ProductCode.Management, claim: module.MENU.claim.TEAM_MANAGEMENT.code, fromRole: RoleCode.ProductAdmin, toRole: RoleCode.CaseManager}},
    // ];
};

export async function getPermissionsByProductType(productType: number, productCode: number): Promise<{product: number, claim: number, fromRole: number, toRole: number | null}[]> {
    if (!productCode || !productType)
        return [];

    let permissions = <{product: number, claim: number, fromRole: number, toRole: number | null}[]>[];
    let productName = ProductType[productType];
    let requireObj;
    try {
        requireObj = require(`../templates/permission/${productName}`);
    }
    catch {
        return [];
    }

    if (requireObj) {
        let list = requireObj.getPermissions();
        for (let j = 0; j < list.length; j++) {
            list[j].product = productCode;
            permissions.push(list[j]);
        }
    }
    return permissions;
};
