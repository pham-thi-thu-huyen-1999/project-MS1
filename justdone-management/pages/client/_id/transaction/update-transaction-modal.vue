    <template>
      <div class="modal" id="modal_update_transaction" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Edit transaction</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form>
                <div class="row">
                <div class="form-group col-md-4">
                  <label>Amount <span class="text-danger">*</span></label>
                  <input class="form-control" placeholder="Amount" :value="$get(transaction, 'amount.amount', 0)" @input="changeAmount"/>
                </div>
                <div class="form-group col-md-4">
                  <label>Base type <span class="text-danger">*</span></label>
                  <select v-model="transaction.baseType" class="form-control">
                    <option value="CREDIT">CREDIT</option>
                    <option value="DEBIT">DEBIT</option>
                  </select>
                </div>
                <div class="form-group col-md-4">
                  <label>Date <span class="text-danger">*</span></label>
                  <client-only>
                    <date-picker placeholder="Date" class="filter-value" :config="getOption()" :value="getFormattedDate()" @dp-change="changeDate"/>
                  </client-only>
                </div>
                </div>

                <div class="form-group">
                  <label>Description</label>
                  <textarea :value="$get(transaction, 'description.original')" class="form-control" placeholder="Description" @input="changeDescription" />
                </div>
              </form>
            <div><span class="text-danger">*</span> Required</div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" @click="updateTransaction" data-dismiss="modal">Save changes</button>
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
  </template>

<script>
import moment from 'moment';
export default {
    data() {
        return {
            date: moment(this.transaction.date).format('DD/MM/YYYY'),
            options: {
                format: 'DD/MM/YYYY',
                useCurrent: false,
                widgetPositioning: {vertical: 'bottom'},
                focusOnShow: false,
                maxDate: false,
                defaultDate: this.transaction.date
            },
        };
    },
    props: {
        transaction: {
            type: Object,
            default: () => ({
                description: {
                    original: ''
                },
                data: null
            })
        },
        updateTransaction: {
            type: Function, default: () => {}
        },
        month: {
            type: String,
        },
        year: {
            type: String
        }
    },
    methods: {
        changeDescription(event) {
            const description = event.target.value;
            this.transaction.description.original = description;
        },
        changeDate({date}) {
            const {_d = null} = date;
            this.transaction.date = moment(_d).toISOString();
        },
        changeAmount(event) {
            this.transaction.amount.amount = event.target.value;
        },
        getFormattedDate() {
            const {transaction = {}} = this;
            const {date = null} = transaction;
            return moment(date).format('DD/MM/YYYY');
        },
        getOption() {
            const {month = moment().month(), year = moment().year()} = this;
            const maxDate = moment().date(1).month(month).year(year).subtract(1, 'days');
            const minDate = `1/${month}/${year}`;

            return {
                format: 'DD/MM/YYYY',
                useCurrent: false,
                widgetPositioning: {vertical: 'bottom'},
                focusOnShow: false,
                maxDate,
                minDate
            };
        }
    }
};
  </script>
  <style>
  label {
    margin-bottom: 8px !important;
  }
</style>