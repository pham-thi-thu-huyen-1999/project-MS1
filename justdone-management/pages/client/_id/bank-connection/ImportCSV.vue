<script>
import moment from 'moment';
export default {
    props: {
        closeModal: {
            type: Function,
            default: () => {}
        },
        upload: {
            type: Function,
            default: () => {}
        },
        groupedTransactions: {
            type: Object,
            default: {}
        }
    },
    methods: {
        async uploadApart(list, closeModal = false) {
            this.$setLoading();
            const {data} = await this.$services.transactionService.createTransactionWithoutId(list);
            if (data) {
                this.$notify({
                    type: 'success',
                    title: `${list.length} transactions were uploaded successfully`
                });
                if (closeModal) {
                    this.closeModal();
                }
            }
            else {
                this.$notify({
                    type: 'error',
                    title: `Failed to upload, plase try again`
                });
            }
            this.$setLoading(false);
        },
        async uploadAll() {
            const list = Object.values(this.groupedTransactions).reduce((total, group) => {
                return [...total, ...group];
            }, []);
            await this.uploadApart(list, true);
        }
    },
    render(h) {
        return (
            <div class="modal fade show" tabindex="-1" role="dialog" style="display:block">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Import CSV FILE</h5>
                            <button onClick={this.closeModal} type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body time-range-list">
                            {
                                Object.entries(this.groupedTransactions).reverse().map(([timestamp, list]) => (
                                    <div class="d-flex justify-content-between time-range-item">
                                        <div class="text-uppercase">{moment(Number(timestamp) * 1000).format('MMMM - YYYY')}</div>
                                        <div>
                                            <button
                                                class="btn-import text-uppercase"
                                                onClick={() => this.uploadApart(list)}
                                            >
                                                Import
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" onClick={() => this.closeModal()}>Close</button>
                            <button type="button" class="btn btn-primary" onClick={this.uploadAll}>Import all</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};
</script>
<style>
.time-range-list {
  max-height: 500px;
  overflow-x: hidden;
  overflow-y: auto;
}

.time-range-item {
    margin-bottom: 15px;
}
</style>