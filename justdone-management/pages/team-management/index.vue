<template>
    <section class="team-management">
        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12 page-head">
                <div class="row">
                    <div class="col-md-6 col-sm-6 col-xs-12">
                        <page-title :titles="titles" />
                    </div>
                    <div class="col-md-6 col-sm-6 col-xs-12 text-right">
                        <div class="dropdown normal-btn">
                            <button
                                class="btn dropdown-toggle not-arrow"
                                type="button"
                                v-if="!showDisabled"
                                @click="showManagersDisabled(true)"
                            >
                                DISABLED LIST
                            </button>
                            <button
                                class="btn dropdown-toggle not-arrow"
                                type="button"
                                v-else
                                @click="showManagersDisabled(false)"
                            >
                                LIST TEAM MANAGEMENT
                            </button>
                        </div>
                        <div class="dropdown normal-btn">
                            <button
                                @click="createManagement"
                                class="btn dropdown-toggle not-arrow"
                                type="button"
                            >
                                ADD NEW
                            </button>
                        </div>

                    </div>
                    <div class="col-12 page-filter">
                        <product-lookup
                            v-if="$store.state.userAuth && $store.state.userAuth.permission.role.code === role.SuperAdmin"
                            v-model="condition.product"
                            :query-code="$route.query.productCode"
                            :autoSelect="condition.autoSelect"
                        />
                        <lookup-role
                            ref="role"
                            v-model="condition.role"
                            :product="condition.product"
                            :query-code="$route.query.roleCode"
                            :isSelectAll="false"
                        />
                        <product-lookup
                            ref="productAssignment"
                            v-if="$store.state.userAuth && $store.state.userAuth.permission.role.code === role.SuperAdmin"
                            v-show="condition.product && condition.product.code === 1"
                            v-model="condition.productAssignment"
                            :query-code="$route.query.productAssignment"
                            :isSelectAll="false"
                            :exclude-codes="[this.$store.state.productCode]"
                            label="Product Assignment"
                        />
                        <lookup-keyword v-model="condition.keyword" />
                    </div>
                </div>
            </div>
            <div class="col-md-12 col-sm-12 col-xs-12 page-list">
                <div class="row">
                    <div class="col-md">
                        <div
                            class="box"
                            v-if="!list || !list.length"
                        >
                            <div class="row row-label">
                                <div class="col-4"><label class="col-label">Managers (Total {{total}})</label></div>
                                <div class="col text-center"><label class="col-label">products</label></div>
                                <div class="col text-center"><label class="col-label">Role</label></div>
                                <div class="col text-center"><label class="col-label">Clients</label></div>
                                <div class="col text-center"><label class="col-label">Last Access</label></div>
                                <div class="col-2 text-right"><label
                                        v-if="roleCode !== role.Supervisor"
                                        class="col-label"
                                    >Options</label><label
                                        style="width: 35px"
                                        class="col-label expand"
                                    ></label></div>
                            </div>
                            <div class="no-data text-center">
                                <img
                                    src="~/assets/images/no-data.png"
                                    alt="no data"
                                >
                                <p class="text-note">No data available.</p>
                            </div>
                        </div>
                        <div
                            id="accordion"
                            class="box"
                            v-else
                        >
                            <div class="row row-label">
                                <div class="col-4"><label class="col-label">Managers (Total {{total}})</label></div>
                                <div class="col text-center"><label class="col-label">products</label></div>
                                <div class="col text-center"><label class="col-label">Role</label></div>
                                <div class="col text-center"><label class="col-label">Clients</label></div>
                                <div class="col text-center"><label class="col-label">Last Access</label></div>
                                <div class="col-2 text-right"><label
                                        v-if="roleCode !== role.Supervisor"
                                        class="col-label"
                                    >Options</label><label
                                        style="width: 35px"
                                        class="col-label expand"
                                    ></label></div>
                            </div>
                            <div class="box-item pdr-15">
                                <div
                                    class="row row-item"
                                    v-for="(manager, index) in list"
                                    :id="`row_manager_${manager._id}`"
                                    :key="index"
                                >
                                    <div class="col-4 align-self-center">
                                        <img
                                            class="item-img"
                                            :src="manager.avatar ? manager.avatar : '/images/default-avatar.jpg'"
                                            :title="manager.fullName"
                                        />
                                        <span
                                            class="item-name"
                                            :title="manager.fullName"
                                        >{{manager.fullName}}</span>
                                        <span
                                            class="item-email"
                                            :title="manager.email"
                                        >{{manager.email}}</span>
                                    </div>
                                    <div class="col align-self-center text-center">
                                        <span class="item-normal">{{manager.productName}}</span>
                                    </div>

                                    <div class="col align-self-center text-center">
                                        <span class="item-normal fix">{{manager.roleName}}</span>
                                        <!--<span class="item-product dropdown-toggle" data-toggle="dropdown"></span>
                                        <ul class="dropdown-menu">
                                            <li class="dropdown-menu-link" v-for="(item, index) in manager.permission.products" :key="index" @click="selectProductsManager(item.name, manager._id)">
                                                {{item.name}}
                                            </li>
                                        </ul> -->
                                    </div>
                                    <div class="col align-self-center text-center">
                                        <span class="item-normal">{{manager.total ? manager.total : 0}}</span>
                                    </div>
                                    <div class="col align-self-center text-center">
                                        <span
                                            v-if="manager.lastAccess"
                                            :class="{green: isNearTimeManager}"
                                            class="item-status"
                                        >{{manager.lastAccess | formatDate}} {{manager.lastAccess | formatTime}}</span>
                                        <span
                                            v-if="!manager.lastAccess"
                                            class="red item-status"
                                        >Not yet</span>
                                    </div>
                                    <div
                                        class="col-2 align-self-center text-right"
                                        v-if="!showDisabled"
                                    >
                                        <div
                                            class="dropdown dropdown-option"
                                            v-if="$auth.checkPermission($module.MANAGER.claim.ASSIGN_MANAGER.code, manager.roleCode) || $auth.checkPermission($module.MANAGER.claim.DELETE.code, manager.roleCode)"
                                        >
                                            <a
                                                class="item-option dropdown-toggle"
                                                :data-toggle="$auth.checkPermission($module.MANAGER.claim.ASSIGN_MANAGER.code, manager.roleCode) || $auth.checkPermission($module.MANAGER.claim.DELETE.code, manager.roleCode) ? 'dropdown' : ''"
                                            >
                                                ...
                                            </a>
                                            <ul class="dropdown-menu">
                                                <li v-if="$auth.checkPermission($module.MANAGER.claim.ASSIGN_MANAGER.code, manager.roleCode)"><a
                                                        class="option-item"
                                                        @click="openAssignManager(manager._id, manager.fullName, manager.email, manager.productCode, manager.roleCode)"
                                                    >Assign Managers</a></li>
                                                <!-- <li><a class="option-item" data-toggle="modal" :data-target="'#assignManager' + index">Assign Managers</a></li> -->
                                                <li v-if="$auth.checkPermission($module.MANAGER.claim.DELETE.code, manager.roleCode)"><a
                                                        class="option-item red"
                                                        data-toggle="modal"
                                                        @click="confirmDeleteManager(manager._id)"
                                                    >Disable Manager</a></li>
                                            </ul>
                                        </div>
                                        <a
                                            class="item-expand"
                                            data-toggle="collapse"
                                            :data-target="`#list_manager_${manager._id}`"
                                            @click="showClients(manager)"
                                        >
                                            <i
                                                class="fa fa-caret-down"
                                                aria-hidden="true"
                                            ></i>
                                        </a>
                                        <assign-managers
                                            :id="'manager_' + manager._id"
                                            ref="AssignManagers"
                                        />
                                        <!-- <assign-managers :id="'assignManager' + index"/> -->
                                    </div>
                                    <div
                                        class="col-2 align-self-center text-right"
                                        v-else
                                    >
                                        <button
                                            class="btn-normal"
                                            @click="confirmRestoreManager(manager._id)"
                                        >Restore Manager</button>
                                    </div>
                                    <div
                                        class="col-12 collapse box-client-assign"
                                        :id="`list_manager_${manager._id}`"
                                        data-parent="#accordion"
                                    >
                                        <div class="list-client-assign">
                                            <div
                                                class="row"
                                                v-if="!manager.total"
                                            >
                                                <div class="no-data text-center small">
                                                    <img
                                                        src="~/assets/images/no-data.png"
                                                        alt="no data"
                                                    >
                                                    <p class="text-note">No data available.</p>
                                                </div>
                                            </div>
                                            <div
                                                class="row row-label"
                                                v-if="manager.total"
                                            >
                                                <div class="col-4"><label class="col-label">Clients (Total {{manager.total}})</label></div>
                                                <!-- <div class="col text-center"><label class="col-label">ABN no</label></div> -->
                                                <div class="col text-center"><label class="col-label">Products</label></div>
                                                <div class="col text-center"><label class="col-label">Last access</label></div>
                                                <div class="col text-center"><label class="col-label">Cruncher status</label></div>
                                                <div class="col text-center"><label class="col-label">Dashboard</label></div>
                                                <!--<div class="col-1 text-right"><label class="col-label">Options</label></div>-->
                                            </div>
                                            <!-- v-if="manager.total" -->
                                            <div class="box-item">
                                                <div
                                                    class="row row-item"
                                                    v-for="(client, index) in manager.clients"
                                                    :key="index"
                                                >
                                                    <div class="col-4 align-self-center">
                                                        <img
                                                            class="item-img"
                                                            :src="client.avatar || '/images/default-avatar.jpg'"
                                                            :title="client.fullName"
                                                        />
                                                        <span
                                                            class="item-name"
                                                            :title="client.businessInfo && client.businessInfo.entityName ? client.businessInfo.entityName : client.fullName"
                                                        >{{client.businessInfo && client.businessInfo.entityName ? client.businessInfo.entityName : client.fullName}}</span>
                                                        <span
                                                            class="item-email"
                                                            :title="client.businessInfo && client.businessInfo.abnCode ? client.businessInfo.abnCode : client.email"
                                                        >{{client.businessInfo && client.businessInfo.abnCode ? client.businessInfo.abnCode : client.email}}</span>
                                                    </div>
                                                    <!-- <div class="col align-self-center text-center">
                                                        <span class="item-abn">{{client.businessInfo && client.businessInfo.abnCode}}</span>
                                                    </div> -->
                                                    <div class="col align-self-center text-center">
                                                        <span class="item-normal">{{client.productName}}</span>
                                                    </div>
                                                    <div class="col align-self-center text-center">
                                                        <span
                                                            v-if="client.lastAccess"
                                                            :class="{green: isNearTimeClient}"
                                                            class="item-status"
                                                        >{{client.lastAccess | formatDate}} {{client.lastAccess | formatTime}} </span>
                                                        <span
                                                            v-if="!client.lastAccess"
                                                            class="red item-status"
                                                        >Not yet</span>
                                                    </div>
                                                    <div class="col align-self-center text-center">
                                                        <span
                                                            v-if="client.crunchStatus && client.crunchStatus.status && !client.crunchStatus.status.isFinished && client.crunchStatus.status.overdue && client.crunchStatus.status.overdue === 0 && !client.crunchStatus.status.isFinished"
                                                            class="item-status"
                                                        >
                                                            Not started
                                                        </span>

                                                        <span
                                                            v-else-if="client.crunchStatus && client.crunchStatus.status && !client.crunchStatus.status.isFinished && client.crunchStatus.status.overdue && client.crunchStatus.status.overdue > 7"
                                                            class="red item-status"
                                                        >
                                                            Overdue {{client.crunchStatus.status.overdue}} days
                                                        </span>

                                                        <span
                                                            v-else-if="client.crunchStatus && client.crunchStatus.status && !client.crunchStatus.status.isFinished && client.crunchStatus.status.overdue && client.crunchStatus.status.overdue > 9"
                                                            class="green item-status"
                                                        >
                                                            Inprogress ()
                                                        </span>

                                                        <span
                                                            v-else-if="client.crunchStatus && client.crunchStatus.status && !client.crunchStatus.status.isFinished && client.crunchStatus.status.isFinished"
                                                            class="item-status"
                                                        >
                                                            Completed
                                                        </span>

                                                        <span
                                                            v-else
                                                            class="item-status"
                                                        >
                                                            no data
                                                        </span>

                                                        <ul
                                                            v-if="client.crunchStatus && client.crunchStatus.details && client.crunchStatus.details.length > 0"
                                                            class="item-list-crunch"
                                                        >
                                                            <li class="list-crunch-label">
                                                                <span class="crunch-label">Month</span>
                                                                <span class="crunch-label">Bank</span>
                                                                <span class="crunch-label">Credit card</span>
                                                            </li>
                                                            <li
                                                                v-for="(crunch, index) in client.crunchStatus.details"
                                                                :key="index"
                                                                class="list-crunch-item"
                                                            >
                                                                <span class="crunch-item-month">{{crunch.month | convertMonthToWord}} {{crunch.year | sliceString}}</span>
                                                                <template v-if="crunch.type ===1">
                                                                    <span
                                                                        v-if="!crunch.isFinished && crunch.overdue && crunch.overdue === 0"
                                                                        class="crunch-item-status"
                                                                    >
                                                                        Not started
                                                                    </span>

                                                                    <span
                                                                        v-else-if="!crunch.isFinished && crunch.overdue && crunch.overdue > 7"
                                                                        class="red crunch-item-status"
                                                                    >
                                                                        Overdue {{crunch.overdue}} days
                                                                    </span>

                                                                    <span
                                                                        v-else-if="!crunch.isFinished && crunch.overdue && crunch.overdue > 9"
                                                                        class="green crunch-item-status"
                                                                    >
                                                                        Inprogress
                                                                    </span>

                                                                    <span
                                                                        v-else-if="crunch.isFinished"
                                                                        class="crunch-item-status"
                                                                    >
                                                                        Completed
                                                                    </span>

                                                                    <span
                                                                        class="crunch-item-status"
                                                                        v-else
                                                                    >
                                                                        no data
                                                                    </span>
                                                                </template>
                                                                <template v-if="crunch.type === 2">
                                                                    <span
                                                                        v-if="!crunch.isFinished && crunch.overdue && crunch.overdue === 0"
                                                                        class="crunch-item-status"
                                                                    >
                                                                        Not started
                                                                    </span>

                                                                    <span
                                                                        v-else-if="!crunch.isFinished && crunch.overdue && crunch.overdue > 7"
                                                                        class="red crunch-item-status"
                                                                    >
                                                                        Overdue {{crunch.overdue}} days
                                                                    </span>

                                                                    <span
                                                                        v-else-if="!crunch.isFinished && crunch.overdue && crunch.overdue > 9"
                                                                        class="green crunch-item-status"
                                                                    >
                                                                        Inprogress ()
                                                                    </span>

                                                                    <span
                                                                        v-else-if="crunch.isFinished"
                                                                        class="crunch-item-status"
                                                                    >
                                                                        Completed
                                                                    </span>

                                                                    <span
                                                                        class="crunch-item-status"
                                                                        v-else
                                                                    >
                                                                        no data
                                                                    </span>
                                                                </template>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div class="col align-self-center text-center">
                                                        <nuxt-link
                                                            :to="`/client/${client._id}/transaction`"
                                                            style="margin-left: 15px;"
                                                            class="btn-normal"
                                                        >VIEW</nuxt-link>
                                                    </div>
                                                    <!--<div class="col-1 align-self-center text-right">-->
                                                    <!--<div class="dropdown">
                                                            <a class="item-option dropdown-toggle" data-toggle="dropdown">
                                                                ...
                                                            </a>
                                                            <ul class="dropdown-menu">
                                                                <li><a class="option-item" @click="openAssignManager(client._id, client.fullName, client.email, client.permission.product.code, client.permission.role.code)">Assign Managers {{client.permission.role.code}}asdasd</a></li>-->
                                                    <!-- <li><a class="option-item" data-toggle="modal" :data-target="'#assign' + index">Assign Managers</a></li> -->
                                                    <!-- <li><a class="option-item red">Disable Account</a></li> -->
                                                    <!--</ul>
                                                        </div>-->
                                                    <!-- <assign-managers :id="'assign' + index"/> -->
                                                    <!--<assign-managers :id="'manager_' + client._id" ref="AssignManagers" />-->
                                                    <!--</div>-->
                                                </div>
                                            </div>
                                            <div class="paginate">
                                                <client-only>
                                                    <pagination
                                                        id="team-pagination"
                                                        :page="manager.page"
                                                        :limit="manager.limit"
                                                        :total="manager.total"
                                                        @change="changePageClient"
                                                    />
                                                </client-only>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-auto">
                        <history-logs></history-logs>
                        <popup-confirm
                            id="popup-confirm"
                            ref="popupConfirm"
                            :title="confirm.title"
                            :buttonName1="confirm.buttonName1"
                            buttonName2="Cancel"
                            @success="handleConfirm"
                        />
                    </div>
                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <div class="paginate">
                            <client-only>
                                <pagination
                                    id="team-pagination"
                                    :page="page"
                                    :limit="limit"
                                    :total="total"
                                    @change="changePage"
                                />
                            </client-only>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <create-management
            ref="createManagement"
            :id="'create-management'"
            @success="handleSuccess"
        />
    </section>
