const webpack = require('webpack');

module.exports = {
    env: {
        apiCoreBase: process.env.NODE_ENV === 'Production' ? 'https://system-core.precis.systems' : (process.env.NODE_ENV === 'Staging' ? 'https://system-core-stag.precis.systems' : (process.env.NODE_ENV === 'Cloud' ? 'https://system-core-dev.precis.systems' : 'http://localhost:3001')),
        apiReportBase: process.env.NODE_ENV === 'Production' ? 'https://reports.precis.systems' : (process.env.NODE_ENV === 'Staging' ? 'https://reports-stag.precis.systems' : (process.env.NODE_ENV === 'Cloud' ? 'https://reports-dev.precis.systems' : 'http://localhost:3005')),
        apiLogBase: process.env.NODE_ENV === 'Production' ? 'https://log.precis.systems' : (process.env.NODE_ENV === 'Staging' ? 'https://log-stag.precis.systems' : (process.env.NODE_ENV === 'Cloud' ? 'https://log-dev.precis.systems' : 'http://localhost:3004')),
        environment: process.env.NODE_ENV,
        location: process.env.LOCATION
    },
    /*
    ** Headers of the page
    */
    head: {
        title: 'Fresh Number',
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', name: 'description', content: 'Fresh Number'}
        ],
    },
    css: [
        '~/node_modules/bootstrap/dist/css/bootstrap.min.css',
        '~/node_modules/font-awesome/css/font-awesome.min.css',
        '~/assets/scss/main.scss'
    ],
    generate: {
        minify: {
            collapseWhitespace: false
        },
    },
    plugins: [
        {src: '~/plugins/auth'},
        {src: '~/plugins/service'},
        {src: '~/plugins/module'},
        {src: '~/plugins/common'},
        {src: '~/plugins/vue-validation'},
        {src: '~/plugins/event-bus', ssr: false},
        {src: '~/plugins/vue-cookie', ssr: false},
        {src: '~/plugins/vue-notification', ssr: false},
        {src: '~/plugins/draggable', ssr: false},
        {src: '~/plugins/vue-chartjs.js', ssr: false},
        {src: '~/plugins/prototype.js', ssr: false},
        {src: '~/plugins/v-mask', ssr: false},
        {src: '~/plugins/vue-bootstrap-datetimepicker', ssr: false},
    ],
    /*
    ** Customize the progress bar color
    */
    loading: {color: '#3B8070'},
    /*
    ** Build configuration
    */
    build: {
        vendor: [
            'axios',
            'bootstrap',
            'vue-cookie',
            'vue-notification',
            'draggable',
            'v-mask',
            'vue-bootstrap-datetimepicker',
        ],
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery',
                Popper: ['popper.js', 'default']
            })
        ],
        extend(config, ctx) {
            if (ctx.dev && ctx.isClient) {
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/
                });
            }
        }
    }
};
