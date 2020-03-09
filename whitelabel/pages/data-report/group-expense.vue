<template>
    <section class="group-expense">
        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12 page-head">
                <div class="row">
                    <div class="col-md-6 col-sm-6 col-xs-12">
                        <page-title :titles="titles"/>
                    </div>
                    <div class="col-md-6 col-sm-6 col-xs-12 text-right">
                        <div class="dropdown normal-btn">
                            <button @click="$router.go(-1)" class="btn dropdown-toggle not-arrow" style="margin-right: 10px;">
                                    BACK
                            </button>
                            <button @click="createGroup" class="btn dropdown-toggle not-arrow" data-toggle="modal" data-target="#add-group-expense">
                                    ADD NEW
                            </button>
                        </div>       
                    </div>
                </div>
            </div>
            <div class="col-md-12 col-sm-12 col-xs-12 page-list"> 
                <div class="row">
                    <no-ssr>
                        <div class="col-md">
                            <div style="margin-top:15px" class="no-data" v-if="groupExpense.list.length === 0">Group expense is not created yet.</div>
                            <div class="box">
                                <div v-if="groupExpense.list.length > 0" class="box-item pdr-15">
                                    <draggable v-model="groupExpense.list" @end="handleChange">
                                        <div class="row row-item" v-for="(item, index) in groupExpense.list" :key="index">
                                            <div class="col align-self-center">
                                                <span class="item-normal">{{item.name}}</span>
                                            </div>
                                            <div class="col-2 align-self-center text-right">
                                                <div class="dropdown dropdown-option">
                                                    <a class="item-option dropdown-toggle" data-toggle="dropdown">
                                                        ...
                                                    </a>
                                                    <a @click="reloadCoaByGroup(item._id, index)" class="item-option">
                                                        <i class="fa fa-repeat" aria-hidden="true"></i>
                                                    </a>
                                                    <ul class="dropdown-menu">
                                                    <li @click="addCoa(item._id)" ><a class="option-item" data-toggle="modal" data-target="#add-coa"><img class="option-icon" src="~/assets/images/icon-add.svg"><span class="option-label">Add COA</span></a></li>
                                                        <li @click="editGroup(item._id, item.code, item.name, item.order)" ><a class="option-item" data-toggle="modal" data-target="#add-group-expense"><img class="option-icon" src="~/assets/images/icon-edit.svg"><span class="option-label">Edit group</span></a></li>
                                                        <li @click="deleteGroup(item._id)"><a class="option-item dropdown-toggle" data-toggle="modal" data-target="#popup-confirm"><img class="option-icon" src="~/assets/images/icon-delete.svg"><span class="option-label">Delete group</span></a></li>
                                                    </ul>
                                                </div>
                                                <a class="item-expand" data-toggle="collapse" :data-target="`#box_coa_${index}`" @click="submitGetCoaByProduct(item._id, index)">
                                                    <i class="fa fa-caret-down" aria-hidden="true"></i>
                                                </a>
                                            </div>
                                            <div :class="{'mt-0':!item.sub}" class="col-12 collapse box-coa" :id="`box_coa_${index}`">
                                                <div class="coa-list" v-if="!item.sub">
                                                    <div class="row">
                                                        <div class="col-2"><label class="col-label">COA code</label></div>
                                                        <div class="col-10"><label class="col-label">COA name</label></div>
                                                    </div>
                                                    <div class="row coa-row" v-if="item.coas" v-for="(item_coa, index) in item.coas" :key="index">
                                                        <div class="col-2"><span class="item-normal">{{item_coa.code}}</span></div>
                                                        <div class="col-10"><span class="item-normal">{{item_coa.name}}</span></div>
                                                    </div>
                                                </div>
                                                <div class="expense-sub" v-else>
                                                    <draggable v-model="item.sub" :options="{group:'sub'}">
                                                        <div class="row" v-for="(item1, index1) in item.sub" :key="index1">
                                                            <div class="col-12">
                                                                <div class="expense-sub-item row">
                                                                    <div class="col align-self-center">
                                                                        <span class="item-normal">1-1000 {{item1.name}}</span>
                                                                    </div>
                                                                    <div class="col-2 align-self-center text-right">
                                                                        <div class="dropdown dropdown-option">
                                                                            <a class="item-option dropdown-toggle" data-toggle="dropdown">
                                                                                ...
                                                                            </a>
                                                                            <ul class="dropdown-menu">
                                                                                <li><a class="option-item" data-toggle="modal" data-target="#add-edit-coa"><img class="option-icon" src="~/assets/images/icon-add.svg"><span class="option-label">Add COA</span></a></li>
                                                                                <li><a class="option-item"><img class="option-icon" src="~/assets/images/icon-edit.svg"><span class="option-label">Edit group</span></a></li>
                                                                                <li><a class="option-item"><img class="option-icon" src="~/assets/images/icon-delete.svg"><span class="option-label">Delete group</span></a></li>
                                                                            </ul>
                                                                        </div>
                                                                        <a class="item-expand" data-toggle="collapse" :data-target="`#expense_sub1_${index}_${index1}`">
                                                                            <i class="fa fa-caret-down" aria-hidden="true"></i>
                                                                        </a>
                                                                    </div>
                                                                    <div class="col-12 collapse" :id="`expense_sub1_${index}_${index1}`" v-if="!item1.sub">
                                                                        <div class="coa-list">
                                                                            <div class="row">
                                                                                <div class="col-2"><label class="col-label">COA code</label></div>
                                                                                <div class="col-10"><label class="col-label">COA name</label></div>
                                                                            </div>
                                                                            <div class="row coa-row" v-for="(item_coa1, index) in item1.coa" :key="index">
                                                                                <div class="col-2"><span class="item-normal">{{item_coa1.id}}</span></div>
                                                                                <div class="col-10"><span class="item-normal">{{item_coa1.name}}</span></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            <div v-if="item1.sub" class="col-12 collapse" :id="`expense_sub1_${index}_${index1}`">
                                                                <div class="expense-sub">
                                                                    <draggable v-model="item1.sub" :options="{group:'sub'}">
                                                                        <div class="row" v-for="(item2, index2) in item1.sub" :key="index2">
                                                                            <div class="col-12">
                                                                                <div class="expense-sub-item row">
                                                                                    <div class="col align-self-center">
                                                                                        <span class="item-normal">1-1000 {{item2.name}}</span>
                                                                                    </div>
                                                                                    <div class="col-2 align-self-center text-right">
                                                                                        <div class="dropdown dropdown-option">
                                                                                            <a class="item-option dropdown-toggle" data-toggle="dropdown">
                                                                                                ...
                                                                                            </a>
                                                                                            <ul class="dropdown-menu">
                                                                                                <li><a class="option-item" data-toggle="modal" data-target="#add-edit-coa"><img class="option-icon" src="~/assets/images/icon-add.svg"><span class="option-label">Add COA</span></a></li>
                                                                                                <li><a class="option-item"><img class="option-icon" src="~/assets/images/icon-edit.svg"><span class="option-label">Edit group</span></a></li>
                                                                                                <li><a class="option-item"><img class="option-icon" src="~/assets/images/icon-delete.svg"><span class="option-label">Delete group</span></a></li>
                                                                                            </ul>
                                                                                        </div>
                                                                                        <a class="item-expand" data-toggle="collapse" :data-target="`#expense_sub2_${index}_${index1}_${index2}`">
                                                                                            <i class="fa fa-caret-down" aria-hidden="true"></i>
                                                                                        </a>
                                                                                    </div>
                                                                                    <div class="col-12 collapse" v-if="!item2.sub" :id="`expense_sub2_${index}_${index1}_${index2}`">
                                                                                        <div class="coa-list">
                                                                                            <div class="row">
                                                                                                <div class="col-2"><label class="col-label">COA code</label></div>
                                                                                                <div class="col-10"><label class="col-label">COA name</label></div>
                                                                                            </div>
                                                                                            <div class="row coa-row" v-for="(item_coa2, index) in item2.coa" :key="index">
                                                                                                <div class="col-2"><span class="item-normal">{{item_coa2.id}}</span></div>
                                                                                                <div class="col-10"><span class="item-normal">{{item_coa2.name}}</span></div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div class="col-12 collapse" v-if="item2.sub" :id="`expense_sub2_${index}_${index1}_${index2}`">
                                                                                <div class="expense-sub">
                                                                                    <draggable :options="{group:'sub'}">
                                                                                        <div class="row expense-sub-item" v-for="(item3, index3) in item2.sub" :key="index3">
                                                                                            <div class="col align-self-center">
                                                                                                <span class="item-normal">1-1000 {{item3.name}}</span>
                                                                                            </div>
                                                                                            <div class="col-2 align-self-center text-right">
                                                                                                <div class="dropdown dropdown-option">
                                                                                                    <a class="item-option dropdown-toggle" data-toggle="dropdown">
                                                                                                        ...
                                                                                                    </a>
                                                                                                    <ul class="dropdown-menu">
                                                                                                        <li><a class="option-item" data-toggle="modal" data-target="#add-edit-coa"><img class="option-icon" src="~/assets/images/icon-add.svg"><span class="option-label">Add COA</span></a></li>
                                                                                                        <li><a class="option-item"><img class="option-icon" src="~/assets/images/icon-edit.svg"><span class="option-label">Edit group</span></a></li>
                                                                                                        <li><a class="option-item"><img class="option-icon" src="~/assets/images/icon-delete.svg"><span class="option-label">Delete group</span></a></li>
                                                                                                    </ul>
                                                                                                </div>
                                                                                                <a class="item-expand" data-toggle="collapse" :data-target="`#expense_sub3_${index}_${index1}_${index2}_${index3}`">
                                                                                                    <i class="fa fa-caret-down" aria-hidden="true"></i>
                                                                                                </a>
                                                                                            </div>
                                                                                            <div class="col-12 collapse" :id="`expense_sub3_${index}_${index1}_${index2}_${index3}`">
                                                                                                <div class="coa-list">
                                                                                                    <div class="row">
                                                                                                        <div class="col-2"><label class="col-label">COA code</label></div>
                                                                                                        <div class="col-10"><label class="col-label">COA name</label></div>
                                                                                                    </div>
                                                                                                    <div class="row coa-row" v-for="(item_coa3, index) in item3.coa" :key="index">
                                                                                                        <div class="col-2"><span class="item-normal">{{item_coa3.id}}</span></div>
                                                                                                        <div class="col-10"><span class="item-normal">{{item_coa3.name}}</span></div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </draggable>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </draggable>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </draggable>
                                                </div>
                                            </div>
                                        </div>
                                    </draggable>
                                </div>
                                <div class="box-coa-not box-item pdr-15">
                                    <div class="row row-item">
                                        <div class="col align-self-center">
                                            <span class="item-normal">Chart of account not in the group</span>
                                        </div>
                                        <div class="col-2 align-self-center text-right">
                                            <div class="dropdown dropdown-option">
                                                <a class="item-option">
                                                        <i @click="reloadCoaNotInGroup()" class="fa fa-repeat" aria-hidden="true"></i>
                                                    </a>
                                            </div>
                                            <a class="item-expand" data-toggle="collapse" data-target="#coa_not_group" @click="getChartAccount">
                                                <i class="fa fa-caret-down" aria-hidden="true"></i>
                                            </a>
                                        </div>
                                        <div class="col-12 collapse" id="coa_not_group">
                                            <div class="coa-list scroll body-scroll-coa">
                                                <div class="coa-scroll">
                                                    <div class="row">
                                                        <div class="col-2"><label class="col-label">COA code</label></div>
                                                        <div class="col-10"><label class="col-label">COA name</label></div>
                                                    </div>
                                                    <div v-if="chartAccount && chartAccount.list && chartAccount.list.length > 0" class="row coa-row" v-for="(item, index) in chartAccount.list" :key="index">
                                                        <div class="col-2"><span class="item-normal">{{ item.coa[0].code }}</span></div>
                                                        <div class="col-10"><span class="item-normal">{{ item.coa[0].name }}</span></div>
                                                    </div>
                                                    <div class="row coa-row" v-else>
                                                        <div class="col-10"><span class="item-normal">Not found!</span></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </no-ssr>
                    <div class="col-md-auto">
                        <!-- <started-list /> -->
                        <history-logs />
                        <add-coa id="add-coa" ref="addCoa" @deleteCoaInGroup="deleteCoaInGroup($event)"/>
                        <add-group-expense :groupData="groupData" @createSuccess="handleSuccess($event)" ref="formInfoGroup"/>
                        <confirm-group-expense :id="dataConfirm.id" :user="dataConfirm.user" :title="dataConfirm.title" :description="dataConfirm.description" :buttonAction="dataConfirm.buttonAction" :buttonCancel="dataConfirm.buttonCancel" @handleAction="handleAction($event)"></confirm-group-expense>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import StartedList from '~/components/StartedList';
