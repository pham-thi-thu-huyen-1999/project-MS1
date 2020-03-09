<script>
import {formatMoney} from '~/helpers/dataHelper.js';
import moment from 'moment';

export default {
    data() {
        return {
            updateData: {},
            createData: {},
            groupedTransactions: {},
            groupColors: ['red', 'blue'],
            config: {
                format: 'DD/MM/YYYY',
                useCurrent: false,
                widgetPositioning: {vertical: 'bottom'},
                focusOnShow: false,
                maxDate: false
            },
        };
    },
    props: {
        transactions: {
            type: Array,
            default: []
        },
    },
    created() {
        this.groupTransactions();
    },
    watch: {
        transactions() {
            this.groupTransactions();
        }
    },
    methods: {
        getAmount(obj, baseType) {
            const {baseType: currentBaseType, amount = {}} = obj;
            if (baseType === currentBaseType) {
                return amount;
            }
            return null;
        },
        async removeTransaction({_id, userId, accountId, type, year, month}) {
            this.$notify({type: 'warning', text: 'Are you sure to delete this transaction?'})
                .then(async () => {
                    this.$setLoading();
                    const {data} = await this.$services.transactionService.deleteAndUpdateStatement({
                        transactionId: _id,
                        userId,
                        accountId,
                        type,
                        year,
                        month
                    });
                    if (data) {
                        this.$notify({
                            type: 'success',
                            title: 'Delete transaction completed',
                        });
                        this.$emit('reload');
                    }
                    else {
                        this.$notify({
                            type: 'error',
                            title: 'Fail to delete transaction'
                        });
                    }
                    this.$setLoading(false);
                })
                .catch(() => {});
        },
        setModify(transaction) {
            const {_id, amount = {}, baseType, date, runningBalance = {}, description = {}, type, accountId, userId} = transaction;
            this.updateData = {
                _id,
                amount: amount.amount,
                baseType,
                date,
                runningBalance: runningBalance.amount,
                description: description.original || '',
                type,
                accountId,
                userId
            };
            this.createData = {};
        },
        setCreate(transaction) {
            const {_id, date, accountId, userId, type} = transaction;
            this.createData = {
                _id,
                date,
                accountId,
                userId,
                amount: '',
                description: '',
                baseType: '',
                type
            };
            this.updateData = {};
        },
        isInputNumber(string) {
            return `${string}`.match(/^((?=.*\d)\d*(\.?)(\d{1,2})?)?$/);
        },
        getCurrentAmount(obj) {
            return obj.amount || '';
        },
        changeAmount(targetObjName, baseType, event) {
            const prevValue = this.getCurrentAmount(this[targetObjName]);
            const nextValue = event.target.value;
            const isMatch = this.isInputNumber(nextValue);
            this[targetObjName] = {
                ...this[targetObjName],
                baseType,
                amount: isMatch ? nextValue : prevValue
            };
        },
        changeDescription(targetObjName, event) {
            this[targetObjName] = {
                ...this[targetObjName],
                description: event.target.value
            };
        },
        async applyUpdate() {
            this.$setLoading(true);
            const date = $('#modifyDate').val();
            const {
                baseType = '',
                _id = '',
                amount,
                description,
                type,
                userId,
                accountId
            } = this.updateData;
            const momentInstance = moment(date, 'DD/MM/YYYY');
            const month = momentInstance.month() + 1;
            const year = momentInstance.year();
            const cookie = this.$cookie.get('userAuth.Management');
            const parsedCookie = JSON.parse(cookie);
            if (!(amount && date)) {
                this.$notify({
                    type: 'error',
                    title: 'Failed',
                    text: 'Please fill required input fields'
                });
            }
            else {
                const dataToUpdate = {
                    statement: {
                        userId,
                        accountId,
                        originId: this.$get(parsedCookie, '_id', ''),
                        type,
                        month,
                        year
                    },
                    transaction: {
                        _id,
                        amount: {
                            currency: 'AUD',
                            amount
                        },
                        description: {
                            original: description
                        },
                        baseType: baseType.toLowerCase(),
                        date: momentInstance.toISOString(),
                        month,
                        year
                    }
                };
                const {data} = await this.$services.transactionService.updateManualTransaction(dataToUpdate);
                if (data) {
                    this.$notify({
                        type: 'success',
                        title: 'Success',
                        text: 'Update transaction success'
                    });
                    this.updateData = {};
                    this.$emit('reload');
                }
                else {
                    this.$notify({
                        type: 'error',
                        title: 'Failed',
                        text: 'Fail to update transaction'
                    });
                }
            }
            this.$setLoading(false);
        },
        async applyCreate() {
            this.$setLoading();
            const date = $('#createDate').val();
            const momentInstance = moment(date, 'DD/MM/YYYY');
            const {
                baseType,
                amount,
                description,
                accountId,
                userId,
                type
            } = this.createData;
            if (!(amount && description && date)) {
                this.$notify({
                    type: 'error',
                    title: 'Please fill in all input',
                });
            }
            else {
                const dataToCreate = {
                    amount: {
                        amount: parseFloat(amount || 0),
                        currency: 'AUD'
                    },
                    accountId,
                    baseType,
                    category: 'Service Charges/Fees',
                    categoryType: 'EXPENSE',
                    categoryId: 24,
                    categorySource: 'SYSTEM',
                    description: {
                        original: description,
                    },
                    date: momentInstance.toISOString(),
                    highLevelCategoryId: 10000011,
                    isManual: true,
                    postDate: momentInstance.toISOString(),
                    runningBalance: {
                        currency: 'AUD',
                        amount: 0
                    },
                    status: 'POSTED',
                    userId,
                    type,
                    month: momentInstance.month() + 1,
                    year: momentInstance.year(),
                    index: 1,
                };
                const {data} = await this.$services.transactionService.createTransactionWithoutId([dataToCreate]);
                if (data) {
                    this.$notify({
                        type: 'success',
                        title: 'Transaction was created successfully',
                    });
                    this.createData = {};
                    this.$emit('reload');
                }
                else {
                    this.$notify({
                        type: 'error',
                        title: 'Fail to create transaction',
                    });
                }
            }
            this.$setLoading(false);
        },
        cancelModify() {
            this.updateData = {};
        },
        cancelCreate() {
            this.createData = {};
        },
        groupTransactions() {
            this.groupedTransactions = this.transactions.reduce((groupedObj, item) => {
                const timestamp = moment(item.date).unix();
                const amount = this.$get(item, 'amount.amount');
                const baseType = this.$get(item, 'baseType', '');
                const description = this.$get(item, 'description.original', '').replace(/ /g, '');
                const groupName = `${timestamp}-${amount}-${baseType}-${description}`;
                if (groupedObj.hasOwnProperty(groupName)) {
                    groupedObj[groupName].push(item);
                }
                else {
                    groupedObj[groupName] = [item];
                }
                return groupedObj;
            }, {});
        },

        renderGroupIndex(groupIndex, groupLength) {
            if (groupLength > 1) {
                return (
                    <td style={{color: this.groupColors[groupIndex % 2]}}>
                        <i class="fa fa-exclamation-circle" />
                    </td>
                );
            }
            return <td></td>;
        },

        renderNormalItem(transaction, groupIndex, groupLength) {
            return (
                <tr>
                    {this.renderGroupIndex(groupIndex, groupLength)}
                    <td>{moment(transaction.date).format('DD/MM/YYYY')}</td>
                    <td>{transaction.description.original}</td>
                    <td>{transaction.baseType === 'DEBIT' && (
                        <span>
                            <span class="text-danger">-</span>
                            {formatMoney(this.$get(transaction, 'amount.amount', 0))}
                        </span>
                    )}</td>
                    <td>{transaction.baseType === 'CREDIT' && (
                        <span>
                            <span class="text-success">+</span>
                            {formatMoney(this.$get(transaction, 'amount.amount', 0))}
                        </span>
                    )}</td>
                    <td>
                        {
                            this.$get(transaction, 'runningBalance.amount', 0) > 0 ? (
                                <span>
                                    <span class="text-success">+</span>
                                    {formatMoney(this.$get(transaction, 'runningBalance.amount', 0))}
                                </span>
                            ) : (
                                <span>
                                    <span class="text-danger">-</span>
                                    {formatMoney(this.$get(transaction, 'runningBalance.amount', 0))}
                                </span>
                            )
                        }
                    </td>
                    <td style="color: #1c5df4">{transaction.isManual ? 'MI' : 'BF'}</td>
                    <td>
                        <i
                            class={`icon modify mr-2 mb-2 ${transaction.isManual ? '' : 'disabled'}`}
                            onClick={() => this.setModify(transaction)}
                        />
                        <i class="icon remove mr-2 mb-2" onClick={() => this.removeTransaction(transaction)}/>
                        <i class="icon add mb-2" onClick={() => this.setCreate(transaction)}/>
                    </td>
                </tr>
            );
        },
        renderUpdateItem(transaction, groupIndex, groupLength) {
            return <tr>
                {this.renderGroupIndex(groupIndex, groupLength)}
                <td>
                    <client-only>
                        <date-picker
                            id="modifyDate"
                            placeholder="Date"
                            class="filter-value"
                            config={this.config}
                            value={moment(this.updateData.date).format('DD/MM/YYYY')}
                        />
                    </client-only>
                </td>
                <td>
                    <input
                        class="w-100 form-control"
                        type="textarea"
                        value={this.updateData.description}
                        onInput={(event) => this.changeDescription('updateData', event)}
                    />
                </td>
                <td>
                    <input
                        class="form-control"
                        value={this.getAmount(this.updateData, 'DEBIT')}
                        onInput={(event) => this.changeAmount('updateData', 'DEBIT', event)}
                    />
                </td>
                <td>
                    <input
                        class="form-control"
                        value={this.getAmount(this.updateData, 'CREDIT')}
                        onInput={(event) => this.changeAmount('updateData', 'CREDIT', event)}
                    />
                </td>
                <td></td>
                <td style="color: #1c5df4">{transaction.isManual ? 'MI' : 'BF'}</td>
                <td class="d-flex flex-wrap">
                    <i class="icon apply mr-2 mb-2" onClick={this.applyUpdate}/>
                    <i class="icon cancel mb-2" onClick={this.cancelModify} />
                </td>
            </tr>;
        },
        renderCreateItem() {
            return (
                <tr>
                    <td>New</td>
                    <td>
                        <client-only>
                            <date-picker
                                id="createDate"
                                placeholder="Date"
                                class="filter-value"
                                config={this.config}
                                value={moment(this.createData.date).format('DD/MM/YYYY')}
                            />
                        </client-only>
                    </td>
                    <td>
                        <input
                            class="w-100 form-control"
                            type="textarea"
                            value={this.createData.description}
                            onInput={(event) => this.changeDescription('createData', event)}
                        />
                    </td>
                    <td>
                        <input
                            class="form-control"
                            value={this.getAmount(this.createData, 'DEBIT')}
                            onInput={(event) => this.changeAmount('createData', 'DEBIT', event)}
                        />
                    </td>
                    <td>
                        <input
                            class="form-control"
                            value={this.getAmount(this.createData, 'CREDIT')}
                            onInput={(event) => this.changeAmount('createData', 'CREDIT', event)}
                        />
                    </td>
                    <td></td>
                    <td style="color: #1c5df4">MI</td>
                    <td class="d-flex flex-wrap">
                        <i class="icon apply mr-2 mb-2" onClick={this.applyCreate}/>
                        <i class="icon cancel mb-2" onClick={this.cancelCreate} />
                    </td>
                </tr>
            );
        },
        renderTransaction(transaction, groupIndex, groupLength) {
            if (transaction._id === this.updateData._id) {
                return this.renderUpdateItem(transaction, groupIndex, groupLength);
            }
            const els = [this.renderNormalItem(transaction, groupIndex, groupLength)];
            if (transaction._id === this.createData._id) {
                els.push(this.renderCreateItem());
            }
            return (els);
        }
    },
    render(h) {
        if (!this.transactions) {
            return (
                <div class="wrapper-list">
                    <div class="no-data text-center">
                        <img src="~/assets/images/no-data.png" alt="no data" />
                        <p class="text-note">No data available.</p>
                    </div>
                </div>
            );
        }

        return (
            <table class="table w-100">
                <thead>
                    <tr>
                        <td></td>
                        <td>DATE</td>
                        <td>TITLE</td>
                        <td>DEBIT</td>
                        <td>CREDIT</td>
                        <td>RUNNING BALANCE</td>
                        <td>TYPE</td>
                        <td>ACTIONS</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.values(this.groupedTransactions).map((group, groupIndex) => {
                            const groupLength = group.length;
                            return group.map(transaction => (
                                this.renderTransaction(transaction, groupIndex, groupLength)
                            ));
                        })
                    }
                </tbody>
            </table>
        );
    }
};
</script>