import Loading from './Loading.vue';

const Plugin = {
    install(Vue, options = {}) {
    /**
     * Makes sure that plugin can be insstalled only once
     */
        if (this.installed) {
            return;
        }

        this.installed = true;
        this.event = new Vue();
        this.componentName = 'vue-loading';
        /**
     * Plugin API
     */
        Vue.prototype.$loading = {
            show() {
                Plugin.event.$emit('open');
            },
            hide() {
                Plugin.event.$emit('close');
            },
        };
        /**
     * Sets custom component name (if provided)
     */
        Vue.component(this.componentName, Loading);
    }
};

export default Plugin;
