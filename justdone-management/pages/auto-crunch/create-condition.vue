<template>
  <section class="create-condition">
      <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12 page-head">
                <div class="row">
                    <div class="col-6">
                        <page-title :titles="titles"/>
                    </div>
                    <div class="col-6 text-right">
                        <div class="dropdown normal-btn">
                            <button class="btn dropdown-toggle not-arrow" type="button" @click="$router.go(-1)">
                                BACK TO LIST
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="box-condititon">
                    <div class="row">
                        <div class="col-md-5 col-sm-6 col-xs-12">
                            <h3 class="title">{{titleForm}}</h3>
                            <div class="row">
                                <div class="col-md-6 col-sm-6 col-xs-12 pdr-0">
                                    <span class="label">Crunch Type</span>
                                    <div class="dropdown btn-input">
                                        <button class="form-control form-input dropdown-toggle" data-toggle="dropdown">
                                            {{crunchTypeSelected ? crunchTypeSelected.name : ''}}
                                            <i aria-hidden="true" class="fa fa-angle-up"></i><i aria-hidden="true" class="fa fa-angle-down"></i>
                                        </button>
                                        <ul class="dropdown-menu">
                                            <li class="dropdown-menu-link" v-for="(item, index) in crunchTypes" :key="index" @click="changeCrunchType(item.value)">
                                                {{item.name}}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <span class="label">Chart of account</span>
                                    <div class="dropdown btn-input">
                                        <input v-model="coa.keyword" @input="searchCoa" :disabled="!isCoa" :class="{disable: !isCoa}" type="text" class="form-control form-input dropdown-toggle" data-toggle="dropdown" />
                                        <i aria-hidden="true" class="fa fa-angle-up"></i><i aria-hidden="true" class="fa fa-angle-down"></i>
                                        <ul class="dropdown-menu" id="coaBox">
                                            <li v-show="isLoadChart" class="loading-pulse"></li>
                                            <li v-if class="dropdown-menu-link" v-for="(item, index) in coa.list" :key="index"  @click="changeCoa(item)" v-if="coa.list.length">
                                                {{ item.coa.name }}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="col-md-12 col-sm-12 col-xs-12 mt-30"> 
                                    <span class="label">Condition</span>
                                    <div class="box-filter">
                                        <div class="row">
                                            <div class="col-md-4 col-sm-4 col-xs-12 pdr-0">
                                                <label class="form-label">Bank</label>
                                                <div class="dropdown btn-input">
                                                    <input type="text" class="form-control form-input dropdown-toggle" data-toggle="dropdown" :placeholder="'Find your bank...'" v-model="searchBank" @input="getProviders">
                                                    <i aria-hidden="true" class="fa fa-angle-up"></i><i aria-hidden="true" class="fa fa-angle-down"></i>
                                                    <ul class="dropdown-menu">
                                                        <li class="dropdown-menu-link" v-for="(item, index) in banks" :key="index" @click="changeBank(item)">
                                                            <img class="bank-img" :src="item.favicon">
                                                            <span class="bank-name" style="word-break: break-word;">{{ item.name }}</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-4 col-xs-12 pdr-5">
                                                <label class="form-label">Base type</label>
                                                <div class="dropdown btn-input">
                                                    <button type="text" class="form-control form-input dropdown-toggle" data-toggle="dropdown">{{ baseTypeSelected && baseTypeSelected.name }} <i aria-hidden="true" class="fa fa-angle-up"></i><i aria-hidden="true" class="fa fa-angle-down"></i></button>
                                                    <ul class="dropdown-menu">
                                                        <li class="dropdown-menu-link" v-for="(item, index) in baseTypes" :key="index" @click="changeBaseType(item.name)">
                                                            {{ item.name }}
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-4 col-xs-12 pdl-5">
                                                <label class="form-label">Account Type</label>
                                                <div class="dropdown btn-input">
                                                    <button type="text" class="form-control form-input dropdown-toggle" data-toggle="dropdown">{{ accountTypeSelected && accountTypeSelected.name }} <i aria-hidden="true" class="fa fa-angle-up"></i><i aria-hidden="true" class="fa fa-angle-down"></i></button>
                                                    <ul class="dropdown-menu">
                                                        <li class="dropdown-menu-link" v-for="(item, index) in typeBanks" :key="index" @click="changeAccountType(item.value)">
                                                            {{ item.name }}
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div class="col-md-12 col-sm-12 col-xs-12 mt-20">
                                                <label class="form-label">title</label>
                                                <div class="row mb-6" v-for="(item, indexCondition) in listCondition" :key="indexCondition">
                                                    <div class="col-4 pdr-2">
                                                        <div class="dropdown btn-input">
                                                            <button type="text" class="form-control form-input dropdown-toggle" data-toggle="dropdown">
                                                            {{ displayConditionName(item.selectedOperator) }}        
                                                            <i aria-hidden="true" class="fa fa-angle-up"></i><i aria-hidden="true" class="fa fa-angle-down"></i></button>

                                                            <ul class="dropdown-menu">
                                                                <li class="dropdown-menu-link" v-for="(operation, index) in item.operations" :key="index" @click="changeOperator(operation, indexCondition)">
                                                                    {{ displayConditionName(operation) }}
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div class="col-8 pdl-0">
                                                        <input type="text" placeholder="Type your text..." class="form-control form-input w-custom" v-model="item.description" @change="changeDescription(item.description, indexCondition)">
                                                        <span class="plus-icon" >
                                                            <img src="~/assets/images/add-icon.svg" v-if="indexCondition < 1" v-on:click="addItem()">
                                                            <img src="~/assets/images/img-sub.svg" v-else v-on:click="minusItem(indexCondition)"/>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>     
                                    </div>  
                                </div>
                                <div class="col-md-12 col-sm-12 col-xs-12">
                                    <div class="row">
                                        <div class="col-md-4 col-sm-4 col-xs-12">
                                            
                                        </div>
                                        <div class="col-md-4 col-sm-4 col-xs-12 pdr-5">
                                            <button class="form-btn" @click="createCrunchFilter()" v-if="isCreate">create</button>
                                            <button class="form-btn" @click="updateCrunchFilter()" v-if="!isCreate">Update</button>
                                        </div>
                                        <div class="col-md-4 col-sm-4 col-xs-12 pdl-5">
                                            <button class="form-btn grey" @click="$router.go(-1)">cancel</button>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-12">{{errorText}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-7 col-sm-6 col-xs-12">
                            <h3 class="title">Review list</h3>
                            <div class="row head-filter">
                                <div class="col pdr-0"><product-lookup v-model="productCode" :exclude-codes="[this.$store.state.productCode]"/></div>
                                <div class="col pdr-0"><lookup-keyword-auto v-model="client" placeholder="Select client" ref="keywordAuto"/></div>
                                <div class="col"><dropdown-account-type @accountTypeSelected='handleAccountType($event)'/></div>
                                <div class="w-100"></div>
                                <div class="col pdr-0"><dropdown-year @yearSelected="handleYear($event)"/></div>
                                <div class="col pdr-0"><dropdown-month @mounthSelected="handleMounth($event)"/></div>
                                <div class="col">
                                    <button class="form-btn" @click="previewCrunchFilter()">review</button>
                                </div>
                            </div>
                            <span class="label">Results are found</span>
                            <div class="box-preview">
                                <div class="no-data text-center" v-if="correct.list.length < 1">
                                    <img src="~/assets/images/no-data.png" alt="no data">
                                    <p class="text-note">No data available.</p>
                                </div>
                                <template v-else>
                                    <div class="row-title">
                                        <div class="col-date">
                                            Date
                                        </div>
                                        <div class="col-normal w300">Title</div>                                    
                                        <div class="col-normal w100">Bank</div>
                                        <div class="col-normal w100">Base type</div>                                   
                                        <div class="col-normal w100">Account type</div>                                    
                                        <div class="col-normal w150">Transaction Type</div>                                    
                                    </div>
                                    <div class="preview-list">
                                        <div class="row-list" v-for="(item, index) in correct.list" :key="index">
                                            <div class="col-date">
                                                {{ item.date | moment }}
                                            </div>
                                            <div class="col-normal w300">{{ item.description.original }}</div>
                                            <div class="col-normal w100">{{ item.bankId && item.bankId.name ? item.bankId.name : '' }}</div>
                                            <div class="col-normal w100">{{ item.baseType ? item.baseType : '' }}</div>
                                            <div class="col-normal w100">{{ item.type === 1 ? 'Bank' : item.type === 2 ? 'Credit card' : ''}}</div>
                                            <div class="col-normal w150">{{ item.categoryType }}</div>
                                        </div>
                                    </div>
                                </template>
                            </div>
                            <span class="label mt-30" v-if="listOperation.length">Other results</span>
                            <div class="box-preview" v-if="listOperation.length">
                                 <div class="no-data" v-if="incorrect.list.length < 1">
                                    No data.
                                </div>
                                <template v-else>
                                    <div class="row-title">
                                        <div class="col-date">
                                            Date
                                        </div>
                                        <div class="col-normal w300">Title</div>                                    
                                        <div class="col-normal w100">Bank</div>   
                                        <div class="col-normal w100">Base type</div>                                  
                                        <div class="col-normal w100">Account type</div>                                    
                                        <div class="col-normal w150">Transaction Type</div>                                    

                                    </div>
                                    <div class="preview-list">
                                        <div class="row-list" v-for="(item, index) in incorrect.list" :key="index">
                                            <div class="col-date">
                                                {{ item.date | moment }}
                                            </div>
                                            <div class="col-normal w300">{{ item.description.original }}</div>                                    
                                            <div class="col-normal w100">{{ item.bankId && item.bankId.name ? item.bankId.name : '' }}</div>                                    
                                            <div class="col-normal w100">{{ item.baseType ? item.baseType : '' }}</div>   
                                            <div class="col-normal w100">{{ item.type === 1 ? 'Bank' : 'Credit card'}}</div>                                    
                                            <div class="col-normal w150">{{ item.categoryType }}</div> 
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
      </div>
  </section>
