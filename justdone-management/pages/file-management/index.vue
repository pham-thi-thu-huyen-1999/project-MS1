<template>
    <section class="file-management">
        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12 page-head">
                <div class="row">
                    <div class="col-6">
                        <page-title :titles="titles" />
                    </div>
                    <div class="col-6 text-right"></div>
                    <div class="col-12 page-filter">
                        <div class="row align-items-center">
                            <div class="col-md">
                                <lookup-keyword
                                    v-model="condition.keyword"
                                    :isSelectAll="false"
                                    @input="handlerKeyword"
                                />
                                <lookup-file-type
                                    :list="fileType"
                                    @select="handlerFileType"
                                />
                                <button
                                    class="btn-normal btn-trash"
                                    @click="viewTrashs()"
                                >
                                    <template v-if="!viewTrash"><i
                                            class="fa fa-trash-o"
                                            aria-hidden="true"
                                        ></i>Trash</template>
                                    <template v-else><i
                                            class="fa fa-reply"
                                            aria-hidden="true"
                                        ></i>Back</template>
                                </button>
                            </div>
                            <div class="col-md-auto">
                                <button
                                    class="btn-normal"
                                    @click="createNewFolder"
                                >
                                    <i class="icon icon-new-folder mr-2"></i>New folder
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-12 col-sm-12 col-xs-12 page-list">
                <div class="row">
                    <div class="col-12">
                        <div
                            class="box"
                            v-if="!viewTrash"
                        >
                            <ul class="nav-tab">
                                <li
                                    class="nav-item"
                                    :class="{'active' : tab === 'personal'}"
                                    @click="changeFolder('personal')"
                                >
                                    <a class="nav-link">My folder</a>
                                </li>
                                <li
                                    v-if="roles.Client && $store.state.userAuth && ($store.state.userAuth.permission.role.code !== roles.Client)"
                                    class="nav-item"
                                    :class="{'active' : tab === 'client'}"
                                    @click="changeFolder('client')"
                                >
                                    <a class="nav-link">Client's folder</a>
                                </li>
                                <li
                                    v-if="countManager.data && roles.SuperAdmin && $store.state.userAuth && ($store.state.userAuth.permission.role.code === roles.SuperAdmin)"
                                    class="nav-item"
                                    :class="{'active' : tab === 'manager'}"
                                    @click="changeFolder('manager')"
                                >
                                    <a class="nav-link">Manager's folder</a>
                                </li>
                            </ul>
                            <div class="tab-content">
                                <div
                                    class="box-upload text-center"
                                    @dragover.prevent
                                    @drop="onDrop"
                                    @dragover="dragging=true"
                                    @dragleave="dragging=false"
                                    :class="[dragging ? 'dropzone-over' : '']"
                                >
                                    <img
                                        src="~/assets/images/icon-upload.svg"
                                        alt="upload"
                                    >
                                    <p class="txt-description">Drop files to upload or
                                        <label
                                            for="upload-file"
                                            class="label-upload"
                                        >browser</label>
                                        <input
                                            @change="changeFile($event)"
                                            id="upload-file"
                                            type="file"
                                            name="fileobject"
                                            hidden
                                        >
                                    </p>
                                    <p style="font-size: 14px; color: #757575;">Max file size {{allowSizeLabel}} (File types: pdf, jpg, word, excel)</p>
                                    <div
                                        class="status-process"
                                        v-if="isUpload"
                                    >
                                        <div class="row">
                                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-7">
                                                <h3 class="title-file">{{this.fileName}}</h3>
                                            </div>
                                            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">

                                            </div>
                                            <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                                                <div class="process-not">
                                                    <div
                                                        v-if="percentProgress!=100"
                                                        class="process-done"
                                                        role="progressbar"
                                                        :style="{ 'width': percentProgress + '%'}"
                                                    ></div>
                                                    <div
                                                        v-else
                                                        class="process-done completed"
                                                        role="progressbar"
                                                        style="width: 100%"
                                                    ></div>
                                                </div>
                                            </div>
                                            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="file-paths">
                                    <ul class="path-ul">
                                        <li
                                            class="path-item"
                                            @click="findDirect(item)"
                                            v-for="(item, index) in breadcrumb"
                                            :key="index"
                                        >{{item.name}}</li>
                                    </ul>
                                </div>
                                <div class="list-item">
                                    <file-item
                                        v-for="(item, index) in list"
                                        :tab="tab"
                                        :data="item"
                                        :key="index"
                                        @clickAction="handlerClick"
                                        @uploadRequest="openUploadRequest"
                                        @openDetail="openFileDetail"
                                        @archiveFile="confirmArchiveFile"
                                        @renameSuccess="handleReload"
                                    />
                                </div>
                                <div class="paginate">
                                    <pagination
                                        :page="page"
                                        :limit="limit"
                                        :total="viewTrash ? trashTotal : total"
                                        @change="changePage"
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            class="box"
                            v-else
                        >
                            <div class="tab-content">
                                <div class="file-paths">
                                    <ul class="path-ul">
                                        <li
                                            class="path-item"
                                            @click="findDirect(item)"
                                            v-for="(item, index) in breadcrumb"
                                            :key="index"
                                        >{{item.name}}</li>
                                    </ul>
                                </div>
                                <div class="list-item">
                                    <file-item
                                        v-for="(itemT, indexT) in trashList"
                                        :data="itemT"
                                        :key="indexT"
                                        :isTrash="viewTrash"
                                        @restoreFile="confirmTrashFile"
                                    />
                                </div>
                                <div class="paginate">
                                    <pagination
                                        :page="page"
                                        :limit="limit"
                                        :total="viewTrash ? trashTotal : total"
                                        @change="changePageTrash"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <progress-bar
            :id="'modal-progress'"
            :isShow="isProgress"
        />
        <add-new-folder
            @create="createFolder"
            :id="'new-folder'"
            ref="newFolder"
        />
        <upload-request
            :id="'upaload-request'"
            ref="uploadRequest"
            :folder="folder"
            :uploadUser="uploadUser"
            @submit="createMagicLink"
            @listFilesByMagicLinkId="listFilesByMagicLinkId"
        />
        <file-detail
            :id="'file-detail'"
            ref="fileDetail"
        />
        <popup-confirm
            :id="'popup-confirm'"
            ref="popupConfirm"
            @success="handlerConfirm"
        />
    </section>
