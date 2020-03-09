<template>
    <div
        class="modal fade box-popup coa-popup show"
        id="coa-detail"
        role="dialog"
        data-backdrop="static"
        data-keyboard="false"
    >
        <div class="modal-dialog">
            <div class="modal-content">
                <div
                    class="modal-body"
                    v-if="data"
                >
                    <div class="form-group">
                        <div class="row">
                            <div class="col-4 pdr-5">
                                <label class="form-label">COA Id</label>
                                <input
                                    type="text"
                                    id="coa-code"
                                    class="form-control form-input"
                                    v-model="data.code"
                                >
                            </div>
                            <div class="col-8 pdl-5">
                                <label class="form-label">COA Name</label>
                                <input
                                    type="text"
                                    id="coa-name"
                                    class="form-control form-input"
                                    v-model="data.name"
                                >
                            </div>
                        </div>
                    </div>
                    <hr v-if="data._id">
                    <div
                        class="form-group"
                        v-if="data._id"
                    >
                        <label class="form-label">Products</label>
                        <div class="dropdown btn-input">
                            <button
                                class="dropdown-toggle not-arrow form-input text-left"
                                data-toggle="dropdown"
                            > {{ productSelected.name ? productSelected.name : 'Select product'}}
                                <i
                                    class="fa fa-sort"
                                    aria-hidden="true"
                                ></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li
                                    class="dropdown-menu-link"
                                    v-for="(product, index) in products"
                                    :key="index"
                                    v-if="products.length > 0"
                                    @click="selectProduct(product)"
                                >
                                    <span>{{product.name}}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <hr v-if="data._id">
                    <div
                        class="form-group"
                        v-if="data._id"
                    >
                        <label class="form-label">Assign clients</label>
                        <div class="row">
                            <div class="col-6">
                                <p class="client-label">Search clients</p>
                                <p
                                    style="cursor: pointer;"
                                    class="client-label right"
                                >
                                    <input
                                        class="client-checkbox"
                                        id="uncheck-client"
                                        type="checkbox"
                                        @click="selectAddClient"
                                        v-model="actionSelectedAll"
                                    />
                                    <span
                                        v-if="isCheckClientAll"
                                        class="text pull-left"
                                    >Check all</span>
                                    <span
                                        v-else
                                        class="text pull-left"
                                    >{{selectedClients.length}} Seleted</span>
                                </p>
                                <div class="box-select">
                                    <div class="dropdown-toggle">
                                        <input
                                            class="form-input client-search"
                                            type="text"
                                            v-model="clientSystem.keyword"
                                        />
                                        <i
                                            class="fa fa-search"
                                            aria-hidden="true"
                                        ></i>
                                    </div>
                                    <div class="list-select select-left">
                                        <ul class="client-list client-left">
                                            <li
                                                class="client-item"
                                                v-for="(client, index) in clientSystem.list"
                                                :key="index"
                                            >
                                                <input
                                                    :id="`client-${client._id}`"
                                                    class="client-checkbox pull-right"
                                                    type="checkbox"
                                                    @click="unSelectAll"
                                                    v-model="selectedClients"
                                                    :value="client"
                                                />
                                                <label
                                                    class="client-name"
                                                    :for="`client-${client._id}`"
                                                >{{ client.profile.firstName }} {{ client.profile.lastName }}</label>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6">
                                <p class="client-label">Clients assigned</p>
                                <p
                                    style="cursor: pointer;"
                                    class="client-label right"
                                >
                                    <input
                                        class="client-checkbox"
                                        id="uncheck-client-assigned"
                                        type="checkbox"
                                        @click="selectAddClientAssigned"
                                        v-model="actionSelectedAllAssigned"
                                    />
                                    <span
                                        v-if="isCheckClientAssignedAll"
                                        class="text pull-left"
                                    >Check all</span>
                                    <span
                                        v-else
                                        class="text pull-left"
                                    >{{assignedClientsSelected.length}} Seleted</span>
                                </p>
                                <div class="box-select">
                                    <div class="dropdown-toggle">
                                        <input
                                            class="form-input client-search"
                                            type="text"
                                            v-model="clientAssigned.keyword"
                                        />
                                        <i
                                            class="fa fa-search"
                                            aria-hidden="true"
                                        ></i>
                                    </div>
                                    <div class="list-select right select-right">
                                        <ul class="client-list client-right">
                                            <li
                                                class="client-item"
                                                v-for="(client, index) in clientAssigned.list"
                                                :key="index"
                                            >
                                                <input
                                                    :id="`client-assign-${client._id}`"
                                                    @click="unSelectClientAssignedAll"
                                                    v-model="assignedClientsSelected"
                                                    :value="client"
                                                    class="client-checkbox pull-right"
                                                    type="checkbox"
                                                /><label
                                                    class="client-name"
                                                    :for="`client-assign-${client._id}`"
                                                >{{ client.profile.firstName }} {{ client.profile.lastName }}</label>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <span
                                class="arrow-box active"
                                @click="assignClients(data._id, productSelected.code)"
                            ><span class="icon-arr-box i-con"></span></span>
                            <span
                                class="arrow-box bottom"
                                @click="removeClientAssigned(data._id, productSelected.code)"
                            ><span class="icon-arr-box i-con"></span></span>
                        </div>
                    </div>
                    <p style="text-align: center; color: red">{{ errorText }}</p>
                    <div class="row">
                        <div class="offset-1 col-5 pdr-5 text-right">
                            <button
                                class="form-btn"
                                @click="createChartAccount"
                                v-if="!data._id"
                            >Create</button>
                            <button
                                class="form-btn"
                                @click="updateChartAccount"
                                v-if="data._id"
                            >Save</button>
                        </div>
                        <div class="col-5 pdl-5">
                            <button
                                class="form-btn grey"
                                data-dismiss="modal"
                            >Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            data: null,
            errorText: null,
            products: null,
            productSelected: null,
            assignData: null,
            clientSystem: null,
            clientAssigned: null,
            selectedClients: null,
            assignedClientsSelected: null,
            loadMoreClientSystem: null,
            loadMoreClientAssigned: null,
            actionSelectedAll: false,
            actionSelectedAllAssigned: false,
            totalClient: null,
            isCheckClientAll: true,
            isCheckClientAssignedAll: true,
        };
    },
    watch: {
        'clientSystem.keyword': async function(keyword) {
            if (this.productSelected && this.productSelected.code) {
                clearTimeout(this.clientSystem.timeout);
                this.clientSystem.timeout = setTimeout(async () => {
                    this.clientSystem.list = [];
                    this.clientSystem.page = 0;
                    this.clientSystem.total = 0;
                    // this.selectedClients = [];

                    await this.getClientsByProductAndCoa(this.productSelected.code, this.data._id, keyword);
                    await this.getCountClientsByProductAndCoa(this.productSelected.code, this.data._id, keyword);
                }, 1000);
            }
        },
        'clientAssigned.keyword': async function(keyword) {
            if (this.productSelected && this.productSelected.code) {
                clearTimeout(this.clientAssigned.timeout);
                this.clientAssigned.timeout = setTimeout(async () => {
                    this.clientAssigned.list = [];
                    this.clientAssigned.page = 0;
                    this.clientAssigned.total = 0;
                    // this.assignedClientsSelected = [];

                    await this.getCountAssignedClientsChartAccount(this.productSelected.code, this.data._id, keyword);
                    await this.getAssignedClientsChartAccount(this.productSelected.code, this.data._id, keyword);
                }, 1000);
            }
        }
    },
    updated() {
        this.clientLeftScroll();
        this.clientRightScroll();
    },
    methods: {
        open(data) {
            $('#coa-detail').modal('show');
            // if (data && this.data && this.data._id && this.data._id === data._id && this.data.name === data.name && this.data.code === data.code)
            //     return;

            this.reset();
            setTimeout(() => $('#coa-code').focus(), 200);

            if (data && data._id) {
                this.data._id = data._id;
                this.data.code = data.code;
                this.data.name = data.name;
                this.getProduct();
            }
        },
        reset() {
            this.data = {
                name: '',
                code: ''
            };
            this.errorText = '';
            this.products = [];
            this.productSelected = {};
            this.assignData = {
                coaId: '',
                productCode: '',
                clientIds: []
            };
            this.clientSystem = {
                list: [],
                page: 0,
                limit: 20,
                total: 0,
                keyword: ''
            };
            this.clientAssigned = {
                list: [],
                page: 0,
                limit: 20,
                total: 0,
                keyword: ''
            };
            this.selectedClients = [];
            this.assignedClientsSelected = [];
            this.loadMoreClientSystem = true;
            this.loadMoreClientAssigned = true;
            this.actionSelectedAll = false;
            this.actionSelectedAllAssigned = false;
        },
        async getProduct() {
            let extendClaims = [this.$module.CHART_OF_ACCOUNT.claim.GET.code];
            this.errorText = '';
            let {data, error} = await this.$services.productService.lookup(null, extendClaims);

            if (error) {
                this.errorText = 'Cannot get the product list!';
                return false;
            }
            else
                this.products = data ? data.filter(p => p.code !== 1) : [];
        },
        async selectProduct(product) {
            this.productSelected = {};
            this.assignData = {coaId: '', productCode: '', clientIds: []};
            this.clientSystem = {list: [], keyword: '', page: 0, limit: 20, total: 0};
            this.clientAssigned = {list: [], keyword: '', page: 0, limit: 20, total: 0};
            this.selectedClients = [];
            this.assignedClientsSelected = [];
            this.productSelected = product;

            await this.getCountClientsByProductAndCoa(product.code, this.data._id);
            await this.getClientsByProductAndCoa(product.code, this.data._id);
            await this.getCountAssignedClientsChartAccount(product.code, this.data._id);
            await this.getAssignedClientsChartAccount(product.code, this.data._id);
        },
        async getClientsByProductAndCoa(productCode, coaId, keyword) {
            this.errorText = '';
            this.loadMoreClientSystem = false;
            if (!keyword || keyword.length <= 0) {
                let {data, error} = await this.$services.userService.getClientsByProductAndCoa(productCode, coaId, keyword, this.clientSystem.page + 1, this.clientSystem.limit);
                if (error) {
                    this.errorText = 'Cannot get the client list!';
                    return false;
                }
                else {
                    // add client into selected
                    if (this.selectedClients.length && this.selectedClients.length === this.clientSystem.list.length) {
                        data.forEach(client => {
                            this.selectedClients.push(client);
                        });
                    }
                    this.loadMoreClientSystem = true;
                    this.clientSystem.page = this.clientSystem.page + 1;
                    this.clientSystem.list = this.clientSystem.list.concat(data);
                }
            }
            else {
                let {data, error} = await this.$services.userService.getClientsByProductAndCoa(productCode, coaId, keyword, this.clientSystem.page + 1, this.clientSystem.limit);
                if (error) {
                    this.errorText = 'Cannot get the client list!';
                    return false;
                }
                else {
                    this.loadMoreClientSystem = true;
                    this.clientSystem.page = this.clientSystem.page + 1;
                    this.clientSystem.list = this.clientSystem.list.concat(data);
                }
            }
        },
        async getCountClientsByProductAndCoa(productCode, coaId, keyword) {
            this.errorText = '';

            let {data, error} = await this.$services.userService.getCountClientsByProductAndCoa(productCode, coaId, keyword);
            if (error) {
                this.errorText = 'Cannot get count the client list!';
                return false;
            }
            else
                this.clientSystem.total = data;
        },
        async getAssignedClientsChartAccount(productCode, coaId, keyword) {
            this.errorText = '';
            this.loadMoreClientAssigned = false;
            let {data, error} = await this.$services.userService.getAssignedClientsChartAccount(productCode, coaId, keyword, this.clientAssigned.page + 1, this.clientAssigned.limit);
            if (error) {
                this.errorText = 'Cannot get the client assigned!';
                return false;
            }
            else {
                if (this.assignedClientsSelected.length && this.assignedClientsSelected.length === this.clientAssigned.list.length) {
                    data.forEach(client => {
                        this.assignedClientsSelected.push(client);
                    });
                }
                this.loadMoreClientAssigned = true;
                this.clientAssigned.page = this.clientAssigned.page + 1;
                this.clientAssigned.list = this.clientAssigned.list.concat(data);
            }
        },
        async getCountAssignedClientsChartAccount(productCode, coaId, keyword) {
            this.errorText = '';
            let {data, error} = await this.$services.userService.getCountAssignedClientsChartAccount(productCode, coaId, keyword);
            if (error) {
                this.errorText = 'Cannot get count the client assigned!';
                return false;
            }
            else
                this.clientAssigned.total = data;
        },
        codeFormat() {
            let check = /^(\d{1,})-(\d{4,20})$/g;
            return check;
        },
        validateCode(code) {
            if (!code) {
                this.errorText = 'The code is required!';
                return false;
            }
            if (!this.codeFormat().test(code)) {
                this.errorText = 'The code format must be number-thousandnumber(at least)';
                return false;
            }
            return true;
        },
        validataName(name) {
            if (!name || name.trim().length === 0 || name.trim().length > 50 || name.trim().length < 8) {
                this.errorText = 'The name is required!';
                return false;
            }
            return true;
        },
        async createChartAccount() {
            this.errorText = '';
            if (!this.validateCode(this.data.code))
                return;

            if (!this.validataName(this.data.name))
                return;

            let {data, error} = await this.$services.chartAccountService.create(this.data);
            if (error) {
                this.errorText = error.message;
                return false;
            }
            else {
                this.data = data;
                this.getProduct();
            }
        },
        async updateChartAccount() {
            this.errorText = '';
            if (!this.validateCode(this.data.code))
                return;

            if (!this.validataName(this.data.name))
                return;

            let {data, error} = await this.$services.chartAccountService.update(this.data._id, this.data);
            if (error) {
                this.errorText = error.message;
                return false;
            }
            else {
                this.data = data;
                this.$emit('success', this.data);
                $('#coa-detail').modal('hide');
            }
        },
        async assignClients(coaId, productCode) {
            this.errorText = '';
            this.assignData = {coaId: '', productCode: '', clientIds: []};
            this.assignData.coaId = coaId;
            this.assignData.productCode = productCode;

            if (!this.assignData.coaId || !this.assignData.productCode) {
                this.errorText = 'The data assignment is invalid!';
                return false;
            }

            if (this.actionSelectedAll) {
                this.clientSystem.list.forEach(client1 => {
                    let exists = this.selectedClients.find(client2 => client1._id === client2._id);
                    if (!exists)
                        this.assignData.clientIds.push(client1._id);
                });
                this.assignData.actionSelectedAll = true;
            }
            else {
                for (let i = 0; i < this.selectedClients.length; i++) {
                    this.assignData.clientIds.push(this.selectedClients[i]._id);
                }
                if (this.assignData.clientIds.length <= 0) {
                    this.errorText = 'The data assignment is invalid!';
                    return false;
                }
            }
            let {data, error} = await this.$services.chartAccountService.assginClients(this.assignData);
            if (error || !data) {
                this.errorText = 'Assign client is not success!';
                return false;
            }
            else {
                if (data) {
                    this.assignData = {coaId: '', productCode: '', clientIds: []};
                    this.clientSystem = {list: [], keyword: '', page: 0, limit: 20, total: 0};
                    this.clientAssigned = {list: [], keyword: '', page: 0, limit: 20, total: 0};
                    this.selectedClients = [];
                    this.assignedClientsSelected = [];
                    this.actionSelectedAll = false;

                    await this.getClientsByProductAndCoa(this.productSelected.code, this.data._id, this.clientSystem.keyword);
                    await this.getCountClientsByProductAndCoa(this.productSelected.code, this.data._id);
                    await this.getAssignedClientsChartAccount(this.productSelected.code, this.data._id);
                    await this.getCountAssignedClientsChartAccount(this.productSelected.code, this.data._id);
                }
            }
        },
        async removeClientAssigned(coaId, productCode) {
            this.errorText = '';

            this.assignData = {coaId: '', productCode: '', clientIds: []};
            this.assignData.coaId = coaId;
            this.assignData.productCode = productCode;

            for (let i = 0; i < this.assignedClientsSelected.length; i++) {
                this.assignData.clientIds.push(this.assignedClientsSelected[i]._id);
            }

            if (!this.assignData.coaId || !this.assignData.productCode || this.assignData.clientIds.length <= 0) {
                this.errorText = 'The data assignment is invalid!';
                return false;
            }

            let {data, error} = await this.$services.chartAccountService.removeClientAssgined(this.assignData);
            if (error) {
                this.errorText = 'Remove the client assignment is not success!';
                return false;
            }
            else {
                if (data) {
                    this.assignData = {coaId: '', productCode: '', clientIds: []};
                    this.clientSystem = {list: [], keyword: '', page: 0, limit: 20, total: 0};
                    this.clientAssigned = {list: [], keyword: '', page: 0, limit: 20, total: 0};
                    this.selectedClients = [];
                    this.assignedClientsSelected = [];
                    this.actionSelectedAllAssigned = false;

                    await this.getClientsByProductAndCoa(this.productSelected.code, this.data._id, this.clientSystem.keyword);
                    await this.getCountClientsByProductAndCoa(this.productSelected.code, this.data._id);
                    await this.getAssignedClientsChartAccount(this.productSelected.code, this.data._id, this.clientSystem.keyword);
                    await this.getCountAssignedClientsChartAccount(this.productSelected.code, this.data._id);
                }
            }
        },
        async clientLeftScroll() {
            let selectLeftEl = document.querySelector('.select-left');
            let clientLeftEl = document.querySelector('.client-left');
            if (selectLeftEl && clientLeftEl) {
                selectLeftEl.addEventListener('scroll', async () => {
                    if (clientLeftEl.offsetHeight > 0) {
                        if ((selectLeftEl.scrollTop + selectLeftEl.offsetHeight) >= clientLeftEl.offsetHeight) {
                            if (this.loadMoreClientSystem) {
                                await this.getClientsByProductAndCoa(this.productSelected.code, this.data._id, this.clientSystem.keyword);
                            }
                        }
                    }
                });
            }
        },
        async clientRightScroll() {
            let selectRightEl = document.querySelector('.select-right');
            let clientRightEl = document.querySelector('.client-right');
            if (selectRightEl && clientRightEl) {
                selectRightEl.addEventListener('scroll', async () => {
                    if (clientRightEl.offsetHeight > 0) {
                        if ((selectRightEl.scrollTop + selectRightEl.offsetHeight) >= clientRightEl.offsetHeight) {
                            if (this.loadMoreClientAssigned) {
                                await this.getAssignedClientsChartAccount(this.productSelected.code, this.data._id, this.clientAssigned.keyword);
                            }
                        }
                    }
                });
            }
        },
        selectAddClient() {
            let selected = [];
            setTimeout(() => {
                if (this.actionSelectedAll) {
                    this.clientSystem.list.forEach(client => {
                        selected.push(client);
                    });
                }
            }, 10);
            this.selectedClients = selected;
            this.isCheckClientAll = true;
        },
        unSelectAll() {
            this.actionSelectedAll = false;
            this.isCheckClientAll = false;
        },
        selectAddClientAssigned() {
            let selected = [];
            setTimeout(() => {
                if (this.actionSelectedAllAssigned) {
                    this.clientAssigned.list.forEach(client => {
                        selected.push(client);
                    });
                }
            }, 10);
            this.assignedClientsSelected = selected;
            this.isCheckClientAssignedAll = true;
        },
        unSelectClientAssignedAll() {
            this.actionSelectedAllAssigned = false;
            this.isCheckClientAssignedAll = false;
        },
    }
};
</script>