import HistoryLogs from '~/components/HistoryLogs';
import ConfirmGroupExpense from '~/components/ConfirmGroupExpense';
import AddCoa from '~/components/GroupExpense/AddCoa';
import AddGroupExpense from '~/components/GroupExpense/AddGroupExpense';
import PageTitle from '~/components/PageTitle';
export default {
    data() {
        return {
            groupExpense: {
                list: [],
                page: 1,
                limit: 100,
            },
            chartAccount: {
                isLoad: false,
                list: [],
                page: 0,
                limit: 10,
                total: 0
            },
            groupData: {
                idGroupExpense: '',
                nameGroupexpense: '',
                codeGroupExpense: '',
                action: 'create'
            },
            dataConfirm: {
                id: '',
                user: {
                    img: '',
                    name: '',
                    email: ''
                },
                buttonAction: 'Delete',
                buttonCancel: 'Cancel',
                title: 'Do you sure you want to delete this group?',
                description: '',
            },
            titles: ['Group expensive'],
            showLoading: false,
            termGroupExpend: [],
        };
    },
    components: {
        StartedList,
        HistoryLogs,
        ConfirmGroupExpense,
        AddCoa,
        AddGroupExpense,
        PageTitle
    },
    created() {
        this.getList();
    },
    updated() {
        this.scrollChartAccount();
    },
    methods: {
        async reloadCoaNotInGroup() {
            this.chartAccount = {
                list: [],
                page: 0,
                limit: 10,
                total: 0
            };
            await this.getChartAccount();
        },
        async getChartAccount() {
            if (this.chartAccount.list.length)
                return;
            await this.getChartAccountByProduct();
        },
        async getChartAccountByProduct() {
            this.chartAccount.isLoad = false;

            if (this.chartAccount.page === 0)
                await this.getCountWithProduct();

            let {data, error} = await this.$services.groupExpenseService.getChartAccountByProduct(this.chartAccount.page + 1, this.chartAccount.limit);
            if (error)
                return error;
            else {
                this.chartAccount.page++;
                this.chartAccount.list = this.chartAccount.list.concat(data);
                this.chartAccount.isLoad = true;
            }
        },
        async getCountWithProduct() {
            let {data, error} = await this.$services.groupExpenseService.getCountWithProduct();
            if (error)
                console.log(error);
            else {
                this.chartAccount.total = data;
            }
        },
        async getList() {
            let {data, error} = await this.$services.groupExpenseService.listGroup(this.groupExpense.page, this.groupExpense.limit);
            if (error)
                return;
            this.groupExpense.list = data;
            this.termGroupExpend = data;
            // console.log('this.groupExpense.list==>', this.groupExpense.list);
            // console.log('this.termGroupExpend==>', this.termGroupExpend);
        },
        async reloadCoaByGroup(groupExpensePageId, index) {
            await this.getCoaByGroup(groupExpensePageId, index);
        },
        async submitGetCoaByProduct(groupExpensePageId, index) {
            if (this.groupExpense.list[index].coas.length)
                return;

            await this.getCoaByGroup(groupExpensePageId, index);
        },
        async getCoaByGroup(groupExpensePageId, index) {
            // if (isLoad) {
            //     this.groupExpense.list[index].isLoad = false;
            //     return;
            // }

            let {data, error} = await this.$services.groupExpenseService.getCoaWithGroup(groupExpensePageId);
            if (error)
                return;
            this.groupExpense.list[index].coas = data.coas;
        },
        deleteGroup(groupExpensePageId) {
            this.dataConfirm = {
                id: groupExpensePageId,
                user: {
                    img: '',
                    name: '',
                    email: ''
                },
                buttonAction: 'Delete',
                buttonCancel: 'Cancel',
                title: 'Do you sure you want to delete this group?',
                description: ''
            };
        },
        async handleAction(event) {
            let result = await this.$services.groupExpenseService.deleteGroup(event.id);
            if (result.data) {
                for (let i = 0; i < this.groupExpense.list.length; i++) {
                    if (this.groupExpense.list[i]._id === event.id) {
                        this.groupExpense.list.splice(i, 1);
                        this.$forceUpdate();
                        this.exitModalConfirm();
                        return;
                    }
                }
            }
        },
        createGroup() {
            this.$refs.formInfoGroup.resetForm();
            this.groupData = {
                action: 'create',
                idGroupExpense: '',
                nameGroupexpense: '',
                codeGroupExpense: '',
                order: this.groupExpense.list.length
            };
        },
        editGroup(id, code, name, order) {
            this.$refs.formInfoGroup.resetForm();
            this.groupData = {
                action: 'edit',
                idGroupExpense: id,
                nameGroupexpense: name,
                codeGroupExpense: code,
                orderGroupExpense: order
            };
        },
        async handleChange(element) {
            let startIndex = element.newIndex <= element.oldIndex ? element.newIndex : element.oldIndex;
            let endIndex = element.newIndex >= element.oldIndex ? element.newIndex : element.oldIndex;
            // console.log('startIndex', startIndex);
            // console.log('endIndex', endIndex);

            if (startIndex === endIndex)
                return false;

            this.termGroupExpend = this.termGroupExpend.map((item, index, array) => {
                if (index < startIndex || index > endIndex)
                    return false;

                if (element.newIndex < element.oldIndex) {
                    if (index === endIndex)
                        item.order = array.length - startIndex;
                    else
                        item.order = array.length - (index + 1);
                }
                else if (element.newIndex > element.oldIndex) {
                    if (index === startIndex)
                        item.order = array.length - endIndex;
                    else
                        item.order = array.length - (index - 1);
                }

                // console.log('item.order==>', item.order);

                return item;
            });

            let result = await this.$services.groupExpenseService.orderGroup(this.termGroupExpend);

            // console.log('after change==>', this.termGroupExpend);

            if (result)
                this.getList();
        },
        async addCoa(groupId) {
            if (!groupId)
                return;
            let {data, error} = await this.$services.groupExpenseService.getGroupById(groupId);
            if (error)
                console.log(error);
            else
                this.$refs.addCoa.open(data);
        },
        handleSuccess(event) {
            if (this.groupData.action === 'edit') {
                for (let i = 0; i < this.groupExpense.list.length; i++) {
                    if (this.groupExpense.list[i]._id === event._id) {
                        this.groupExpense.list[i] = event;
                        this.$forceUpdate();
                        return;
                    }
                }
            }
            else if (this.groupData.action === 'create') {
                let temp = [];
                temp[0] = event;
                this.groupExpense.list = temp.concat(this.groupExpense.list);
            }
        },
        exitModalConfirm() {
            $('#popup-confirm').modal('hide');
        },
        async scrollChartAccount() {
            let bodyScrollCoa = document.querySelector('.body-scroll-coa');
            let scrollCOAEl = document.querySelector('.coa-scroll');
            if (bodyScrollCoa && scrollCOAEl) {
                bodyScrollCoa.addEventListener('scroll', async () => {
                    if (scrollCOAEl.offsetHeight > 0) {
                        if ((bodyScrollCoa.scrollTop + bodyScrollCoa.offsetHeight) >= scrollCOAEl.offsetHeight) {
                            if (this.chartAccount.page * this.chartAccount.limit < this.chartAccount.total && this.chartAccount.isLoad) {
                                await this.getChartAccountByProduct();
                            }
                        }
                    }
                });
            }
        },
        deleteCoaInGroup(groupId, coaId) {
            for (let i = 0; i < this.groupExpense.list.length; i++) {
                if (this.groupExpense.list[i]._id === groupId) {
                    if (this.groupExpense.list[i].coas && this.groupExpense.list[i].coas.length) {
                        for (let j = 0; j < this.groupExpense.list[i].coas.length; j++) {
                            if (this.groupExpense.list[i].coas[j]._id === coaId)
                                this.groupExpense.list[i].coas.splice(j, 1);
                        }
                    }
                }
            }
            this.$forceUpdate();
        }
    }
};
</script>


