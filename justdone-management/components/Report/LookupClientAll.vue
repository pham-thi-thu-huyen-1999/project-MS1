<template>
    <div class="filter-box">
        <div class="dropdown dropdown-client">
            <div class="dropdown-toggle" data-toggle="dropdown">
                <label class="filter-title">Client</label>
                <span class="filter-value">{{selectOne ? (clientSelected.length > 0 ? 1 : 0) : clientSelected.length }} Clients</span>
                <a class="icon-btn"><i class="i-con icon-client"></i></a>
            </div>
            <i class="fa fa-times" aria-hidden="true" @click="clearSelection()"></i>
            <ul class="dropdown-menu scroll">
                <li class="dropdown-menu-item">
                    <input class="dropdown-input" type="text" v-model="keyword">
                </li>
                <li class="dropdown-menu-item" v-for="(item, index) in list" :key="index" @click.stop="resolve(item)">
                    <a class="dropdown-link not-point" >
                        <input :id="`client-${item._id}`" :type="selectOne ? 'radio' : 'checkbox'" name="client-select"/>

                        <label class="label-check">
                            <span>
                                {{ item.businessInfo && item.businessInfo.entityName ? item.businessInfo.entityName : item.fullName }} -
                            </span>
                            <span>
                                {{ item.businessInfo && item.businessInfo.abnCode ? item.businessInfo.abnCode : item.email }}
                            </span>
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
            product: null,
            clientSelected: [],
            list: [],
            keyword: '',
            page: null,
            limit: null,
            total: null,
            isDeleted: false
        };
    },
    props: {
        selectOne: {
            type: Boolean,
            default: false
        },
        selectId: {
            type: String,
            default: ''
        }
    },
    mounted() {

    },
    components: {

    },
    watch: {
        'keyword': async function(keyword) {
            if (this.product) {
                clearTimeout(this.timeout);
                this.timeout = setTimeout(async () => {
                    this.list = [];
                    this.page = 1;
                    this.total = 0;

                    this.init();
                }, 1000);
            }
        }
    },
    methods: {
        open(data) {
            this.list = [];
            this.keyword = '';
            this.page = 1;
            this.limit = 10;
            this.total = 0;
            this.product = data.product;
            this.init();
        },
        async init() {
            await this.getClients();
            await this.getCountClients();

            this.clientSelected.forEach(client => {
                if (document.querySelector(`#client-${client._id}`))
                    document.querySelector(`#client-${client._id}`).checked = true;
            });

            if (this.selectId)
                this.resolve({_id: this.selectId});
        },
        async getClients() {
            if (!this.product)
                return;

            let {data, error} = await this.$services.userService.getClients([this.product.code], [], this.keyword, this.isDeleted, this.page, this.limit);

            if (error)
                return error;
            else
                this.list = data;
        },
        async getCountClients() {
            if (!this.product)
                return;

            let {data, error} = await this.$services.userService.getCountClients([this.product.code], [], this.keyword, this.isDeleted);

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
                if (!this.selectOne)
                    this.clientSelected.push(client);
                else this.clientSelected = [client];
                if (document.querySelector(`#client-${client._id}`))
                    document.querySelector(`#client-${client._id}`).checked = true;
            }

            this.$emit('change', this.clientSelected);
        },
        clearSelection() {
            for (let i = 0; i < this.clientSelected.length; i++) {
                document.querySelector(`#client-${this.clientSelected[i]._id.toString()}`).checked = false;
            }
            this.clientSelected = [];
            this.$emit('change', this.clientSelected);
        }
    }
};
</script>

