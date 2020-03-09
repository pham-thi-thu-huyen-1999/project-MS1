<template>
    <div id="container-template" class="container-template theme-default">
        <site-header></site-header>
        <div class="main-content">
            <div class="col-left">
                <menu-left></menu-left>
            </div>
            <div class="col-right loading-area">
                <nuxt/>
            </div>
        </div>
    </div>
</template>

<script>
import SiteHeader from '~/components/SiteHeader';
import MenuLeft from '~/components/MenuLeft';
import EventBus from '~/plugins/event-bus';

export default {
    middleware: ['auth'],
    components: {
        SiteHeader,
        MenuLeft
    },
    created() {
        this.stopEventBus();

        EventBus.$on('NOTIFICATION_ERROR', data => {
            this.notifyError(data.title, data.description);
        });
        EventBus.$on('NOTIFICATION_WARNING', data => {
            this.notifyWarning(data.title, data.description);
        });
        EventBus.$on('NOTIFICATION_SUCCESS', data => {
            this.notifySuccess(data.title, data.description);
        });
    },
    methods: {
        stopEventBus() {
            EventBus.$off('NOTIFICATION_ERROR');
            EventBus.$off('NOTIFICATION_WARNING');
            EventBus.$off('NOTIFICATION_SUCCESS');
            EventBus.$off('MENU_VIEW');
        },
        notifyError(title, description) {
            this.$notify({
                type: 'error',
                title: title,
                text: description
            });
        },
        notifyWarning(title, description) {
            this.$notify({
                type: 'warning',
                title: title,
                text: description
            });
        },
        notifySuccess(title, description) {
            this.$notify({
                type: 'success',
                title: title,
                text: description
            });
        },
    }
};
</script>

