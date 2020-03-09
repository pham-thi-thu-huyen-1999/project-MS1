<template>
     <div class="modal" tabindex="-1" role="dialog" id="modal-initial-ob">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">INITIAL OPENING BALANCE</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6 form-group">
                            <label>Select year</label>
                            <select v-model="year" class="form-control">
                                    <option v-for="year in allYear" :key="year">{{year}}</option>                                        
                            </select>
                        </div>
                        <div class="col-md-6 form-group">
                            <label>Select month</label>
                            <select
                                v-model="month"
                                class="form-control"
                            >
                                <option v-for="monthObj in allMonths" :key="monthObj.value">{{monthObj.label}}</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Opening Balance</label>
                        <input class="form-control" :value="openingBalace" @input.prevent="handleChangeOB" />
                    </div>
                </div>
                <div class="modal-footer">
                    <button
                        type="button"
                        class="btn btn-primary"
                        @click="handleInitialOB"
                    >
                        Save changes
                    </button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'modal-initial-ob',
    props: {
        financialYears: {
            type: Array,
            default: []
        },
        accountSelected: {
            type: Object
        }
    },
    data() {
        return {
            allYear: [],
            allMonths: [
                {label: 'January', value: 1},
                {label: 'February', value: 2},
                {label: 'March', value: 3},
                {label: 'April', value: 4},
                {label: 'May', value: 5},
                {label: 'June', value: 6},
                {label: 'July', value: 7},
                {label: 'August', value: 8},
                {label: 'September', value: 9},
                {label: 'October', value: 10},
                {label: 'November', value: 11},
                {label: 'December', value: 12}
            ],
            month: 0,
            year: 0,
            openingBalace: ''
        };
    },
    watch: {
        financialYears() {
            this.allYear = this.financialYears.reduce((allYearArray, currentFinancialYear) => {
                if (!allYearArray.includes(currentFinancialYear.end)) {
                    allYearArray.push(currentFinancialYear.end);
                }
                if (!allYearArray.includes(currentFinancialYear.begin)) {
                    allYearArray.push(currentFinancialYear.begin);
                }
                return allYearArray;
            }, []);
        }
    },
    methods: {
        handleChangeOB(event) {
            event.preventDefault();
            const prevOB = this.openingBalace;
            const nextOB = event.target.value;
            if (nextOB.match(/^\-?((?=.*\d)\d*(\.?)(\d{1,2})?)?$/)) { // eslint-disable-line
                this.openingBalace = nextOB;
            }
            else {
                this.openingBalace = prevOB;
            }
            this.$forceUpdate();
        },
        async handleInitialOB() {
            const cookie = this.$cookie.get('userAuth.Management');
            const parsedCookie = JSON.parse(cookie);
            if (!(this.month && this.year && this.openingBalace)) {
                this.$notify({
                    type: 'error',
                    text: 'Please fill in all input'
                });
            }
            else {
                const {userId, accountId, type} = this.accountSelected;
                const requestBody = {
                    originId: this.$get(parsedCookie, '_id', ''),
                    month: this.allMonths.find(month => month.label === this.month).value,
                    year: parseInt(this.year),
                    openBalance: parseFloat(this.openingBalace),
                    userId,
                    accountId,
                    type
                };
                try {
                    this.$setLoading();
                    const {data} = await this.$services.yodleeService.updateOpenbalanceMultiBank(requestBody);
                    if (data) {
                        $('#modal-initial-ob').modal('hide');
                        this.$notify({
                            type: 'success',
                            text: 'Initial opening balance successfully'
                        });
                        this.$emit('reload');
                    }
                    else {
                        this.$notify({
                            type: 'error',
                            text: 'Fail to update opening balance'
                        });
                    }
                }
                catch (error) {

                }
                finally {
                    this.$setLoading(false);
                }
            }
        }
    }
};
</script>