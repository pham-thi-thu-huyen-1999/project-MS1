<template>
    <div class="list-connected-box">
        <ul class="connect-list">
            <li class="connect-item">
               <span class="connect-bank-logo"><img class="connect-bank-img" :src="data[0].favicon"/></span> 
               <span class="connect-bank-name">{{data[0].providerName}}</span> 
               <span class="connect-bank-status" :class="{active: !data[0].isDisabled}"><i class="fa fa-circle" aria-hidden="true"></i>Active</span> 
            </li>
            <li class="connect-item" v-for="(item, index) in data" :key="index"> 
                <span class="connect-bank-name">{{convertToSecret(item.accountNumber) || item.providerName}}</span> 
                <span class="connect-bank-date">{{item.getTransactionAt | formatDate}}</span> 
                <span v-if="item.status === 3" class="connect-bank-btn text-right">
                    <span v-if="!isManagerView" class="btn-small" @click="activeAccountBank(item._id)">CONNECT</span>
                    <span v-else class="btn-small disabled">Disabled</span>
                </span> 
                <span v-else class="connect-bank-btn text-right" @click="disconnect(item)"><span class="btn-small">DISCONNECT</span></span> 
            </li>
        </ul>
    </div>
</template>

<script>
import {convertToSecret} from '../../helpers/dataHelper.js';
import {formatDate} from '../../helpers/dateHelper.js';

export default {
    props: ['data', 'isManagerView'],
    methods: {
        convertToSecret(value) {
            return convertToSecret(value);
        },
        async activeAccountBank(id) {
            this.$setLoading();
            let result = await this.$services.yodleeService.activeAccountBank(id);

            if (result.data) {
                this.$emit('refresh');
            }
            this.$setLoading(false);
        },
        disconnect(item) {
            this.$notify({type: 'warning', text: `Are you sure to disconnect ${item.accountNumber} in ${item.providerName}?`})
                .then(() => {
                    this.$setLoading();
                })
                .catch(() => {})
                .finally(() => {
                    this.$setLoading(false);
                });
        }
    },
    filters: {
        formatDate
    }

};
</script>

