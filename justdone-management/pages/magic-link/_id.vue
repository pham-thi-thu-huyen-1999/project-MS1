<template>
    <section
        v-if="!isExpired"
        class="container-fluid magic-link d-flex flex-column align-items-center justify-content-center py-4"
    >
        <div class="text-center">
            <img
                v-if="getSystem() === 'FR'"
                src="~/assets/images/fastrabbit.png"
                alt="logo"
                class="img-logo"
            >
            <img
                v-if="getSystem() === 'MPP'"
                src="~/assets/images/mpp.png"
                alt="logo"
                class="img-logo"
            >
            <img
                v-if="getSystem() === 'YBA'"
                src="~/assets/images/yba.png"
                alt="logo"
                class="img-logo"
            >
        </div>
        <div class="bg-container">
            <div class="row no-gutters row-white">
                <div class="col-lg-6 col-md-6 col-sm-6">
                    <div
                        class="box-upload"
                        @dragover.prevent
                        @drop="onDrop"
                        @dragover="dragging=true"
                        @dragleave="dragging=false"
                        :class="[dragging ? 'dropzone-over' : '']"
                    >
                        <div class="box-upload__upload text-center">
                            <img
                                src="~/assets/images/icon-upload.svg"
                                alt="upload"
                            >
                            <p class="txt-upload">Drop files to upload or <label for="upload-file" class="">browser</label></p>
                            <input
                                type="file"
                                @change="changeFile($event)"
                                name="upload"
                                id="upload-file"
                                hidden
                            >
                        </div>
                        <dic class="box-upload__description">
                            <div class="description__label">File size:</div>
                            <div class="description__content">Maximum file size 100MB</div>

                            <div class="description__label">Support file types:</div>
                            <div class="description__content">
                                Images: jpg, jpeg, gif, png
                            </div>
                            <div class="description__content">
                                Document: doc, docx, xls, xlsx, ppy, pptx, pdf
                            </div>
                            <div class="description__content">
                                Text: txt
                            </div>
                        </dic>
                    </div>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6">
                    <div class="box-info">
                        <img
                            src="~/assets/images/img-magic.png"
                            alt="img"
                        >
                        <h3 class="box-title text-center">Magic Links</h3>
                        <p class="box-txt">Email: 
                            <span class="txt-green">{{infor.emailTo}}</span>
                        </p>
                        <p class="box-txt">Expiration time:
                            <span class="txt-green">{{getExpiredDate()}}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section
        v-else
        class="container-fluid magic-link expired d-flex align-items-center justify-content-center py-4"
    >
        <div class="row w-100">
            <div class="col col-12 col-md-8 col-lg-4 offset-md-2 offset-lg-4">
                <div class="card">
                    <div class="card-body text-center">
                        <div class="expired__logo">
                            <img src="~/assets/images/alert.png" />
                        </div>
                        <div>
                            <div class="expired__title">
                                The link expired
                            </div>
                            <div class="expired__date">Your link expired at <span class="text-danger"> {{getExpiredDate()}} </span></div>
                        </div>
                        <button
                            @click="onClickOK"
                            class="expired__btn btn btn-primary"
                        >OK</button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import {formatDate} from '~/helpers/dateHelper';
import moment from 'moment';
export default {
    layout: 'blank',
    data() {
        return {
            infor: {},
            dragging: false,
            folderId: '',
            isExpired: false,
            isNotExist: false,
            loaded: false,
            allowFileSize: 0.1
        };
    },
    async mounted() {
        let id = this.$route.params.id;
        await this.getInforMagic(id);
    },
    methods: {
        onClickOK() {
            this.$router.push('/');
        },
        getSystem() {
            return this.infor.system;
        },
        getExpiredDate() {
            const {infor = {}} = this;
            const {expiredAt = moment().toISOString()} = infor;
            return moment(expiredAt).format('HH:mm DD/MM/YYYY');
        },
        async getInforMagic(id) {
            this.$setLoading();
            let {data} = await this.$services.fileManagementService.getInforMagic(id);
            if (data) {
                this.infor = data;
                this.folderId = data.folderId;
                if (moment(data.expiredAt).isBefore(moment())) {
                    this.isExpired = true;
                }
                this.$setLoading(false);
            }
            else {
                this.$router.push('/404');
            }
        },
        async changeFile(event) {
            let file = event.target ? event.target.files[0] : event[0];
            if (!file) {
                return;
            }
            if (file && file.size > this.allowFileSize * (10 ** 9)) {
                this.$notify({
                    type: 'error',
                    title: 'Upload failed',
                    text: 'File size is over limit (100MB)'
                });
                return;
            }
            let formData = new FormData();
            formData.append('fileobject', file);
            formData.append('magicLinkId', this.$route.params.id);
            let result = await this.$services.fileManagementService.uploadFile('', this.folderId, formData);

            if (result.data) {
                this.$notify({
                    type: 'success',
                    title: 'Upload completed',
                });
            }
            if (result.error)
                this.$notify({
                    type: 'error',
                    title: 'Upload failed',
                    text: result.error.message
                });
        },
        onDrop: function(e) {
            e.stopPropagation();
            e.preventDefault();
            var files = e.dataTransfer.files;
            this.changeFile(files);
            this.dragging = false;
        },
    },
    filters: {
        formatDate,
    },
};
</script>

