import EventBus from '~/plugins/event-bus';

export const state = () => ({
    productCode: null,
    userAuth: null,
    client: null,
    userAuthKey: '',
    claimPermissionKey: '',
    customPermissionKey: '',
    lastAccess: null,
    generalJournal: {
        productId: '',
        title: '',
        userId: '',
        year: ''
    },
});

export const mutations = {
    SET_AUTH_USER: function(state, userAuth) {
        state.userAuth = userAuth;
        if (state.userAuth) {
            state.userAuth.version = 1;
            if (process.browser)
                setCookie(state.userAuthKey, state.userAuth, 15);
        }
        else if (process.browser) {
            removeLocalStorage(state.claimPermissionKey);
            removeLocalStorage(state.customPermissionKey);
            setCookie(state.userAuthKey, null, -1);
        }
    },
    SET_PERMISSION: function(state, data) {
        if (!state.userAuth)
            return;
        if (!state.userAuth.permission)
            state.userAuth.permission = {};

        state.userAuth.permission.claims = data && data.claimPermissions;
        state.userAuth.permission.customs = data && data.customPermissions;
    },
    SET_USER_INFO: function(state, userInfo) {
        if (!userInfo)
            userInfo = {};

        userInfo.version = state.userAuth.version;
        userInfo.token = state.userAuth.token;
        state.userAuth = userInfo;
        if (process.browser)
            EventBus.$emit('USER_INFO', userInfo);
    },
    SET_CLIENT: function(state, client) {
        state.client = client;
        EventBus.$emit('MENU_VIEW', client);
    },
    SET_LAST_ACCESS: function(state, lastAccess) {
        if (!lastAccess)
            lastAccess = new Date();
        state.lastAccess = lastAccess;
    },
    SET_GENERAL_JOURNAL: function(state, data) {
        if (data)
            state.generalJournal = data;
    },
};

export const actions = {
    nuxtServerInit({commit, state}, {req}) {
        state.productCode = 1;
        state.userAuthKey = `userAuth.Management`;
        state.claimPermissionKey = 'claimPermission.Management';
        state.customPermissionKey = 'customPermission.Management';
        if (req.headers.cookie) {
            let userAuth = getCookie(state.userAuthKey, req.headers.cookie);
            if (userAuth) {
                userAuth = JSON.parse(userAuth);
                if (userAuth && userAuth.version === 1)
                    state.userAuth = userAuth;
            }
        }
    }
};

function setCookie(cname, cvalue, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + JSON.stringify(cvalue) + ';' + expires + ';path=/';
}

function getCookie(cookieName, stringCookie) {
    let strCookie = new RegExp('' + cookieName + '[^;]+').exec(stringCookie);
    if (!strCookie)
        return null;
    return unescape(strCookie[0] ? strCookie[0].toString().replace(/^[^=]+./, '') : '');
}

function removeLocalStorage(key) {
    localStorage.removeItem(key);
}