</template>

<script>
import PageTitle from '~/components/PageTitle';
import ProductLookup from '~/components/product/ProductLookup';
import LookupKeywordAuto from '~/components/LookupKeywordAuto';
import {CrunchType, BankType, BaseType} from '~/common/commonType';
import EventBus from '~/plugins/event-bus';
import DropdownDateCruncher from '~/components/DropdownDateCruncher';
import DropdownMonth from '~/components/DropdownMonth';
import DropdownYear from '~/components/DropdownYear';
import DropdownAccountType from '~/components/DropdownAccountType';

export default {
    data() {
        return {
            arrOperation: ['contains', 'notContains', 'startsWith', 'equal'],
            userId: null,
            titles: ['Create condition'],
            titleForm: 'create form',
            crunchTypes: [],
            coas: [],
            listOperation: [],
            banks: [],
            typeBanks: [],
            baseType: {},
            listCondition: [],
            isGlobal: true,
            groupId: null,
            groupName: null,
            coaId: null,
            coaName: null,
            productCode: null,
            client: null,
            bankId: null,
            crunchTypeSelected: null,
            accountTypeSelected: null,
            baseTypeSelected: null,
            searchBank: '',
            bankSelected: null,
            errorText: '',
            isCoa: false,
            isCreate: true,
            correct: {
                list: [],
            },
            incorrect: {
                list: [],
            },
            coa: {
                keyword: '',
                isLoad: true,
                list: [],
                page: 1,
                limit: 20,
                total: null,
                timeout: null,
            },
            isLoadChart: false,
            timeout: null
        };
    },
    components: {
        PageTitle,
        ProductLookup,
        LookupKeywordAuto,
        DropdownDateCruncher,
        DropdownMonth,
        DropdownYear,
        DropdownAccountType
    },
    async created() {
        this.$setLoading();
        this.typeBanks = [{name: 'None', value: 0}];
        Object.keys(BankType).forEach(key => {
            this.typeBanks.push({name: key, value: BankType[key]});
        });
        this.changeAccountType(0);

        this.baseTypes = [{name: 'None', value: 0}];
        Object.keys(BaseType).forEach(key => {
            this.baseTypes.push({name: key, value: BaseType[key]});
        });
        this.changeBaseType(this.baseTypes[0].name);

        this.crunchTypes = Object.keys(CrunchType).map(key => ({name: key, value: CrunchType[key]}));
        this.getProviders();
        await this.getChartAccount();
        await this.countChartAccount();

        if (!this.$route.query.id) {
            if (this.$store.state.userAuth && this.$store.state.userAuth.permission && this.$store.state.userAuth.permission.role && this.$store.state.userAuth.permission.role.code !== 1)
                this.isGlobal = false;
            this.reset();
        }
        else {
            this.titles = ['Update condition'];
            this.titleForm = 'Update form';
            this.isCreate = false;
            await this.getCrunchFilterById(this.$route.query.id);
            if (this.listCondition.length === 0) {
                this.listCondition = [{
                    operations: this.arrOperation,
                    operation: 'contains',
                    description: '',
                    selectedOperator: 'contains',
                }];
            }
        }
        this.$setLoading(false);
        if (process.browser)
            document.getElementById('coaBox').addEventListener('scroll', this.scrollCoaBox);
    },
    destroyed() {
        if (process.browser)
            document.getElementById('coaBox').removeEventListener('scroll', this.scrollCoaBox);
    },
    watch: {
        'productCode': {
            handler(value) {
                this.openKeyWordAuto(value);
            },
            deep: true
        },
    },
    methods: {
        reset() {
            this.coas = [];
            this.listCondition = [{
                operations: this.arrOperation,
                operation: this.arrOperation[0],
                description: '',
                selectedOperator: this.arrOperation[0],
            }];
            this.listOperation = [];
            this.groupId = null;
            this.groupName = null;
            this.coaId = null;
            this.coaName = null;
            this.productCode = null;
            this.client = null;
            this.conditions = {};
            this.crunchTypeSelected = null;
            this.accountTypeSelected = null;
            this.bankTypeSelected = null;
            this.searchBank = '';
            this.bankSelected = null;
            this.errorfetchChartAccountText = '';
            this.coa = {
                keyword: '',
                isLoad: true,
                list: [],
                page: 1,
                limit: 20,
                total: null,
                timeout: null
            };
            this.isLoadChart = false;
            this.year = null;
            this.mounth = null;
            this.accountTypeComponent = null;
        },
        async getCrunchFilterById(_id) {
            let {data, error} = await this.$services.crunchService.getCrunchFilterById(_id);
            if (error)
                this.errorText = error;
            else {
                if (!data)
                    return;

                this.crunchTypeSelected = this.crunchTypes.find(crunchType => crunchType.value === data.groupId);
                this.bankSelected = data.bankId;
                this.searchBank = data.bankId ? data.bankId.name : '';

                this.isGlobal = data.isGlobal;
                this.groupId = data.groupId;
                this.groupName = data.groupName;
                this.coaId = data.coaId;
                this.coaName = data.coaName || '';
                this.bankId = data.bankId ? data.bankId.bankId : null;
                this.changeAccountType(data.accountType || 0);
                let baseType = this.baseTypes.find(baseType => baseType.name === data.baseType);
                this.changeBaseType(baseType ? baseType.name : this.baseTypes[0].name);
                data.conditions.forEach(item => {
                    this.listCondition.push({
                        operations: this.arrOperation,
                        operation: item.operation ? item.operation : this.arrOperation[0],
                        description: item.description ? item.description : '',
                        selectedOperator: item.operation ? item.operation : this.arrOperation[0]
                    });
                });

                if (this.groupId === 1) {
                    this.isCoa = true;
                    this.coa.keyword = this.coaName;
                }
            }
        },
        async getChartAccount() {
            if (!this.coa.isLoad)
                return;
            this.coa.isLoad = false;

            let {data, error} = await this.$services.chartAccountService.search(this.coa.keyword, this.coa.page, this.coa.limit);
            if (error)
                this.errorText = error;
            else {
                if (data && data.length)
                    this.coa.list = this.coa.list.concat(data);
            }

            this.coa.isLoad = true;
        },
        async countChartAccount() {
            let {data, error} = await this.$services.chartAccountService.getCountSearch(this.coa.keyword);
            if (error)
                this.errorText = error;
            else
                this.coa.total = data;
        },
        getProviders() {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(async () => {
                let {data, error} = await this.$services.yodleeService.getProviders(this.searchBank);
                if (error)
                    this.errorText = error;
                else
                    this.banks = data;
            }, 800);
        },
        changeCrunchType(value) {
            if (value === CrunchType.Expenses)
                this.isCoa = true;
            else {
                this.isCoa = false;
                this.coaId = null;
                this.coaName = '';
                this.coa.keyword = '';
            }

            this.crunchTypeSelected = this.crunchTypes.find(crunchType => crunchType.value === value);
            this.groupId = this.crunchTypeSelected.value;
            this.groupName = this.crunchTypeSelected.name;
        },
        searchCoa() {
            if (this.isCoa && this.coa.keyword !== this.coaName) {
                clearTimeout(this.coa.timeout);
                this.coa.timeout = setTimeout(() => {
                    this.fetchChartAccount();
                }, 800);
            }
        },
        changeCoa(item) {
            this.coaId = item.coa._id;
            this.coaName = item.coa.name;
            this.coa.keyword = item.coa.name;
        },
        scrollCoaBox(event) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                let element = event.target;
                if (element.scrollTop >= element.scrollHeight - element.offsetHeight - 20) {
                    this.coa.page++;
                    this.getChartAccount();
                }
            }, 400);
        },
        fetchChartAccount() {
            this.isLoadChart = true;
            this.coa.isLoad = true;
            this.coa.total = 0;
            this.coa.list = [];
            this.coa.page = 1;

            this.getChartAccount();
            this.countChartAccount();
            this.isLoadChart = false;
        },
        changeOperator(item, index) {
            this.listCondition[index].selectedOperator = item;
            this.listCondition[index].operation = item;
        },
        changeDescription(item, index) {
            this.listCondition[index].description = item;
        },
        changeAccountType(value) {
            let item = this.typeBanks.find(item => item.value === value);
            this.accountTypeSelected = item;
            this.accountType = item ? item.value : 0;
        },
        changeBaseType(name) {
            this.baseTypeSelected = this.baseTypes.find(baseType => baseType.name === name);
        },
        changeBank(item) {
            this.bankId = item.bankId;
            this.searchBank = item.name;
            this.bankSelected = item;
        },
        addItem() {
            let item = {
                operations: this.arrOperation,
                operation: this.arrOperation[0],
                description: '',
                selectedOperator: this.arrOperation[0],
            };
            this.listCondition.push(item);
        },
        minusItem(index) {
            this.listCondition.splice(index, 1);
        },
        async previewCrunchFilter() {
            if (this.client && this.productCode && this.year && this.mounth && this.accountTypeComponent) {
                this.$setLoading();
                this.listOperation = [];
                this.listCondition.forEach(item => {
                    if (item.operation && item.description) {
                        this.listOperation.push({operation: item.operation, description: item.description});
                    }
                });

                let conditionfilter = {
                    // userId: this.client._id,
                    // role: this.client.permission.role.code,
                    conditions: this.listOperation,
                    bankId: this.bankSelected ? this.bankSelected.bankId : 0,
                    accountType: this.accountType,
                    baseType: this.baseTypeSelected && this.baseTypeSelected.name ? this.baseTypeSelected.name.toUpperCase() : ''
                };
                let {data} = await this.$services.transactionService.previewCrunchAutomation(this.client._id, this.accountTypeComponent, this.year, this.mounth, conditionfilter);
                if (data) {
                    this.correct.list = data.correctList || [];
                    this.incorrect.list = data.incorrectList || [];
                }
            }
            else {
                let missingFieldFilter = [];
                missingFieldFilter.push(!this.productCode ? 'Product' : !this.client ? 'Client' : !this.crunchTypeSelected ? 'Crunch Type' : this.crunchTypeSelected.value === CrunchType.Expenses && !this.coaId ? 'Chart Of Account' : !this.baseTypeSelected ? 'Type' : '');
                EventBus.$emit('NOTIFICATION_WARNING', {title: 'Warning', description: 'Miss ' + missingFieldFilter[0] + ' Condition'});
            }
            this.$setLoading(false);
        },
        async createCrunchFilter() {
            this.$setLoading();
            this.listOperation = [];
            this.listCondition.forEach(item => {
                if (item.operation && item.description)
                    this.listOperation.push({operation: item.operation, description: item.description});
            });
            if ((!this.crunchTypeSelected || this.crunchTypeSelected.value !== CrunchType.Income) && (!this.listOperation || !this.listOperation.length)) {
                EventBus.$emit('NOTIFICATION_WARNING', {title: 'Warning', description: 'Missing text search Field!'});
                this.$setLoading(false);
                return;
            }
            if (((this.crunchTypeSelected && this.crunchTypeSelected.value === CrunchType.Expenses && this.coaId) || (this.crunchTypeSelected && this.crunchTypeSelected.value !== CrunchType.Expenses)) && this.baseTypeSelected) {
                this.conditions = {
                    userId: this.$store.state.userAuth._id,
                    isGlobal: this.isGlobal,
                    groupId: this.groupId,
                    groupName: this.groupName,
                    coaId: this.coaId ? this.coaId : null,
                    coaName: this.coaName ? this.coaName : null,
                    conditions: this.listOperation,
                    bankId: this.bankId || '',
                    accountType: this.accountType,
                    baseType: this.baseTypeSelected && this.baseTypeSelected.name ? this.baseTypeSelected.name.toUpperCase() : ''
                };
                let {data, error} = await this.$services.crunchService.createCrunchFilter(this.conditions);
                if (!data || error) {
                    let missingFieldCreate = [];
                    missingFieldCreate.push(!this.crunchTypeSelected ? 'Crunch Type' : this.crunchTypeSelected.value === CrunchType.Expenses && !this.coaId ? 'Chart Of Account' : 'All Condition');
                    EventBus.$emit('NOTIFICATION_WARNING', {title: 'Warning', description: 'Missing ' + missingFieldCreate[0] + ' Field!'});
                }
                else
                    this.$router.go(-1);
            }
            else {
                let missingFieldCreate = [];
                missingFieldCreate.push(!this.crunchTypeSelected ? 'Crunch Type' : this.crunchTypeSelected.value === CrunchType.Expenses && !this.coaId ? 'Chart Of Account' : !this.bankSelected ? 'Bank' : !this.baseTypeSelected ? 'Type' : '');
                EventBus.$emit('NOTIFICATION_WARNING', {title: 'Warning', description: 'Missing ' + missingFieldCreate[0] + ' Field!'});
            }
            this.$setLoading(false);
        },
        async updateCrunchFilter() {
            this.$setLoading();
            this.listOperation = [];
            this.listCondition.forEach(item => {
                if (item.operation && item.description)
                    this.listOperation.push({operation: item.operation, description: item.description});
            });
            if ((!this.crunchTypeSelected || this.crunchTypeSelected.value !== CrunchType.Income) && (!this.listOperation || !this.listOperation.length)) {
                EventBus.$emit('NOTIFICATION_WARNING', {title: 'Warning', description: 'Missing text search Field!'});
                this.$setLoading(false);
                return;
            }
            if (((this.crunchTypeSelected && this.crunchTypeSelected.value === CrunchType.Expenses && this.coaId) || (this.crunchTypeSelected && this.crunchTypeSelected.value !== CrunchType.Expenses)) && this.baseTypeSelected) {
                this.conditions = {
                    userId: this.$store.state.userAuth._id,
                    isGlobal: this.isGlobal,
                    groupId: this.groupId,
                    groupName: this.groupName,
                    coaId: this.coaId ? this.coaId : null,
                    coaName: this.coaName ? this.coaName : null,
                    conditions: this.listOperation,
                    bankId: this.bankId || null,
                    accountType: this.accountType,
                    baseType: this.baseTypeSelected && this.baseTypeSelected.name ? this.baseTypeSelected.name.toUpperCase() : ''
                };
                let {data, error} = await this.$services.crunchService.updateCrunchFilter(this.$route.query.id, this.conditions);
                if (!data || error) {
                    let missingFieldCreate = [];
                    missingFieldCreate.push(!this.crunchTypeSelected ? 'Crunch Type' : this.crunchTypeSelected.value === CrunchType.Expenses && !this.coaId ? 'Chart Of Account' : 'All Condition');
                    EventBus.$emit('NOTIFICATION_WARNING', {title: 'Warning', description: 'Missing ' + missingFieldCreate[0] + ' Field!'});
                }
                else
                    this.$router.go(-1);
            }
            else {
                let missingFieldCreate = [];
                missingFieldCreate.push(!this.crunchTypeSelected ? 'Crunch Type' : this.crunchTypeSelected.value === CrunchType.Expenses && !this.coaId ? 'Chart Of Account' : !this.baseTypeSelected ? 'Type' : '');
                EventBus.$emit('NOTIFICATION_WARNING', {title: 'Warning', description: 'Missing ' + missingFieldCreate[0] + ' Field!'});
            }
            this.$setLoading(false);
        },
        displayConditionName(operation) {
            if (!operation)
                return '';
            return operation === 'notContains' ? 'Not contains'.toUpperCase() : (operation === 'startsWith' ? 'Starts with'.toUpperCase() : operation.toUpperCase());
        },
        openKeyWordAuto(product) {
            this.$refs.keywordAuto.open(product);
        },
        handleYear(year) {
            this.year = year;
        },
        handleMounth(mounth) {
            this.mounth = mounth;
        },
        handleAccountType(accountType) {
            if (accountType === 'Bank')
                this.accountTypeComponent = 1;
            else if (accountType === 'CreditCard')
                this.accountTypeComponent = 2;
            else
                this.accountTypeComponent = null;
        }
    },
    filters: {
        moment(data) {
            let date = new Date(data);
            return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
        },
    },
};
</script>
