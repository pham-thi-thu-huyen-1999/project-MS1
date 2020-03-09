import module from 'justdone-system-package/dest/resources/permission/module';
import {RoleCode} from 'justdone-system-package/dest/app/model/common/CommonType';

export function getPermissions(): {claim: number, fromRole: number, toRole: number | null}[] {
    return [
        /* ! Start system */
        {claim: module.SYSTEM.claim.ACCESS.code, fromRole: RoleCode.Client, toRole: null},
        /* ! End */

        /* ! Start Product */
        {claim: module.PRODUCT.claim.GET.code, fromRole: RoleCode.SuperAdmin, toRole: null},
        {claim: module.PRODUCT.claim.GET.code, fromRole: RoleCode.RegionAdmin, toRole: null},
        {claim: module.PRODUCT.claim.GET.code, fromRole: RoleCode.Supervisor, toRole: null},
        {claim: module.PRODUCT.claim.GET.code, fromRole: RoleCode.CaseManager, toRole: null},
        {claim: module.PRODUCT.claim.GET.code, fromRole: RoleCode.Client, toRole: null},
        /* ! End */

        /* ! Start Role */
        {claim: module.ROLE.claim.GET.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.Client},
        {claim: module.ROLE.claim.GET.code, fromRole: RoleCode.RegionAdmin, toRole: RoleCode.Client},
        {claim: module.ROLE.claim.GET.code, fromRole: RoleCode.Supervisor, toRole: RoleCode.Client},
        {claim: module.ROLE.claim.GET.code, fromRole: RoleCode.CaseManager, toRole: RoleCode.Client},
        /* ! End Role*/

        /* ! Start User */
        {claim: module.USER.claim.GET.code, fromRole: RoleCode.Client, toRole: null},
        {claim: module.USER.claim.UPDATE.code, fromRole: RoleCode.Client, toRole: null},
        /* ! End User */

        /* ! Start Manager */
        {claim: module.MANAGER.claim.GET_CLIENT.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.Client},
        {claim: module.MANAGER.claim.GET_CLIENT.code, fromRole: RoleCode.RegionAdmin, toRole: RoleCode.Client},
        {claim: module.MANAGER.claim.GET_CLIENT.code, fromRole: RoleCode.Supervisor, toRole: RoleCode.Client},
        {claim: module.MANAGER.claim.GET_CLIENT.code, fromRole: RoleCode.CaseManager, toRole: RoleCode.Client},
        {claim: module.MANAGER.claim.GET_CLIENT_PERSONAL_INFO.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.Client},
        {claim: module.MANAGER.claim.GET_CLIENT_PERSONAL_INFO.code, fromRole: RoleCode.RegionAdmin, toRole: RoleCode.Client},
        {claim: module.MANAGER.claim.GET_CLIENT_PERSONAL_INFO.code, fromRole: RoleCode.Supervisor, toRole: RoleCode.Client},
        {claim: module.MANAGER.claim.GET_CLIENT_PERSONAL_INFO.code, fromRole: RoleCode.CaseManager, toRole: RoleCode.Client},
        {claim: module.MANAGER.claim.GET_CLIENT_PERSONAL_INFO.code, fromRole: RoleCode.Client, toRole: null},
        {claim: module.MANAGER.claim.GET_CLIENT_CONNECTED_BANK.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.Client},
        {claim: module.MANAGER.claim.GET_CLIENT_CONNECTED_BANK.code, fromRole: RoleCode.RegionAdmin, toRole: RoleCode.Client},
        {claim: module.MANAGER.claim.GET_CLIENT_CONNECTED_BANK.code, fromRole: RoleCode.Supervisor, toRole: RoleCode.Client},
        {claim: module.MANAGER.claim.GET_CLIENT_CONNECTED_BANK.code, fromRole: RoleCode.CaseManager, toRole: RoleCode.Client},
        {claim: module.MANAGER.claim.CREATE_CLIENT.code, fromRole: RoleCode.SuperAdmin, toRole: null},
        {claim: module.MANAGER.claim.CREATE_CLIENT.code, fromRole: RoleCode.RegionAdmin, toRole: null},
        {claim: module.MANAGER.claim.CREATE_CLIENT.code, fromRole: RoleCode.Supervisor, toRole: null},
        {claim: module.MANAGER.claim.CREATE_CLIENT.code, fromRole: RoleCode.CaseManager, toRole: null},
        {claim: module.MANAGER.claim.UPDATE_CLIENT.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.Client},
        {claim: module.MANAGER.claim.UPDATE_CLIENT.code, fromRole: RoleCode.RegionAdmin, toRole: RoleCode.Client},
        {claim: module.MANAGER.claim.UPDATE_CLIENT.code, fromRole: RoleCode.Supervisor, toRole: RoleCode.Client},
        {claim: module.MANAGER.claim.UPDATE_CLIENT.code, fromRole: RoleCode.CaseManager, toRole: RoleCode.Client},
        {claim: module.MANAGER.claim.UPDATE_CLIENT_PERSONAL_INFO.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.Client},
        {claim: module.MANAGER.claim.UPDATE_CLIENT_PERSONAL_INFO.code, fromRole: RoleCode.RegionAdmin, toRole: RoleCode.Client},
        {claim: module.MANAGER.claim.UPDATE_CLIENT_PERSONAL_INFO.code, fromRole: RoleCode.Supervisor, toRole: RoleCode.Client},
        {claim: module.MANAGER.claim.UPDATE_CLIENT_PERSONAL_INFO.code, fromRole: RoleCode.CaseManager, toRole: RoleCode.Client},
        {claim: module.MANAGER.claim.UPDATE_CLIENT_BUSINESS_INFO.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.Client},
        {claim: module.MANAGER.claim.UPDATE_CLIENT_BUSINESS_INFO.code, fromRole: RoleCode.RegionAdmin, toRole: RoleCode.Client},
        {claim: module.MANAGER.claim.UPDATE_CLIENT_BUSINESS_INFO.code, fromRole: RoleCode.Supervisor, toRole: RoleCode.Client},
        {claim: module.MANAGER.claim.UPDATE_CLIENT_BUSINESS_INFO.code, fromRole: RoleCode.CaseManager, toRole: RoleCode.Client},
        {claim: module.MANAGER.claim.UPDATE_CLIENT_RECONNECT_BANK.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.Client},
        {claim: module.MANAGER.claim.UPDATE_CLIENT_RECONNECT_BANK.code, fromRole: RoleCode.RegionAdmin, toRole: RoleCode.Client},
        {claim: module.MANAGER.claim.UPDATE_CLIENT_RECONNECT_BANK.code, fromRole: RoleCode.Supervisor, toRole: RoleCode.Client},
        {claim: module.MANAGER.claim.UPDATE_CLIENT_RECONNECT_BANK.code, fromRole: RoleCode.CaseManager, toRole: RoleCode.Client},
        {claim: module.MANAGER.claim.DELETE_CLIENT.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.Client},
        /* ! End Manager */

        /* ! Start Statement */
        {claim: module.STATEMENT.claim.GET.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.Client},
        {claim: module.STATEMENT.claim.GET.code, fromRole: RoleCode.RegionAdmin, toRole: RoleCode.Client},
        {claim: module.STATEMENT.claim.GET.code, fromRole: RoleCode.Supervisor, toRole: RoleCode.Client},
        {claim: module.STATEMENT.claim.GET.code, fromRole: RoleCode.CaseManager, toRole: RoleCode.Client},
        {claim: module.STATEMENT.claim.GET.code, fromRole: RoleCode.Client, toRole: null},
        {claim: module.STATEMENT.claim.UPDATE.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.Client},
        {claim: module.STATEMENT.claim.UPDATE.code, fromRole: RoleCode.RegionAdmin, toRole: RoleCode.Client},
        {claim: module.STATEMENT.claim.UPDATE.code, fromRole: RoleCode.Supervisor, toRole: RoleCode.Client},
        {claim: module.STATEMENT.claim.UPDATE.code, fromRole: RoleCode.CaseManager, toRole: RoleCode.Client},
        {claim: module.STATEMENT.claim.UPDATE.code, fromRole: RoleCode.Client, toRole: null},
        /* ! End Statement */

        /* ! Start Transaction */
        {claim: module.TRANSACTION.claim.GET.code, fromRole: RoleCode.CaseManager, toRole: RoleCode.Client},
        {claim: module.TRANSACTION.claim.GET.code, fromRole: RoleCode.Supervisor, toRole: RoleCode.Client},
        {claim: module.TRANSACTION.claim.GET.code, fromRole: RoleCode.Client, toRole: null},
        /* ! End Transaction */

        /* ! Start Provider */
        {claim: module.PROVIDER.claim.GET.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.Client},
        {claim: module.PROVIDER.claim.GET.code, fromRole: RoleCode.RegionAdmin, toRole: RoleCode.Client},
        {claim: module.PROVIDER.claim.GET.code, fromRole: RoleCode.Supervisor, toRole: RoleCode.Client},
        {claim: module.PROVIDER.claim.GET.code, fromRole: RoleCode.CaseManager, toRole: RoleCode.Client},
        {claim: module.PROVIDER.claim.GET.code, fromRole: RoleCode.Client, toRole: null},
        /* ! End provider */

        /* ! Start Receipt */
        {claim: module.RECEIPT.claim.GET.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.Client},
        {claim: module.RECEIPT.claim.GET.code, fromRole: RoleCode.RegionAdmin, toRole: RoleCode.Client},
        {claim: module.RECEIPT.claim.GET.code, fromRole: RoleCode.Supervisor, toRole: RoleCode.Client},
        {claim: module.RECEIPT.claim.GET.code, fromRole: RoleCode.CaseManager, toRole: RoleCode.Client},
        {claim: module.RECEIPT.claim.GET.code, fromRole: RoleCode.Client, toRole: null},
        {claim: module.RECEIPT.claim.CREATE.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.Client},
        {claim: module.RECEIPT.claim.CREATE.code, fromRole: RoleCode.RegionAdmin, toRole: RoleCode.Client},
        {claim: module.RECEIPT.claim.CREATE.code, fromRole: RoleCode.Supervisor, toRole: RoleCode.Client},
        {claim: module.RECEIPT.claim.CREATE.code, fromRole: RoleCode.CaseManager, toRole: RoleCode.Client},
        {claim: module.RECEIPT.claim.CREATE.code, fromRole: RoleCode.Client, toRole: null},
        {claim: module.RECEIPT.claim.UPDATE.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.Client},
        {claim: module.RECEIPT.claim.UPDATE.code, fromRole: RoleCode.RegionAdmin, toRole: RoleCode.Client},
        {claim: module.RECEIPT.claim.UPDATE.code, fromRole: RoleCode.Supervisor, toRole: RoleCode.Client},
        {claim: module.RECEIPT.claim.UPDATE.code, fromRole: RoleCode.CaseManager, toRole: RoleCode.Client},
        {claim: module.RECEIPT.claim.UPDATE.code, fromRole: RoleCode.Client, toRole: null},
        {claim: module.RECEIPT.claim.DELETE.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.Client},
        {claim: module.RECEIPT.claim.DELETE.code, fromRole: RoleCode.RegionAdmin, toRole: RoleCode.Client},
        {claim: module.RECEIPT.claim.DELETE.code, fromRole: RoleCode.Supervisor, toRole: RoleCode.Client},
        {claim: module.RECEIPT.claim.DELETE.code, fromRole: RoleCode.CaseManager, toRole: RoleCode.Client},
        {claim: module.RECEIPT.claim.DELETE.code, fromRole: RoleCode.Client, toRole: null},
        /* ! End receipt */

        /* ! Start Financial */
        {claim: module.FINANCIAL.claim.GET.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.Client},
        {claim: module.FINANCIAL.claim.GET.code, fromRole: RoleCode.RegionAdmin, toRole: RoleCode.Client},
        {claim: module.FINANCIAL.claim.GET.code, fromRole: RoleCode.Supervisor, toRole: RoleCode.Client},
        {claim: module.FINANCIAL.claim.GET.code, fromRole: RoleCode.CaseManager, toRole: RoleCode.Client},
        {claim: module.FINANCIAL.claim.GET.code, fromRole: RoleCode.Client, toRole: null},
        {claim: module.FINANCIAL.claim.CREATE.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.Client},
        {claim: module.FINANCIAL.claim.CREATE.code, fromRole: RoleCode.RegionAdmin, toRole: RoleCode.Client},
        {claim: module.FINANCIAL.claim.CREATE.code, fromRole: RoleCode.Supervisor, toRole: RoleCode.Client},
        {claim: module.FINANCIAL.claim.CREATE.code, fromRole: RoleCode.CaseManager, toRole: RoleCode.Client},
        {claim: module.FINANCIAL.claim.CREATE.code, fromRole: RoleCode.Client, toRole: null},
        {claim: module.FINANCIAL.claim.UPDATE.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.Client},
        {claim: module.FINANCIAL.claim.UPDATE.code, fromRole: RoleCode.RegionAdmin, toRole: RoleCode.Client},
        {claim: module.FINANCIAL.claim.UPDATE.code, fromRole: RoleCode.Supervisor, toRole: RoleCode.Client},
        {claim: module.FINANCIAL.claim.UPDATE.code, fromRole: RoleCode.CaseManager, toRole: RoleCode.Client},
        {claim: module.FINANCIAL.claim.UPDATE.code, fromRole: RoleCode.Client, toRole: null},
        {claim: module.FINANCIAL.claim.DELETE.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.Client},
        {claim: module.FINANCIAL.claim.DELETE.code, fromRole: RoleCode.RegionAdmin, toRole: RoleCode.Client},
        {claim: module.FINANCIAL.claim.DELETE.code, fromRole: RoleCode.Supervisor, toRole: RoleCode.Client},
        {claim: module.FINANCIAL.claim.DELETE.code, fromRole: RoleCode.CaseManager, toRole: RoleCode.Client},
        {claim: module.FINANCIAL.claim.DELETE.code, fromRole: RoleCode.Client, toRole: null},
        /* ! End Financial */

        /* ! Start ABN */
        {claim: module.ABN.claim.GET.code, fromRole: RoleCode.Client, toRole: null},
        /* ! End ABN */

        /* ! Start Menu */
        {claim: module.MENU.claim.TRANSACTION.code, fromRole: RoleCode.Client, toRole: null},
        {claim: module.MENU.claim.BUSINESS_DETAIL.code, fromRole: RoleCode.Client, toRole: null},
        /* ! End Menu */

        /* ! Start Cruncher */
        {claim: module.CRUNCHER.claim.GET.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.Client},
        {claim: module.CRUNCHER.claim.GET.code, fromRole: RoleCode.RegionAdmin, toRole: RoleCode.Client},
        {claim: module.CRUNCHER.claim.GET.code, fromRole: RoleCode.Supervisor, toRole: RoleCode.Client},
        {claim: module.CRUNCHER.claim.GET.code, fromRole: RoleCode.CaseManager, toRole: RoleCode.Client},
        {claim: module.CRUNCHER.claim.GET.code, fromRole: RoleCode.ProductAdmin, toRole: RoleCode.Client},
        {claim: module.CRUNCHER.claim.UPDATE.code, fromRole: RoleCode.CaseManager, toRole: RoleCode.Client},
        {claim: module.CRUNCHER.claim.APPROVE.code, fromRole: RoleCode.Supervisor, toRole: RoleCode.Client},
        /* ! End Menu */

        {claim: module.CHART_OF_ACCOUNT.claim.GET.code, fromRole: RoleCode.SuperAdmin, toRole: null},
        {claim: module.CHART_OF_ACCOUNT.claim.GET.code, fromRole: RoleCode.Supervisor, toRole: null},
        {claim: module.CHART_OF_ACCOUNT.claim.GET.code, fromRole: RoleCode.CaseManager, toRole: null},
        {claim: module.CHART_OF_ACCOUNT.claim.GET.code, fromRole: RoleCode.RegionAdmin, toRole: null},
        // ++ add assign client to COA
        {claim: module.CHART_OF_ACCOUNT.claim.ASSIGN_CLIENT.code, fromRole: RoleCode.SuperAdmin, toRole: RoleCode.Client},
        // - add
    ];
};
