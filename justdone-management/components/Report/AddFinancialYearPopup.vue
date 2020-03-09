<template>
    <div
        class="modal fade box-popup"
        :id="id"
        role="dialog"
        data-backdrop="static"
        data-keyboard="false"
    >
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <h3 class="popup-title">{{ title }}</h3>
                    <!-- <p v-if="description" class="popup-description">{{ description }}</p> -->
                    <div class="row">
                        <div class="col-12">
                            <div class="form-group">
                                <label class="form-label">FINANCIAL YEAR</label>
                                <input
                                    v-model="newYear"
                                    type="text"
                                    class="form-control form-input"
                                >
                                <button
                                    @click="addNewYear"
                                    class="blue form-btn"
                                >ADD</button>
                            </div>
                            <div class="form-group">
                                <label class="form-label">CURRENT FINANCIAL YEAR</label>
                                <div
                                    class="list-group"
                                    v-for="(year, index) in lists"
                                    :key="index"
                                >
                                    <div class="list-group-item text-center">{{ year.begin }} - {{ year.end }} </div>
                                    <!-- <div class="list-group-item">2017-2018</div>
                                    <div class="list-group-item">2016-2017</div> -->
                                </div>
                            </div>
                            <button
                                class="form-btn grey f-left"
                                @click="cancel"
                            >Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {getFinancialYearsNew} from '~/helpers/dataHelper';
export default {
    data() {
        return {
            newYear: '',
            lists: [],
            userId: '',
            user: {},
            listConnectBank: []
        };
    },
    created() {

    },
    updated() {
        this.getFinancialYear(this.user);
    },
    props: {
        id: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: 'Are you sure?'
        },
    },
    methods: {
        open(user, bankConnect) {
            let listYear = this.getFinancialYear(user);
            this.lists = listYear;
            this.userId = user.data._id;
            this.user = user;
            this.listConnectBank = bankConnect.data;
            $('#' + this.id).modal('show');
        },
        success() {
            $('#' + this.id).modal('hide');
            this.$emit('success', this.data);
        },
        cancel() {
            $('#' + this.id).modal('hide');
            this.$emit('cancel');
        },
        // addNewYear() {
        //     this.$emit('addNew', this.newYear, this.userId);
        // },
        getFinancialYear(user) {
            let financialYears = getFinancialYearsNew(user.data.financialStart);
            return financialYears;
        },
        async addNewYear() {
            let done = await this.$services.userService.updateFinancialYear(Number(this.newYear), this.userId);
            if (done) {
                this.lists = getFinancialYearsNew(this.newYear);
                await this.$services.statementService.createStatementByAccountId(this.listConnectBank);
            }
        },
    }
};
</script>

