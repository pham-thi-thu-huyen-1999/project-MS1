export default ({app, redirect, route, store, params}, inject) => {
    let isAuthenticated = () => {
        let userAuth = store.state.userAuth;
        if (userAuth && userAuth.user && userAuth.user.token && userAuth.user.token.tokenExpire && userAuth.permission && userAuth.accessToken) {
            let expire = new Date(userAuth.user.token.tokenExpire);
            if (expire >= new Date())
                return true;
        }
        return false;
    };

    let isRoles = (...roles) => {
        let userAuth = store.state.userAuth;
        if (userAuth && userAuth.permission && userAuth.permission.role && roles.find(roleName => roleName.toLowerCase() === userAuth.permission.role.name.toLowerCase()))
            return true;
        return false;
    };

    let checkStoragePermission = () => {
        if (process.browser && store.state.userAuth && !store.state.userAuth.permission.claims && !store.state.userAuth.permission.customs) {
            let claimPermissions = JSON.parse(localStorage.getItem(store.state.claimPermissionKey));
            let customPermissions = JSON.parse(localStorage.getItem(store.state.customPermissionKey));

            if (!claimPermissions && !customPermissions) {
                store.commit('SET_AUTH_USER', null);
                return;
            }
            let data = {
                claimPermissions: claimPermissions || [],
                customPermissions: customPermissions || [],
            };
            store.commit('SET_PERMISSION', data);
        }
    };

    let checkPermission = (claimCode, toRole) => {
        if (!store.state.userAuth || !claimCode)
            return false;
        checkStoragePermission();

        let claimPermissions = store.state.userAuth.permission && store.state.userAuth.permission.claims;
        let customPermissions = store.state.userAuth.permission && store.state.userAuth.permission.customs;

        if (customPermissions) {
            let result = customPermissions.find(item => parseInt(item.claim) === parseInt(claimCode));
            if (result)
                return true;
        }
        if (claimPermissions) {
            let result = claimPermissions.find(item => parseInt(item.claim) === parseInt(claimCode) && (!toRole || parseInt(item.toRole) === parseInt(toRole)));
            if (result)
                return true;
        }
        return false;
    };

    let filterMenuDefault = () => {
        let menuList = app.$services.commonService.getMenuList(app.$module.MENU.claim, store.state.userAuth, route.path.toLowerCase().startsWith('/client/') && params.id);

        for (let key in app.$module.MENU.claim) {
            if (checkPermission(app.$module.MENU.claim[key].code)) {
                let menu = menuList.find(menu => menu.code === app.$module.MENU.claim[key].code);
                if (menu)
                    return menu.link;
            }
        }
        return '';
    };

    inject('auth', {
        isAuthenticated,
        checkPermission,
        checkStoragePermission,
        filterMenuDefault,
        checkAuthentication: () => {
            if (!isAuthenticated()) {
                redirect('/login');
                return false;
            }
            return true;
        },
        isRoles,
        checkRoles: (...roles) => {
            if (!isAuthenticated()) {
                redirect('/login');
                return false;
            }
            if (!isRoles(roles)) {
                redirect('/');
                return false;
            }
            return true;
        }
    });
};
