<template>
    <div class="row row-item mr-0 ml-0" @dblclick="clickRow" :class="{cursor: data.isFolder}">
        <div class="col-xl-7 col-lg-6 col-md-6">
            <img src="~/assets/images/icon-folder.svg" alt="icon" class="icon-type" v-if="data.isFolder">
            <img src="~/assets/images/icon-file.svg" alt="icon" class="icon-type" v-else-if="data.name!= '...'">
            <span class="item-black">{{ data.name }}</span>
            <span class="item-sub" v-if="data.sub">{{ data.sub }}</span>
        </div>
        <div class="col-xl-1 col-lg-2 col-md-2 text-md-right">
            <span class="item-grey" v-if="data.size">{{ data.size }}</span>
        </div>
        <div class="col-xl-3 col-lg-3 col-md-3 text-md-right">
            <span class="item-grey" v-if="data.name != '...'">Created date: {{ data.createdAt | formatDate }}</span>
        </div>
        <div class="col-xl-1 col-lg-1 col-md-1 text-md-right">
            <div class="dropdown" v-if="data.name != '...'">
                <a data-toggle="dropdown" class="item-option dropdown-toggle">...</a>
                <ul class="dropdown-menu">
                    <!-- <li v-if="!data.isFolder"><a class="option-item" @click="openFileDetail(data)">Detail</a></li> -->
                    <li v-if="!data.isFolder"><a class="option-item" :download="data.name" target="_blank" :href="data.link">Download</a></li>
                    <li v-if="data.isFolder"><a class="option-item" @click="openPopupUpload">Upload request</a></li>
                    <li><a class="option-item" @click="confirmArchive()">Archive</a></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import {formatDate} from '~/helpers/dateHelper';

export default {
    props: {
        data: {
            type: Object,
            default: null
        }
    },
    data: () => ({
    }),
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
        clickRow() {
            if (this.data.isFolder)
                this.$emit('clickAction', this.data);
        }
    },
    filters: {
        formatDate,
    }
};
</script>

