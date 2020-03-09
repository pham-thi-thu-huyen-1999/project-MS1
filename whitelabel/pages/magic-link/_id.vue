<template>
    <section class="container-fluid magic-link text-center" style="padding-top: 45px;">
        <!-- <img src="~/assets/images/white-label.png" alt="logo" class="img-logo"> -->
        <div class="bg-container">
            <div class="row no-gutters row-white">
                <div class="col-lg-7 col-md-6 col-sm-6">
                    <div class="box-upload" @dragover.prevent @drop="onDrop" @dragover="dragging=true" @dragleave="dragging=false" :class="[dragging ? 'dropzone-over' : '']">
                        <img src="~/assets/images/icon-upload.svg" alt="upload">
                        <p class="txt-upload">Drop files to upload or <label for="upload-file">browser</label></p>
                        <input type="file" @change="changeFile($event)" name="upload" id="upload-file" hidden>
                    </div>
                </div>
                <div class="col-lg-5 col-md-6 col-sm-6">
                    <div class="box-info">
                        <img src="~/assets/images/img-magic.png" alt="img">
                        <h3 class="box-title">Magic Links</h3>
                        <!-- <p class="box-txt">Email: maribel@hotmail.com</p> -->
                        <p class="box-txt">Expiration Date: <span class="txt-green">{{infor && infor.expiredAt | formatDate}}</span></p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import {formatDate} from '~/helpers/dateHelper';

export default {
    layout: 'blank',
    data: () => ({
        infor: null,
        dragging: false,
        folderId: ''
    }),
    created() {

    },
    async mounted() {
        let id = this.$route.params.id;
        await this.getInforMagic(id);
    },
    methods: {
        async getInforMagic(id) {
            let result = await this.$services.fileManagementService.getInforMagic(id);
            if (result.data) {
                this.infor = result.data;
                this.folderId = result.data.folderId;
            }
            if (result.error)
                this.$notify({
                    group: 'error',
                    title: 'Upload failed',
                    text: result.error.message
                });
        },
        async changeFile(event) {
            if (!this.folderId) {
                this.$notify({
                    group: 'error',
                    title: 'Upload failed',
                    text: 'Please select folder.'
                });
                return false;
            }

            let formData = new FormData();
            let file = event.target ? event.target.files[0] : event[0];
            formData.append('fileobject', file);
            let result = await this.$services.fileManagementService.uploadFile('', this.folderId, formData);

            if (result.data) {
                console.log('upload success', result.data);
                this.$notify({
                    group: 'success',
                    title: 'Upload completed',
                    text: 'Thank you'
                });
            }
            if (result.error)
                this.$notify({
                    group: 'error',
                    title: 'Upload failed',
                    text: result.error.message
                });
        },
        onDrop: function(e) {
            e.stopPropagation();
            e.preventDefault();
            var files = e.dataTransfer.files;
            console.log('file', files);
            this.changeFile(files);
            this.dragging = false;
        },
    },
    filters: {
        formatDate,
    }
};
</script>

