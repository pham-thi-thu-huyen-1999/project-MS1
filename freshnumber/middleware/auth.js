export default async function({store, redirect, route, params, app}) {
    let pathUrl = route.path.toLowerCase();

    if (!store.state.userAuth) {
        if (!['/login', '/forgot-password', '/signup', '/reset'].find(path => pathUrl.startsWith(path)))
            return redirect('/login');
    }
    else {
        if (['/login', '/forgot-password', '/signup', '/reset'].find(path => pathUrl.startsWith(path)))

            return redirect('/');

        app.$auth.checkStoragePermission();

        if (pathUrl === '/') {
            let link = app.$auth.filterMenuDefault();
            return redirect(link);
        }
        else {
            // let menuList = app.$services.commonService.getMenuList(app.$module.MENU.claim, store.state.userAuth, route.path.toLowerCase().startsWith('/client/') && params.id);
            // let menu = menuList.find(menu => pathUrl.startsWith(menu.link));

            // if (!menu || !app.$auth.checkPermission(menu.code))
            //     return redirect('/');
        }

        // View client by managers
        if (!pathUrl.startsWith('/client/')) {
            if (store.state.client)
                store.commit('SET_CLIENT', null);
        }
        else {
            if (!(/[0-9a-z]{24}/.test(params.id)))
                return redirect('/');

            if (!store.state.client) {
                let result = await app.$services.userService.getClientInfo(params.id);
                if (result.error)
                    return console.log(result.error);

                if (!result.data)
                    return redirect('/');

                store.commit('SET_CLIENT', result.data);
            }
        }
    }
};
