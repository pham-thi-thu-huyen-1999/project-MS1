import {RoleCode} from '~/common/commonType';

export default class CommonService {
    constructor(axios) {
        this.axios = axios;
    }

    getMenuList(menuClaim, userAuth, clientId) {
        let isClient = userAuth && userAuth.permission && userAuth.permission.role && userAuth.permission.role.code === RoleCode.Client;
        if (isClient) {
            return [
                {title: 'Transaction', link: `/transaction`, icon: 'icon-transaction', code: menuClaim.TRANSACTION.code},
                {title: 'Business Details', link: `/business-detail`, icon: 'icon-business', code: menuClaim.BUSINESS_DETAIL.code},
                {title: 'Message', link: '/message', icon: 'icon-message', code: menuClaim.MESSAGE.code},
            ];
        }
        if (clientId) {
            return [
                {title: 'Transaction', link: `/client/${clientId}/transaction`, icon: 'icon-transaction', code: menuClaim.TRANSACTION.code},
                {title: 'Business Details', link: `/client/${clientId}/business-detail`, icon: 'icon-business', code: menuClaim.BUSINESS_DETAIL.code},
            ];
        }
        return [
            {title: 'Dashboard', link: '/dashboard', icon: 'icon-dashboard', code: menuClaim.DASHBOARD.code},
            {title: 'Team Management', link: '/team-management', icon: 'icon-team-management', code: menuClaim.TEAM_MANAGEMENT.code},
            {title: 'Client Management', link: '/client-management', icon: 'icon-client-management', code: menuClaim.CLIENT_MANAGEMENT.code},
            {title: 'File Management', link: '/file-management', icon: 'icon-file-management'},
            {title: 'Data Report', link: '/data-report', icon: 'icon-data-report', code: menuClaim.DATA_REPORT.code},
            {title: 'Financial Report ', link: '/financial-report/balance-sheet', icon: 'icon-financial'},
            // {title: 'Message', link: '/message', icon: 'icon-message', code: menuClaim.MESSAGE.code},
            {title: 'Settings', link: '/setting', icon: 'icon-settings', code: menuClaim.SETTING.code}
        ];
    }

    getMenuTransactions(clientId) {
        let tabs = [
            {title: 'Bank Statement', link: '/client/_id/transaction?type=1'},
            {title: 'Credit Card', link: '/client/_id/transaction?type=2'}
        ];
        tabs.forEach(tab => {
            if (clientId)
                tab.link = tab.link.replace('_id', clientId);
            else
                tab.link = tab.link.replace('/client/_id', '');
        });
        return tabs;
    }

    getBusinessLinks(clientId) {
        let tabs;
        if (clientId) {
            tabs = [
                {title: 'Personal Information', link: '/client/_id/business-detail?tab=1'},
                {title: 'Business Information', link: '/client/_id/business-detail?tab=2'},
                {title: 'Bank Information', link: '/client/_id/business-detail?tab=3'},
            ];
        }
        else {
            tabs = [
                {title: 'Personal Information', link: '/client/_id/business-detail?tab=1'},
                {title: 'Business Information', link: '/client/_id/business-detail?tab=2'},
                {title: 'Bank Information', link: '/client/_id/business-detail?tab=3'},
                {title: 'Change Password', link: '/client/_id/business-detail?tab=4'}
            ];
        }

        tabs.forEach(tab => {
            if (clientId)
                tab.link = tab.link.replace('_id', clientId);
            else
                tab.link = tab.link.replace('/client/_id', '');
        });
        return tabs;
    }

    getSettingLinks() {
        let tabs = [
            {title: 'General settings', link: '/setting'},
            // {title: 'Cruncher template', link: '/setting/crunch-template'},
            // {title: 'SSL integration', link: '/setting/ssl-integration'},
        ];
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
