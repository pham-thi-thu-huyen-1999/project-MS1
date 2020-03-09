import EventBus from '~/plugins/event-bus';
import axios from 'axios';

export const state = () => ({
    productCode: null,
    userAuth: null,
    client: null,
    head: null,
    userAuthKey: '',
    claimPermissionKey: '',
    customPermissionKey: '',
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
    SET_HEAD: function(state, head) {
        state.head = head;
        EventBus.$emit('HEAD', head);
    },
};

export const actions = {
    async nuxtServerInit({commit, state}, {req}) {
        let host = req.headers.host;
        if (host) {
            let response = await axios.get(`${process.env.apiCoreBase}/api/product/domain?domain=${host}`).catch(error => console.log(error));
            let {data, error} = response && response.data ? response.data : {};

            if (error)
                console.log(error);

            if (data) {
                state.productCode = data.code;
                state.head = {
                    title: data && data.name ? data.name : 'White Label',
                    theme: 'theme-white'
                };
            }
        }
        if (!state.productCode)
            state.productCode = 2;

        state.userAuthKey = `userAuth.WhiteLabel.${state.productCode}`;
        state.claimPermissionKey = `claimPermission.WhiteLabel.${state.productCode}`;
        state.customPermissionKey = `customPermission.WhiteLabel.${state.productCode}`;

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
