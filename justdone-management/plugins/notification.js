import Vue from 'vue';
import swal from 'sweetalert2';

const DEFAULT_CONFIG = {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    allowEnterKey: false,
    focusConfirm: false
};

const WARNING_CONFIG = {
    type: 'warning',
    showCancelButton: true,
    titleText: '',
    text: '',
    confirmButtonColor: '#0269d9',
};

const ERROR_CONFIG = {
    type: 'error',
    showCancelButton: false,
    titleText: 'Something went wrong',
    text: '',
    confirmButtonColor: '#0269d9'
};

const SUCCESS_CONFIG = {
    type: 'success',
    showCancelButton: false,
    titleText: 'Something went wrong',
    text: '',
    confirmButtonColor: '#0269d9'
};

Vue.prototype.$notify = (configuration = {}) => {
    const userConfiguration = {
        ...configuration,
        type: configuration.type || configuration.group,
        titleText: configuration.titleText || configuration.title,
        text: configuration.text
    };

    const typeConfig = () => {
        switch (userConfiguration.type) {
        case 'warning':
            return WARNING_CONFIG;
        case 'error':
            return ERROR_CONFIG;
        case 'success':
            return SUCCESS_CONFIG;
        default: return {};
        }
    };

    return new Promise((resolve, reject) => {
        swal.fire({...DEFAULT_CONFIG, ...typeConfig(), ...userConfiguration})
            .then(result => {
                if (result.value) {
                    resolve();
                }
                else {
                    reject(new Error('Canceled'));
                }
            });
    });
};
