<template>
    <div
        class="row row-item mr-0 ml-0"
        @dblclick="clickRow"
        :class="{cursor: data.isFolder}"
    >
        <div class="col-xl-7 col-lg-6 col-md-6 d-flex">
            <img
                src="~/assets/images/icon-folder.svg"
                alt="icon"
                class="icon-type"
                v-if="data.isFolder"
            >
            <img
                src="~/assets/images/icon-file.svg"
                alt="icon"
                class="icon-type"
                v-else-if="data.name!= '...'"
            >
            <span
                v-if="isRename"
                id="rename-container"
                class="flex-grow-1 d-flex align-items-center"
                v-on-clickaway="cancelRename"
            >
                <input
                    class="form-control mr-2 flex-grow-1"
                    v-model="newName"
                />
                <span class="flex-1">
                    <i
                        class="icon apply size-20 mr-2"
                        @click="applyRename"
                    />
                </span>
                <span class="flex-1">
                    <i
                        class="icon cancel size-20"
                        @click="cancelRename"
                    />
                </span>
            </span>
            <span
                v-else
                class="item-black"
            >{{ data.name }}</span>
            <span v-if="data.email">({{data.email}})</span>
            <span
                class="item-sub"
                v-if="data.sub"
            >{{ data.sub }}</span>
        </div>
        <div class="col-xl-1 col-lg-2 col-md-2 text-md-right">
            <span
                class="item-grey"
                v-if="data.size"
            >{{ (data.size/(1000*1000)).toFixed(2) + ' MB' }}</span>
        </div>
        <div class="col-xl-3 col-lg-3 col-md-3 text-md-right">
            <span
                class="item-grey"
                v-if="data.name != '...'"
            >Created date: {{ data.createdAt | formatDate }}</span>
        </div>
        <div class="col-xl-1 col-lg-1 col-md-1 text-md-right">
            <div
                class="dropdown"
                v-if="data.name != '...'"
            >
                <a
                    data-toggle="dropdown"
                    class="item-option dropdown-toggle"
                >...</a>
                <ul
                    class="dropdown-menu"
                    v-if="!isTrash"
                >
                    <li v-if="!data.isRoot"><a
                            class="option-item"
                            @click="confirmArchive"
                        >Archive</a></li>
                    <li v-if="!data.isRoot"><a
                            class="option-item"
                            @click="setRename"
                        >Rename</a></li>
                    <li v-if="!data.isFolder"><a
                            class="option-item"
                            target="_top"
                            :href="data.link"
                            :download="data.name"
                        >Download</a></li>
                    <li v-if="data.isFolder"><a
                            class="option-item"
                            @click="openPopupUpload"
                        >Upload Request</a></li>
                </ul>
                <ul
                    class="dropdown-menu"
                    v-else
                >
                    <li><a
                            class="option-item"
                            style="padding: 0px 20px;"
                            @click="restore()"
                        >Restore</a></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import {formatDate} from '~/helpers/dateHelper';
import {mixin as clickaway} from 'vue-clickaway';

export default {
    data() {
        return {
            newName: '',
            isRename: false
        };
    },
    props: {
        data: {
            type: Object,
            default: null
        },
        isTrash: {
            type: Boolean,
            default: false
        },
        tab: {
            type: String,
            default: ''
        },
    },
    created() {
        this.newName = this.$get(this, 'data.name', '');
    },
    methods: {
        openPopupUpload() {
            this.$emit('uploadRequest', this.data);
        },
        openFileDetail() {
            this.$emit('openDetail', this.data);
        },
        confirmArchive() {
            this.$emit('archiveFile', this.data.id);
        },
        restore() {
            this.$emit('restoreFile', this.data._id);
        },
        clickRow() {
            if (this.data.isFolder)
                this.$emit('clickAction', this.data);
        },
        handleKeyDown(event) {
            if (event.key === 'Escape') {
                this.cancelRename();
            }
        },
        setRename() {
            this.newName = this.data.name;
            this.isRename = true;
            window.addEventListener('keyup', this.handleKeyDown);
        },
        cancelRename(event) {
            this.isRename = false;
            window.removeEventListener('keyup', this.handleKeyDown);
        },
        async applyRename() {
            this.$setLoading(true);
            const {isFolder, id, _id} = this.data;

            let {data} = await this.$services.fileManagementService.rename(id || _id, isFolder, this.newName);
            if (data) {
                this.$notify({
                    type: 'success',
                    title: 'Rename successfully'
                });
                this.$emit('renameSuccess');
            }
            else {
                this.$notify({
                    type: 'error',
                    title: 'Failed to rename'
                });
            }

            this.cancelRename();
            this.$setLoading(false);
        },
    },
    filters: {
        formatDate,
    },
    mixins: [clickaway]
};
</script>

