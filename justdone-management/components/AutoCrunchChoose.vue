<template>
    <div class="auto-crunch-choose" :id="id">
        <span class="close" @click="close"><img src="~/assets/images/icon-cancel.svg"/></span>
        <div class="row row-label">
            <div class="col-md-4 col-sm-4 col-xs-12">
                <label class="col-label">group</label>
            </div>
            <div class="col-md-4 col-sm-4 col-xs-12">
                <label class="col-label">coa</label>
            </div>
        </div>
        <div class="crunch-choose-list">
            <div class="row row-item" v-for="(item, index) in data" :key="index">
                <div class="col-md-4 col-sm-4 col-xs-12">
                    <span class="item-normal">{{item.groupName}}</span>
                </div>
                <div class="col-md-4 col-sm-4 col-xs-12">
                    <span class="item-normal" :title="item.coaName">{{item.coaName}}</span>
                </div>
                <div class="col-md-4 col-sm-4 col-xs-12 text-right">
                    <button class="btn btn-small" @click="updateCrunchType(item)">Choose</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {CrunchType} from '~/common/commonType';

export default {
    props: ['id', 'data', 'transactionId'],
    data() {
        return {
            crunchTypes: []
        };
    },
    created() {
        this.crunchTypes = CrunchType;
    },
    methods: {
        updateCrunchType(item) {
            item.transactionId = this.transactionId;
            this.$parent.$emit('updateCrunchType', item);
            this.close();
        },
        open() {
            $('.auto-crunch-choose').removeClass('show');
            document.querySelector('#' + this.id).classList.toggle('show');
        },
        close() {
            document.querySelector('#' + this.id).classList.remove('show');
        }
    }
};
</script>