</template>

<script>
import ProductLookup from '~/components/product/ProductLookup';
import LookupKeyword from '~/components/LookupKeyword';
import LookupRole from '~/components/LookupRole';
import Pagination from '~/components/Pagination';
import HistoryLogs from '~/components/HistoryLogs';
import BoxManager from '~/components/BoxManager';
import AssignManagers from '~/components/AssignManagers';
import {mapUrlGoogleStorage} from '~/helpers/dataHelper';
import {formatDate, formatTime} from '~/helpers/dateHelper';
import PopupConfirm from '~/components/PopupConfirm';
import CreateManagement from '~/components/CreateManagement';
import PageTitle from '~/components/PageTitle';
import {RoleCode} from '~/common/commonType';

export default {
    data() {
        return {
            condition: {
                keyword: '',
                role: null,
                product: null,
                productAssignment: null,
                autoSelect: true
            },
            role: null,
            list: [],
            page: 1,
            limit: 10,
            total: 0,
            showDisabled: false,
            timeout: null,
            titles: ['Team management'],
            confirm: {
                title: '',
                buttonName1: ''
            },
            managerShowed: {},
            isNearTimeManager: false,
            isNearTimeClient: false,
            roleCode: null
        };
    },
    components: {
        Pagination,
        HistoryLogs,
        BoxManager,
        LookupRole,
        ProductLookup,
        LookupKeyword,
        AssignManagers,
        PopupConfirm,
        CreateManagement,
        PageTitle,
    },
    created() {
        this.managerShowed = {};
        this.$setLoading();
        this.role = RoleCode;
        if (this.$store.state.userAuth && this.$store.state.userAuth.permission.role.code !== this.role.SuperAdmin) {
            this.roleCode = this.$store.state.userAuth.permission.role.code;

            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => this.search(), 200);
        }
    },
    watch: {
        'condition.product': {
            async handler(value) {
                await this.$refs.role.reset();
                this.$refs.productAssignment.reset();
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => this.search(), 200);
            },
            deep: true
        },
        'condition.role': {
            handler(value) {
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => this.search(), 200);
            },
            deep: true
        },
        'condition.productAssignment': {
            handler(value) {
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => this.search(), 200);
            },
            deep: true
        },
        'condition.keyword': function(value) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => this.search(), 1200);
        }
    },
    methods: {
        reset() {
            this.list = [];
            this.page = 1;
            this.total = 0;
        },
        search() {
            this.reset();
            this.getManagers();
            this.getCountManagers();
        },
        async getManagers() {
            this.$setLoading();
            let productCodes = this.condition && this.condition.product ? [this.condition.product.code] : [];
            let roleCodes = this.condition && this.condition.role ? [this.condition.role.code] : [];
            let productCodeAssignments = this.condition && this.condition.productAssignment ? [this.condition.productAssignment.code] : [];

            this.list = [];
            let result;
            if (productCodeAssignments && productCodeAssignments.length)
                result = await this.$services.userService.getManagersAssignment(productCodes, roleCodes, productCodeAssignments, this.condition.keyword, this.showDisabled, this.page, this.limit);
            else
                result = await this.$services.userService.getManagers(productCodes, roleCodes, this.condition.keyword, this.showDisabled, this.page, this.limit);

            if (result.data && result.data.length) {
                result.data.forEach(item => {
                    item.avatar = mapUrlGoogleStorage(item.avatar);
                    item.productName = item.permission && item.permission.product && item.permission.product.name;
                    item.productCode = item.permission && item.permission.product && item.permission.product.code;
                    item.roleName = item.permission && item.permission.role && item.permission.role.name;
                    item.roleCode = item.permission && item.permission.role && item.permission.role.code;
                    if (item.lastAccess)
                        this.compareLastAcessAndNowDate(new Date(item.lastAccess), new Date(), 1);
                });
                this.list = result.data;
                let managerIds = result.data.map(item => item._id);
                let resultCount = await this.$services.userService.getCountClientsByManagers('', managerIds);

                if (resultCount.error) {
                    return false;
                }
                else {
                    resultCount.data.forEach(item => {
                        let manager = result.data.find(manager => manager._id === item._id);
                        if (manager)
                            manager.total = item.count;
                    });
                    this.$forceUpdate();
                }
            }
            this.$setLoading(false);
        },
        async getCountManagers() {
            let productCodes = this.condition && this.condition.product ? [this.condition.product.code] : [];
            let roleCodes = this.condition && this.condition.role ? [this.condition.role.code] : [];
            let productCodeAssignments = this.condition && this.condition.productAssignment ? [this.condition.productAssignment.code] : [];

            let result;
            if (productCodeAssignments && productCodeAssignments.length)
                result = await this.$services.userService.getCountManagersAssignment(productCodes, roleCodes, productCodeAssignments, this.condition.keyword, this.showDisabled);
            else
                result = await this.$services.userService.getCountManagers(productCodes, roleCodes, this.condition.keyword, this.showDisabled);

            if (result.error) {
                return false;
            }
            this.total = result.data || 0;
        },
        async showClients(manager) {
            $('.row-item').removeClass('bg-show');
            if (!manager)
                return;

            this.$setLoading();
            if ($(`#list_manager_${manager._id}`).hasClass('show')) {
                $(`#row_manager_${manager._id}`).removeClass('bg-show');
                this.$setLoading(false);
                return;
            }
            manager.page = 1;
            manager.limit = 5;
            manager.total = 0;

            if (!$(`#list_manager_${manager._id}`).hasClass('hide')) {
                $(`#row_manager_${manager._id}`).addClass('bg-show');
                await this.getClientsByManager(manager);
                await this.getCountClientsByManager(manager);
            }
            this.managerShowed = manager;
            this.$setLoading(false);
        },
        async getClientsByManager(manager) {
            if (!manager)
                return;
            manager.clients = [];

            let {data, error} = await this.$services.userService.getClientsByManager([], manager._id, '', this.showDisabled, manager.page, manager.limit);
            if (error)
                return false;

            if (data && data.length) {
                data.forEach(client => {
                    client.avatar = mapUrlGoogleStorage(client.avatar);
                    client.productName = client.permission && client.permission.product && client.permission.product.name;
                    if (client.lastAccess)
                        this.compareLastAcessAndNowDate(new Date(client.lastAccess), new Date(), 2);
                });
                manager.clients = data;
                this.$forceUpdate();

                let clientIds = manager.clients.map(client => client._id);
                if (!clientIds || !clientIds.length)
                    return;

                let result = await this.$services.userService.getManagersByUsers([], [], clientIds);
                if (result.error)
                    return false;

                if (result.data) {
                    manager.clients.forEach(client => {
                        let item = result.data.find(item => item._id);
                        client.permission.manager = item && item.managers ? item.managers[0] : {};
                    });
                    this.$forceUpdate();
                }
            }
        },
        async getCountClientsByManager(manager) {
            let {data, error} = await this.$services.userService.getCountClientsByManager([], manager._id, '', this.showDisabled);
            if (error)
                return false;

            manager.total = data || 0;
            this.$forceUpdate();
        },
        async compareLastAcessAndNowDate(lastAccess, current, group) {
            if (!lastAccess || !current)
                return;
            if (current.getTime() - lastAccess.getTime() < 3600000) {
                if (group === 1)
                    this.isNearTimeManager = true;
                else
                    this.isNearTimeClient = true;
            }
            else {
                if (group === 1)
                    this.isNearTimeManager = false;
                else
                    this.isNearTimeClient = false;
            }
        },
        selectProductsManager(name, _id) {
            let manager = this.list.find(manager => manager._id === _id);
            manager.productName = name;
        },
        selectProductsClient(name, client) {
            client.productName = name;
            this.$forceUpdate();
        },
        showManagersDisabled(value) {
            this.showDisabled = value;
            this.search();
        },
        changePage(page) {
            this.page = page;
            this.getManagers();
        },
        async changePageClient(page) {
            this.managerShowed.page = page;
            await this.getClientsByManager(this.managerShowed);
            await this.getCountClientsByManager(this.managerShowed);
        },
        createManagement() {
            this.$refs.createManagement.open();
        },
        openAssignManager(_id, fullName, email, productCode, roleCode) {
            this.$refs.AssignManagers.find(b => b.id === 'manager_' + _id).open(_id, fullName, email, productCode, roleCode, 'TEAM_MANAGEMENT');
        },
        handleSuccess({isNew}) {
            if (isNew)
                this.search();
        },
        confirmDeleteManager(_id) {
            this.confirm = {
                title: 'Are you sure want to disable this Manager?',
                buttonName1: 'Disable'
            };
            this.$refs.popupConfirm.open({_id, isDelete: true});
        },
        confirmRestoreManager(_id) {
            this.confirm = {
                title: 'Are you sure want to restore this Manager?',
                buttonName1: 'Restore'
            };
            this.$refs.popupConfirm.open({_id, isRestore: true});
        },
        async handleConfirm({_id, isDelete, isRestore}) {
            if (isDelete)
                await this.$services.userService.deleteUser(_id);
            else if (isRestore)
                await this.$services.userService.restoreUser(_id);
            this.search();
        },
    },
    filters: {
        formatDate,
        formatTime
    }
};
</script>
