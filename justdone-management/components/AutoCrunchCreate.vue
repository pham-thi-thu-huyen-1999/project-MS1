<template>
    <div :class="{preview: isPreview}" class="modal show fade box-popup product-detail" :id="id" role="dialog" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">   
                    <div class="form-group" v-if="!isPreview">
                        <div class="row">
                            <div class="col-12">
                                <label class="form-label">TYPES</label>
                                <div class="dropdown btn-input">
                                    <input type="text" class="form-control form-input dropdown-toggle" data-toggle="dropdown" :placeholder=" selectedCrunch ? selectedCrunch : 'Type name...'">
                                    <ul class="dropdown-menu">
                                        <li class="dropdown-menu-link" v-for="(item, index) in crunchTypes" :key="index" @click="chanceCrunch(index, item)">
                                            {{index}}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col-12" v-if="isCoa">
                                <label class="form-label">COA</label>
                                <div class="dropdown btn-input">
                                    <input type="text" class="form-control form-input dropdown-toggle" data-toggle="dropdown" :placeholder=" selectedCoa ? selectedCoa : 'COA...'">
                                    <ul class="dropdown-menu">
                                        <li class="dropdown-menu-link" v-for="(item, index) in coas" :key="index"  @click="chanceCoa(item)">
                                            {{item.coa.name}}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Compare</label>
                                <div class="row" v-for="(item, indexCondition) in listCondition" :key="indexCondition">
                                    <div class="col-4">
                                        <div class="dropdown btn-input">
                                            <button class="dropdown-toggle form-input not-arrow" type="button" data-toggle="dropdown">
                                                {{item.selectedOperator}}
                                                <i class="fa fa-angle-up" aria-hidden="true"></i>
                                                <i class="fa fa-angle-down" aria-hidden="true"></i>
                                            </button>
                                            <ul class="dropdown-menu">
                                                <li class="dropdown-menu-link" v-for="(operator, index) in item.operators" :key="index" @click="changeOperator(operator, indexCondition)">
                                                    {{operator}}
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="col-8 pdl-0">
                                        <input type="text" placeholder="Type your text..." class="form-control form-input" v-model="item.description" @change="changeDescription(item.description, indexCondition)">
                                        <span class="plus-icon" >
                                            <img src="~/assets/images/add-icon.svg" v-if="indexCondition < 1" v-on:click="addItem()">
                                            <img src="~/assets/images/img-sub.svg" v-else v-on:click="minusItem(indexCondition)"/>
                                        </span>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                    <div class="transaction" v-else>
                        <div class="row mb-30">
                            <div class="col-md-6 col-sm-6 col-xs-12">
                                <h2 class="review-title">Review</h2>
                            </div>
                            <div class="col-md-6 col-sm-6 col-xs-12 text-right">
                                <button class="form-btn grey back" @click="reset(); isPreview=false">Back</button>
                            </div>
                        </div>
                        <div class="transaction-list">
                            <div class="transaction-item" v-for="(item, index) in previews.list" :key="index">
                                <div class="header-wrapper">
                                    <div class="row">
                                        <div class="col-md-10 col-sm-10 col-xs-6">
                                                <p class="month-label" data-toggle="collapse" :data-target="'#show-item'+index">July <i class="fa fa-angle-down"></i></p>
                                        </div>
                                        <div class="col-md-2 col-sm-2 col-xs-6 text-right">
                                            <p class="balance"> CURRENT BALANCE</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="list-wrapper">
                                    <div class="close-balance">
                                        <div class="row">
                                            <div class="col-md-10 col-sm-10 col-xs-6">
                                                <span class="close-balance-label">JULY'S CLOSING BALANCE</span>
                                            </div>
                                            <div class="col-md-2 col-sm-2 col-xs-6">
                                                <span class="balance-value">$0,000,000.00
                                                    <span class="unit">AUD</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div :id="'show-item'+index" class="collapse">
                                        <div class="wrapper-item" v-for="(transaction, index) in item.arr1" :key="index">
                                            <div class="row">
                                                <div class="col-md-2 col-sm-1 col-xs-12">
                                                    <span class="balance-date">01/04/2017</span>
                                                </div>
                                                <div class="col-md-2 col-sm-1 col-xs-12">
                                                    <span class="balance-name">Label {{transaction}}</span>
                                                </div>
                                                <div class="col-md-2 col-sm-2 col-xs-12">
                                                    <span class="balance-cate">category</span>
                                                </div>
                                                <div class="col-md-2 col-sm-6 col-xs-12">
                                                    <span class="balance-value">
                                                        <span class="sub">-</span> $0,000,000.00</span>
                                                </div>
                                                <div class="col-md-2 col-sm-6 col-xs-12">
                                                    <span class="balance-value">
                                                        <span class="add">+</span> $0,000,000.00</span>
                                                </div>
                                                <div class="col-md-2 col-sm-3 col-xs-12">
                                                    <span class="balance-value">$0,000,000.00
                                                        <span class="unit">AUD</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="paginate text-right">
                                            <client-only>
                                                <pagination :page="previews.page" :limit="previews.limit" :total="previews.total" @change="changePage" />
                                            </client-only>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 text-center">
                            <p v-if="errorText" class="form-label-error" style="font-size:11px;">{{errorText}}</p>    
                        </div>
                        <div class="col-8" v-if="isPreview"></div>
                        <div class="col pdr-0" :class="{'text-right':isPreview}"><button class="form-btn grey" data-dismiss="modal">cancel</button></div>
                        <div class="col" v-if="!isPreview"><button @click="previewCrunchFilter(); isPreview = !isPreview" class="form-btn">review</button></div>
                        <div class="col pdl-0" :class="{'text-right fix-right':isPreview}"><button class="form-btn" @click="createCrunchFilter()">create</button></div>
                    </div>
                </div>
            </div>
        </div>
    </div>  
