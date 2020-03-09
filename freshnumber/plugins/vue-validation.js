import Vue from 'vue';
import Vue2FormValidate from 'vue2-form-validate';
// import Vue2FormValidate from '../../../../../TFS/ProjectsPublishNPM/kenry-validate/src/main';

let options = {
    validators: { // custom validator
        functions: {
            'abn-custome': function(value, attrValue, vnode) {
                const abnRegExp = /^[0-9]{2}?[-\s\.]?[0-9]{3}?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3}$/im;// eslint-disable-line
                return abnRegExp.test(value);
            },
            'pass-custom': function(value, attrValue, vnode) {
                const passRegExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/;// eslint-disable-line
                return passRegExp.test(value);
            },
        },
        messages: { // custom message
            'abn-custome': 'ABN is invalid!',
            'pass-custom': 'The password must have atleast 8 chars with one uppercase letter, one lower case letter, one digit and one special character!'
        }
    },
};

Vue.use(Vue2FormValidate, options);
