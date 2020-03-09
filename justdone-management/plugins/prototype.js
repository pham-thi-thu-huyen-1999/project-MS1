import Vue from 'vue';
import {get} from 'lodash';

Vue.prototype.$get = function(obj, path, defaultValue) {
    return get(obj, path, defaultValue);
};

Vue.prototype.$setLoading = (isLoading = true) => {
    try {
        if (isLoading) {
            $('.loading-area').addClass('loading');
        }
        else {
            $('.loading-area').removeClass('loading');
        }
    }
    catch (errr) {

    }
};