</template>

<script>
import {CrunchType} from '~/common/commonType';
import Pagination from '~/components/Pagination';

export default {
    props: ['id'],
    data() {
        return {
            crunchTypes: [],
            arrOperation: ['contains', 'startsWith', 'equal'],
            userId: this.$store.state.userAuth._id,
            coas: [],
            listCondition: [{
                operations: this.arrOperation,
                operation: '',
                description: '',
                selectedOperator: 'contains',
            }],
            listOperation: [],
            isGlobal: false,
            groupId: null,
            groupName: null,
            coaId: null,
            coaName: null,
            conditions: [],
            selectedCrunch: '',
            selectedCoa: '',
            errorText: '',
            isCoa: false,
            isPreview: false,

            arr: [{arr1: [1, 2, 3, 4]}, {arr1: []}, {arr1: [1, 2, 3, 4]}, {arr1: [1, 2, 3, 4]}],
            previews: {
                list: [],
                page: 1,
                limit: 10,
                total: 20,
            }
        };
    },
    components: {
        Pagination
    },
    methods: {
        reset() {
            this.crunchTypes = CrunchType;
            this.getChartAccount();
            this.coas = [];
            this.listCondition = [{
                operations: this.arrOperation,
                operation: 'contains',
                description: '',
                selectedOperator: 'contains',
            }];
            this.listOperation = [];
            this.isGlobal = false;
            this.groupId = null;
            this.groupName = null;
            this.coaId = null;
            this.coaName = null;
            this.conditions = {};
            this.selectedCrunch = '';
            this.selectedCoa = '';
            this.errorText = '';
            this.isCoa = false;
        },
        async getChartAccount() {
            let {data, error} = await this.$services.chartAccountService.search('', '', '');
            if (error)
                this.errorText = error;
            else
                this.coas = data;
        },
        chanceCrunch(name, val) {
            if (val === 1)
                this.isCoa = true;
            else
                this.isCoa = false;

            this.selectedCrunch = name;
            this.groupId = val;
            this.groupName = name;
        },
        chanceCoa(item) {
            this.coaId = item.coa._id;
            this.coaName = item.coa.name;
            this.selectedCoa = item.coa.name;
        },
        changeOperator(item, index) {
            this.listCondition[index].selectedOperator = item;
            this.listCondition[index].operation = item;
        },
        changeDescription(item, index) {
            this.listCondition[index].description = item;
        },
        addItem() {
            let item = {
                operations: this.arrOperation,
                operation: 'contains',
                description: '',
                selectedOperator: 'contains',
            };
            this.listCondition.push(item);
        },
        minusItem(index) {
            this.listCondition.splice(index, 1);
        },
        async previewCrunchFilter() {
            this.listCondition.forEach(item => {
                this.listOperation.push({operation: item.operation, description: item.description});
            });
            let conditionfilter = {
                userId: this.userId,
                role: 8,
                isGlobal: this.isGlobal,
                groupId: this.groupId,
                groupName: this.groupName,
                coaId: this.coaId ? this.coaId : null,
                coaName: this.coaName ? this.coaName : null,
                conditions: this.listOperation,
                permissions: this.$store.state.userAuth.permission.managers,
                page: this.previews.page,
                limit: this.previews.limit
            };
            let {data, error} = await this.$services.transactionService.previewCrunchAutomation(conditionfilter);
            if (error)
                return false;

            this.previews.list = data || [];
        },
        async createCrunchFilter() {
            this.listCondition.forEach(item => {
                this.listOperation.push({operation: item.operation, description: item.description});
            });

            this.conditions = {
                userId: this.userId,
                isGlobal: this.isGlobal,
                groupId: this.groupId,
                groupName: this.groupName,
                coaId: this.coaId ? this.coaId : null,
                coaName: this.coaName ? this.coaName : null,
                conditions: this.listOperation
            };

            let {data, error} = await this.$services.crunchService.createCrunchFilter(this.conditions);
            if (!data)
                this.errorText = error;
            else
                $('#add-product').modal('hide');
        },
        open() {
            this.reset();
            $('#' + this.id).modal('show');
            this.crunchTypes = CrunchType;
            this.getChartAccount();
        },
        close() {
            $('#add-product').modal('hide');
        },
        changePage() {

        }
    },
};
</script>