</template>

<script>
import PageTitle from '~/components/PageTitle';
import LookupKeyword from '~/components/LookupKeyword';
import LookupFileType from '~/components/FileManagement/LookupFileType';
import FileItem from '~/components/FileManagement/FileItem';
import ProgressBar from '~/components/ProgressBar';
import Pagination from '~/components/Pagination';
import AddNewFolder from '~/components/FileManagement/AddNewFolder';
import UploadRequest from '~/components/FileManagement/UploadRequest';
import FileDetail from '~/components/FileManagement/FileDetail';
import PopupConfirm from '~/components/PopupConfirm';
import {mapUrlGoogleStorage} from '~/helpers/dataHelper';
import EventBus from '~/plugins/event-bus';
import {RoleCode} from '~/common/commonType';
import moment from 'moment';

export default {
    data() {
        return {
            isAdmin: false,
            page: 1,
            limit: 10,
            total: 1,
            titles: ['File management'],
            breadcrumb: [],
            percentProgress: 0,
            isUpload: false,
            fileName: '',
            dragging: false,
            tab: 'personal',
            list: [],
            folder: {},
            folderId: '',
            uploadUser: {},
            userId: '',
            condition: {
                keyword: '',
                type: ''
            },
            timeout: null,
            listPersonal: [],
            listClient: [],
            listManager: [],
            isProgress: false,
            fileType: [
                {name: '.pdf', value: '.pdf'},
                {name: '.png', value: '.png'},
                {name: '.jpg', value: '.jpg'},
                {name: '.xls', value: '.xls'},
                {name: '.doc', value: '.doc'},
            ],
            fileTypeSelect: '',
            countManager: 0,
            trashList: [],
            trashTotal: 0,
            viewTrash: false,
            roles: RoleCode,
            magicLinkId: ''
        };
    },
    components: {
        PageTitle,
        LookupKeyword,
        LookupFileType,
        FileItem,
        ProgressBar,
        Pagination,
        AddNewFolder,
        UploadRequest,
        FileDetail,
        PopupConfirm
    },
    async created() {
        this.countManager = await this.$services.userService.getCountManagers([], [], this.condition.keyword, false);
        const response = await this.$services.userService.getUserById(this.$store.state.userAuth._id);
        if (response && response.data) {
            this.isAdmin = true;
        }
    },
    mounted() {
        this.changeFolder('personal');
    },
    computed: {
        allowFileSize() {
            const {isAdmin = false, tab = ''} = this;
            if (isAdmin && tab === 'personal') {
                return 1;
            }
            return 0.1;
        },
        allowSizeLabel() {
            if (this.allowFileSize === 0.1) {
                return '100MB';
            }
            return '1GB';
        }
    },
    methods: {
        async listFilesByMagicLinkId(magicLinkId) {
            this.$setLoading();
            this.magicLinkId = magicLinkId;
            await this.getFileByName();
            await this.getCountFileByName();
            this.$setLoading(false);
        },
        async handleReload() {
            await this.getFolderById(this.userId, this.folderId, this.page, this.limit);
        },
        async getMyFolder() {
            this.userId = this.$store.state.userAuth._id;
            this.folderId = '';
            const cookie = this.$cookie.get('userAuth.Management');
            if (cookie) {
                const parsedCookie = JSON.parse(cookie);
                this.uploadUser.name = this.$get(parsedCookie, 'profile.firstName', '') + ' ' + this.$get(parsedCookie, 'profile.lastName', '');
                this.uploadUser.email = this.$get(parsedCookie, 'profile.email', '');
            }
            this.getFolderAndCount();
        },
        async getFolderById(userId, folderId, page, limit) {
            this.$setLoading();
            this.list = [];
            let result = await this.$services.fileManagementService.getFileAndFolder(userId, folderId, page, limit);
            if (result && result.data && result.data.length) {
                result.data.forEach(item => {
                    item.url = item.url ? mapUrlGoogleStorage(item.url) : '';
                    this.list.push({
                        id: item._id,
                        name: item.name,
                        email: item.email,
                        isFolder: item.isFolder,
                        link: item.url,
                        createdAt: item.createdAt,
                        size: item.size
                    });
                });
            }
            else {
                this.list = [{name: '...', date: '', size: ''}];
            }
            this.$setLoading(false);
        },
        async getTotalFolderById(userId, folderId) {
            this.$setLoading();
            let result = await this.$services.fileManagementService.getTotalFileAndFolder(userId, folderId);
            if (!result.error)
                this.total = result.data || 0;
            this.$setLoading(false);
        },
        async getClients() {
            this.$setLoading();
            this.list = [];
            this.listClient = [];
            let result = await this.$services.userService.getClients([], [], this.condition.keyword, false, this.page, this.limit);
            if (result && result.data && result.data.length) {
                result.data.forEach(item => {
                    this.listClient.push({
                        id: item._id,
                        name: this.$get(item, 'businessInfo.entityName', this.$get(item, 'fullName', '')),
                        email: item.email,
                        isFolder: true,
                        isRoot: true,
                        createdAt: item.createdAt
                    });
                });
            }
            this.list = this.listClient;
            this.$setLoading(false);
        },
        async getCountClients() {
            this.$setLoading();
            let {data, error} = await this.$services.userService.getCountClients([], this.condition.keyword, false);
            if (error)
                return false;
            this.total = data || 0;
            this.$setLoading(false);
        },
        async getManager() {
            this.$setLoading();
            this.list = [];
            this.listManager = [];
            let result = await this.$services.userService.getManagers([], [], this.condition.keyword, false, this.page, this.limit);
            if (result && result.data && result.data.length) {
                result.data.forEach(item => {
                    this.listManager.push({
                        id: item._id,
                        name: item.fullName,
                        email: item.email,
                        isFolder: true,
                        isRoot: true,
                        createdAt: item.createdAt
                    });
                });
            }
            this.list = this.listManager;
            this.$setLoading(false);
        },
        async getCountManagers() {
            this.$setLoading();
            let result = await this.$services.userService.getCountManagers([], [], this.condition.keyword, false);

            if (result.error) {
                return false;
            }
            this.total = result.data || 0;
            this.$setLoading(false);
        },
        async getFileByName() {
            this.$setLoading();
            let result = await this.$services.fileManagementService.getFileByName(this.userId || this.uploadUser.id || this.folderId, this.folderId, this.condition.keyword + this.fileTypeSelect, this.magicLinkId, this.page, this.limit);
            if (result && result.data && result.data.length) {
                this.list = result.data;
            }
            else this.list = [];
            this.$setLoading(false);
        },
        async getCountFileByName() {
            this.$setLoading();
            let result = await this.$services.fileManagementService.getCountFileByName(this.userId || this.uploadUser.id || this.folderId, this.folderId, this.condition.keyword + this.fileTypeSelect, this.magicLinkId);

            if (result.error) {
                return false;
            }
            this.total = result.data || 0;
            this.$setLoading(false);
        },
        getClientFolder() {
            this.getClients();
            this.getCountClients();
        },
        getManagerFolder() {
            this.getManager();
            this.getCountManagers();
        },
        getFolderAndCount() {
            this.getFolderById(this.userId, this.folderId, this.page, this.limit);
            this.getTotalFolderById(this.userId, this.folderId);
        },
        getFolder() {
            if (this.tab === 'client')
                this.getClientFolder();
            else if (this.tab === 'manager')
                this.getManagerFolder();
            else this.getMyFolder();
        },
        changePage(page) {
            this.page = page;
            this.getFolder();
        },
        changePageTrash(page) {
            this.page = page;
            this.getFileAndFolderDeleted();
            this.getTotalFileAndFolderDeleted();
        },
        createNewFolder() {
            this.$refs.newFolder.open();
        },
        async createFolder(name) {
            let result;
            if (this.userId && !this.folderId)
                result = await this.$services.fileManagementService.createFolderInRoot({userId: this.userId, nameFolder: name});
            else if (this.folderId)
                result = await this.$services.fileManagementService.createFolder({parentId: this.folderId, nameFolder: name});
            else {
                this.$notify({
                    type: 'error',
                    title: 'Create failed',
                    text: 'Please select folder.'
                });
                return false;
            }

            if (result.error)
                EventBus.$emit('NOTIFICATION_ERROR', {title: 'Failed', description: result.error.message});
            else this.getFolderAndCount();
        },
        openUploadRequest(data) {
            this.folder = data;
            if (data.isRoot) {
                this.uploadUser = data;
            }
            this.$forceUpdate();
            this.$refs.uploadRequest.open();
        },
        openFileDetail(data) {
            this.$refs.fileDetail.open(data);
        },
        confirmArchiveFile(id) {
            this.$refs.popupConfirm.open({type: 'archive', id: id, title: 'Are you sure to archive this ?'});
        },
        confirmTrashFile(id) {
            this.$refs.popupConfirm.open({type: 'restore', id: id});
        },
        async getFileAndFolderDeleted() {
            this.trashList = [];
            let {data} = await this.$services.fileManagementService.getFileAndFolderDeleted(this.userId, this.folderId, this.page, this.limit);
            if (data) {
                this.trashList = data;
            }
        },
        async getTotalFileAndFolderDeleted() {
            let {data} = await this.$services.fileManagementService.getTotalFileAndFolderDeleted(this.userId, this.folderId);
            if (data) {
                this.trashTotal = data;
            }
        },
        viewTrashs() {
            this.getFileAndFolderDeleted();
            this.getTotalFileAndFolderDeleted();
            this.viewTrash = !this.viewTrash;
        },
        changeFolder(name) {
            this.breadcrumb = [];
            this.uploadUser = {};
            this.page = 1;
            this.total = 0;
            this.folderId = '';
            this.userId = '';

            if (name === 'personal') {
                this.tab = 'personal';
                this.getMyFolder();
                this.breadcrumb.push({id: '', name: 'My Folder'});
            }
            if (name === 'client') {
                this.tab = 'client';
                this.getClientFolder();
                this.breadcrumb.push({id: '', name: "Client's"});
            }
            if (name === 'manager') {
                this.tab = 'manager';
                this.getManagerFolder();
                this.breadcrumb.push({id: '', name: "Manager's"});
            }
        },
        async handlerClick(item) {
            this.folderId = '';
            this.page = 1;
            if (item.isFolder) {
                let position = this.breadcrumb.findIndex(item1 => item1.id === item.id);
                if (position < 0)
                    this.breadcrumb.push(item);
                else this.breadcrumb.splice(position + 1);
            }
            if (item.isRoot) {
                this.uploadUser = item;
                this.userId = item.id;
            }
            else this.folderId = item.id;

            this.getFolderAndCount();
        },
        async handlerConfirm(confirm) {
            let result;
            this.$setLoading(true);
            if (confirm.type === 'archive') {
                result = await this.$services.fileManagementService.archiveFolder(confirm.id);
            }
            if (confirm.type === 'restore')
                result = await this.$services.fileManagementService.restoreFileAndFolder(confirm.id);
            if (!result.error) {
                this.getFolderAndCount();
                this.getFileAndFolderDeleted();
                this.getTotalFileAndFolderDeleted();
            }
            // await this.handleReload();
            this.$setLoading(false);
        },
        async createMagicLink(data) {
            this.$setLoading();
            let result = await this.$services.fileManagementService.createMagicLink({
                ...data,
                userId: this.folder.isRoot ? this.folder.id : '',
                folderId: this.folder.isRoot ? '' : this.folder.id,
                expiredDate: moment(data.expiredDate, 'DD/MM/YYYY (H:mm)').toISOString()
            });
            if (!result.error)
                this.$notify({
                    type: 'success',
                    title: 'Create completed',
                    text: 'Thank you'
                });
            this.$setLoading(false);
        },
        handlerKeyword(keyword) {
            this.magicLinkId = '';
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.condition.keyword = keyword;
                if (!this.userId || (!this.condition.keyword && !this.fileTypeSelect))
                    this.getFolder();
                else {
                    this.getFileByName();
                    this.getCountFileByName();
                }
            }, 300);
        },
        handlerFileType(item) {
            this.fileTypeSelect = item ? item.value : '';
            if (!this.userId || (!this.condition.keyword && !this.fileTypeSelect))
                this.getFolder();
            else {
                this.getFileByName();
                this.getCountFileByName();
            }
        },
        findDirect(item) {
            if (!item.id) {
                if (this.tab !== 'personal')
                    this.userId = '';
                this.folderId = '';
                this.breadcrumb = [];
                this.breadcrumb.push({id: '', name: item.name});
                this.getFolder();
            }
            else
                this.handlerClick(item);
        },
        async changeFile(event) {
            if (!this.userId && !this.folderId) {
                this.$notify({
                    type: 'error',
                    title: 'Upload failed',
                    text: 'Please select folder.'
                });
                return false;
            }

            let file = event.target ? event.target.files[0] : event[0];
            if (!file) {
                return;
            }
            if (file && file.size > this.allowFileSize * (10 ** 9)) {
                this.$notify({
                    type: 'error',
                    title: 'Upload failed',
                    text: 'File size is over limit'
                });
                return;
            }

            let formData = new FormData();
            formData.append('fileobject', file);
            this.fileName = file.name;
            if (this.list.find(item => item.name === file.name && !file.isFolder)) {
                this.$notify({
                    type: 'error',
                    title: 'Upload failed',
                    text: 'File name is already existed!'
                });
                return false;
            }
            this.percentProgress = 0;
            this.isUpload = true;
            formData.append('magicLinkId', this.$route.params.id);
            let result = await this.$services.fileManagementService.uploadFile(this.userId, this.folderId, formData, function(progressEvent) {
                this.percentProgress = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total));
                if (this.percentProgress === 100) {
                    this.isUpload = false;
                }
            }.bind(this));

            if (result.data) {
                this.$notify({
                    type: 'success',
                    title: 'Upload completed',
                    text: 'Thank you'
                });

                this.getFolderAndCount();
            }
            if (result.error)
                this.$notify({
                    type: 'error',
                    title: 'Upload failed',
                    text: 'Please check name and file type.'
                });
        },
        onDrop: function(e) {
            e.stopPropagation();
            e.preventDefault();
            var files = e.dataTransfer.files;
            this.changeFile(files);
            this.dragging = false;
        },
    }
};
</script>
