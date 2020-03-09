<template>
    <div
        :id="id"
        class="modal fade box-popup new-popup file-detail"
    >
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-head">
                    <h3 class="modal-title">File detail</h3>
                </div>
                <div class="modal-container">
                    <div class="row no-gutters form-group">
                        <div class="col-sm-auto">
                            <img
                                src="~/assets/images/img-file-detail.svg"
                                alt="file-detail"
                                class="img-file"
                            >
                        </div>
                        <div class="col-sm">
                            <h3 class="title-file">{{data && data.name}}</h3>
                            <p class="txt-info">
                                <span class="label">Uploaded by:</span>super.admin@justdone.com.au
                            </p>
                            <p class="txt-info">
                                <span class="label">Created date:</span>{{data &&data.date}}
                            </p>
                        </div>
                    </div>
                    <div class="group-btn text-right">
                        <!-- <button class="form-btn">Create</button> -->
                        <button
                            class="form-btn grey"
                            @click="close"
                        >Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        id: {
            type: String,
            default: ''
        },
    },
    data() {
        return {
            data: null
        };
    },
    methods: {
        open(data) {
            $('#' + this.id).modal({
                keyboard: false,
                backdrop: 'static',
                show: true
            });
            this.data = data;
        },
        close() {
            $('#' + this.id).modal('hide');
        },
    }
};
</script>
