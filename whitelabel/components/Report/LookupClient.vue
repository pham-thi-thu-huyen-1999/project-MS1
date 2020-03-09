<template>
    <div class="filter-box">
        <div class="dropdown dropdown-client">
            <div class="dropdown-toggle" data-toggle="dropdown">
                <label class="filter-title">Client</label>
                <span class="filter-value">{{ selectOne ? (clientSelected.length > 0 ? 1 : 0) : clientSelected.length }} Clients</span>
                <a class="icon-btn"><i class="i-con icon-client"></i></a>
            </div>
            <i class="fa fa-times" aria-hidden="true"></i>
            <ul class="dropdown-menu scroll">
                <li class="dropdown-menu-item">
                    <input class="dropdown-input" placeholder="" type="text" v-model="keyword">
                </li>
                <li class="dropdown-menu-item" v-for="(item, index) in list" :key="index" @click.stop="resolve(item)">
                    <a class="dropdown-link not-point" >
                        <input :id="`client-${item._id}`" :type="selectOne ? 'radio' : 'checkbox'" name="client-select"/>

                        <label class="label-check">
                            <!-- <span class="dropdown-link-title"> -->
                            <span>
                                {{ item.businessInfo && item.businessInfo.entityName ? item.businessInfo.entityName : item.fullName }} -
                            </span>
                            <!-- <span class="dropdown-link-abn"> -->
                            <span>
                                <!-- <span class="dropdown-link-abn-title">ABN</span>
                                <span class="dropdown-link-abn-value">{{ item.abn }}</span> -->
                                {{ item.businessInfo && item.businessInfo.abnCode ? item.businessInfo.abnCode : item.email }}
                            </span>
                            <!-- <span class="dropdown-link-notifi">
                                <template>
                                    <img class="dropdown-link-notifi-img" src="~/assets/images/noti-misscrunch.svg" alt="" title="">MISS CRUNCHER
                                </template>
                            </span> -->
                        </label>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            productCode: null,
            clientSelected: [],
            list: [],
            keyword: '',
            page: null,
            limit: null,
            total: null
        };
    },
    props: {
        selectOne: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        'keyword': function(keyword) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.list = [];
                this.page = 1;
                this.total = 0;

                this.init();
            }, 1000);
        }
    },
    created() {
        this.open();
    },
    methods: {
        open() {
            this.productCode = this.$store.state.productCode;
            this.clientSelected = [];
            this.list = [];
            this.keyword = '';
            this.page = 1;
            this.limit = 10;
            this.total = 0;

            this.init();
        },
        async init() {
            await this.getClients();
            await this.getCountClients();

            this.clientSelected.forEach(client => {
                if (document.querySelector(`#client-${client._id}`))
                    document.querySelector(`#client-${client._id}`).checked = true;
            });
        },
        async getClients() {
            let {data, error} = await this.$services.userService.getClients(this.productCode, this.keyword, false, this.page, this.limit);
            if (error)
                return error;
            else
                this.list = data;
        },
        async getCountClients() {
            let {data, error} = await this.$services.userService.getCountClients(this.productCode, this.keyword);
            if (error)
                return error;
            else
                this.total = data;
        },
        resolve(client) {
            let position;

            if (!this.selectOne) {
                for (let i = 0; i < this.clientSelected.length; i++) {
                    if (client._id.toString() === this.clientSelected[i]._id.toString()) {
                        position = i;
                        this.clientSelected.splice(i, 1);
                        document.querySelector(`#client-${client._id}`).checked = false;
                    }
                }
            }

            if (typeof (position) !== 'number' || position < 0) {
                this.clientSelected.push(client);
                document.querySelector(`#client-${client._id}`).checked = true;
            }

            this.$emit('changeClient', this.clientSelected);
        }
    }
};
</script>

