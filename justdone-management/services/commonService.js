import {RoleCode} from '~/common/commonType';
export default class CommonService {
    constructor(axios) {
        this.axios = axios;
    }

    getMenuList(menuClaim, clientId) {
        if (clientId) {
            return [
                {title: 'Bank Connection', link: `/client/${clientId}/bank-connection`, icon: 'icon-bank-connect', code: menuClaim.TRANSACTION.code},
                // {title: 'Transaction', link: `/client/${clientId}/transaction`, icon: 'icon-transaction', code: menuClaim.TRANSACTION.code},
                {title: 'Business Details', link: `/client/${clientId}/business-detail`, icon: 'icon-business', code: menuClaim.BUSINESS_DETAIL.code},
            ];
        }
        return [
            {title: 'Dashboard', link: '/dashboard', icon: 'icon-dashboard', code: menuClaim.DASHBOARD.code},
            {title: 'Product Management', link: '/product', icon: 'icon-product', code: menuClaim.PRODUCT_MANAGEMENT.code},
            {title: 'Team Management', link: '/team-management', icon: 'icon-team-management', code: menuClaim.TEAM_MANAGEMENT.code},
            {title: 'Client Management', link: '/client-management', icon: 'icon-client-management', code: menuClaim.CLIENT_MANAGEMENT.code},
            {title: 'File management', link: '/file-management', icon: 'icon-file-management'},
            {title: 'Chart of Account', link: '/chart-of-account', icon: 'icon-chart', code: menuClaim.CHART_OF_ACCOUNT.code},
            {title: 'Automation Crunch', link: '/auto-crunch', icon: 'icon-auto-crunch', code: menuClaim.AUTOMATION_CRUNCH.code},
            {title: 'Data Report', link: '/data-report', icon: 'icon-data-report', code: menuClaim.DATA_REPORT.code},
            {title: 'Financial Report ', link: '/financial-report/balance-sheet', icon: 'icon-financial'},
            // {title: 'Message', link: '/message', icon: 'icon-message', code: menuClaim.MESSAGE.code},
            {title: 'Server Information', link: '/server-information', icon: 'icon-server', code: menuClaim.SERVER_INFORMATION.code},
            // {title: 'Settings', link: '/setting', icon: 'icon-settings', code: menuClaim.SETTING.code}
        ];
    }

    getMenuTransactions(clientId) {
        let tabs = [
            {title: 'Bank Statement', link: '/client/_id/transaction?type=1'},
            {title: 'Credit Card', link: '/client/_id/transaction?type=2'}
        ];
        tabs.forEach(tab => {
            tab.link = tab.link.replace('_id', clientId);
        });
        return tabs;
    }

    getBusinessLinks(clientId) {
        let tabs = [
            {title: 'Personal Information', link: '/client/_id/business-detail/personal-information'},
            {title: 'Business Information', link: '/client/_id/business-detail/business-information'},
            // {title: 'Bank Information', link: '/client/_id/business-detail/bank-information'},
            // {title: 'Change Password', link: '/client/_id/business-detail/change-password'}
        ];
        tabs.forEach(tab => {
            tab.link = tab.link.replace('_id', clientId);
        });
        return tabs;
    }

    getProfileLinks() {
        let tabs = [
            {title: 'Personal Information', link: '/profile'},
            {title: 'Change Password', link: '/profile/change-password'},
        ];
        return tabs;
    }

    getAvatarLinks(userAuth) {
        let isClient = userAuth && userAuth.permission && userAuth.permission.role && userAuth.permission.role.code === RoleCode.Client;
        if (!isClient) {
            let tabs = [
                {title: 'My Profile', link: '/profile'},
                {title: 'Change Password', link: '/profile/change-password'},
            ];
            return tabs;
        }
        else {
            let tabs = [];
            return tabs;
        }
    }
}
