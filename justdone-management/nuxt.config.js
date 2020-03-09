const webpack = require('webpack');
const threadLoader = require('thread-loader');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

threadLoader.warmup({
}, [
    'vue-loader',
    'sass-loader',
]);

module.exports = {
    env: {
        apiCoreBase: process.env.NODE_ENV === 'Production' ? 'https://system-core.precis.systems' : (process.env.NODE_ENV === 'Staging' ? 'https://system-core-stag.precis.systems' : (process.env.NODE_ENV === 'Cloud' ? 'https://system-core-dev.precis.systems' : process.env.NODE_ENV === 'Development' ? 'http://192.168.0.88:3001' : 'http://localhost:3001')),
        // apiCoreBase: process.env.NODE_ENV === 'Production' ? 'https://system-core.precis.systems' : (process.env.NODE_ENV === 'Staging' ? 'https://system-core-stag.precis.systems' : (process.env.NODE_ENV === 'Cloud' ? 'https://system-core-dev.precis.systems' : 'http://192.168.0.101:3001')),
        apiReportBase: process.env.NODE_ENV === 'Production' ? 'https://reports.precis.systems' : (process.env.NODE_ENV === 'Staging' ? 'https://reports-stag.precis.systems' : (process.env.NODE_ENV === 'Cloud' ? 'https://reports-dev.precis.systems' : process.env.NODE_ENV === 'Development' ? 'http://192.168.0.88:3005' : 'http://localhost:3005')),
        apiLogBase: process.env.NODE_ENV === 'Production' ? 'https://log.precis.systems' : (process.env.NODE_ENV === 'Staging' ? 'https://log-stag.precis.systems' : (process.env.NODE_ENV === 'Cloud' ? 'https://log-dev.precis.systems' : process.env.NODE_ENV === 'Development' ? 'http://192.168.0.88:3004' : 'http://localhost:3004')),
        environment: process.env.NODE_ENV,
        location: process.env.LOCATION
    },
    /*
    ** Headers of the page
    */
    head: {
        title: 'Management System',
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', name: 'description', content: 'Management System'}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
        ]
    },
    css: [
        '~/node_modules/bootstrap/dist/css/bootstrap.min.css',
        '~/node_modules/font-awesome/css/font-awesome.min.css',
        '~/assets/scss/main.scss'
    ],
    plugins: [
        {src: '~/plugins/auth'},
        {src: '~/plugins/service'},
        {src: '~/plugins/module'},
        {src: '~/plugins/common'},
        {src: '~/plugins/event-bus', ssr: false},
        {src: '~/plugins/vue-cookie', ssr: false},
        {src: '~/plugins/vue-moment', ssr: false},
        {src: '~/plugins/vue-chartjs', ssr: false},
        {src: '~/plugins/vue-bootstrap-datetimepicker', ssr: false},
        {src: '~/plugins/prototype'},
        {src: '~/plugins/notification', ssr: false},
        {src: '~/plugins/vue-monthly-picker', ssr: false},
        {src: '~/plugins/bootstrap', ssr: false}
    ],
    /*
    ** Customize the progress bar color
    */
    loading: {color: '#3B8070'},
    /*
    ** Build configuration
    */
    build: {
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                Popper: ['popper.js', 'default'],
            }),
            new CompressionPlugin({
                test: [/\.js(\?.*)?$/i, /\.css(\?.*)?$/i]
            }),
        ],
        extend(config, ctx) {
            if (ctx.isDev && ctx.isClient) {
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/
                });
            }
            config.optimization.minimize = true;
            config.optimization.usedExports = true;
            config.optimization.minimizer = [new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: false, // Must be set to true if using source-maps in production
                terserOptions: {
                    // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                }
            })];
        },
        cache: true,
        parallel: true,
        cssSourceMap: false,
    },
};
