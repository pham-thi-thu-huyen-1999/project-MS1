<template>
    <div class="container-template" :class="globalData.theme">
        <nuxt/>
        <no-ssr>
            <notifications group="success" position="top right">
                <template slot="body" slot-scope="props">
                    <div class="notify-complete">
                        <div class="box-inline">
                            <img src="~/assets/images/connect.svg"/>
                        </div>
                        <div class="box-inline">
                            <h3>{{props.item.title}}</h3>
                            <h4 v-html="props.item.text"></h4>
                        </div>
                        <div class="box-inline text-right">
                            <button class="btn-white" @click="props.close"><img src="~/assets/images/shape.svg"/></button>
                        </div>
                    </div>
                </template>
            </notifications>
        </no-ssr>
        <no-ssr>
            <notifications group="warning" position="top right">
                <template slot="body" slot-scope="props">
                    <div class="notify-warning">
                        <div class="box-inline">
                            <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
                        </div>
                        <div class="box-inline">
                            <h3>{{props.item.title}}</h3>
                            <h4 v-html="props.item.text"></h4>
                        </div>
                        <div class="box-inline text-right">
                            <button class="btn-white" @click="props.close"><img src="~/assets/images/shape.svg"/></button>
                        </div>
                    </div>
                </template>
            </notifications>
        </no-ssr> 
        <no-ssr>
            <notifications group="error" position="top right">
                <template slot="body" slot-scope="props">
                    <div class="notify-error">
                        <div class="box-inline">
                            <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
                        </div>
                        <div class="box-inline">
                            <h3>{{props.item.title}}</h3>
                            <h4 v-html="props.item.text"></h4>
                        </div>
                        <div class="box-inline text-right">
                            <button class="btn-white" @click="props.close"><img src="~/assets/images/shape.svg"/></button>
                        </div>
                    </div>
                </template>
            </notifications>
        </no-ssr>  
    </div>
</template>

<script>
import EventBus from '~/plugins/event-bus';
import {Themes, mapUrlGoogleStorage} from '~/helpers/dataHelper';

export default {
    middleware: ['auth'],
    data: () => ({
        globalData: {
            title: 'White Label',
            theme: 'theme-white',
            favicon: '/favicon.ico'
        },
        domain: ''
    }),
    head() {
        return {
            title: this.globalData.title,
            meta: [
                {hid: 'description', name: 'description', content: this.globalData.title}
            ],
            link: [
                {rel: 'icon', type: 'image/x-icon', href: this.globalData.favicon}
            ]
        };
    },
    mounted() {
        this.domain = window.location.hostname;
        this.getGlobal();
    },
    created() {
        // this.stopEvenBus();
        EventBus.$off();
        // this.getGlobal();
        EventBus.$on('FAVICON_PRODUCT', favicon => {
            this.globalData.favicon = favicon;
        });
    },
    methods: {
        async getGlobal(head) {
            // let domain = window.location.hostname;
            if (!this.domain)
                return {};
            let {data, error} = await this.$services.productService.getProductByDomain(this.domain);
            if (error)
                console.log(error);
            else if (data) {
                this.globalData = {
                    title: data.name,
                    theme: Themes(data.config.colorScheme),
                    favicon: data && mapUrlGoogleStorage(data.favicon)
                };
            }
            EventBus.$on('HEAD', Head => {
                this.globalData = Head;
            });
        },
        notifyError(title, description) {
            this.$notify({
                group: 'error',
                title: title,
                text: description
            });
        },
        notifyWarning(title, description) {
            this.$notify({
                group: 'warning',
                title: title,
                text: description
            });
        },
        notifySuccess(title, description) {
            this.$notify({
                group: 'success',
                title: title,
                text: description
            });
        },
    }
};
</script>