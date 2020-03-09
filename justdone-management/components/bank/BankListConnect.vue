<template>
    <div class="bank-list-connect">
        <ul class="connect-tab">
            <li class="connect-tab-item text-center mr-10">Bank Connection</li>
            <li
                class="connect-tab-item"
                @click="toggleList"
            ><span
                    v-if="!showListConnected"
                    class="btn-small"
                >LIST CONNECTED</span><span
                    v-else
                    class="btn-small black"
                >GO BACK</span></li>
        </ul>

        <ul
            v-if="list.length || !isManagerView"
            class="connect-list"
        >
            <li class="connect-item text-left" style="color: gray">BANK ACCOUNT</li>
            <li
                class="connect-item d-flex flex-wrap"
                @click="selectAccount(item)"
                v-for="(item, index) in list"
                :key="index"
                :class="{active: accountSelected === item}"
                :queryAccount="$route.query.itemBank || ''"
            >
                <div class="d-flex flex-wrap align-items-center my-1">
                    <div class="connect-bank-logo">
                        <img
                            class="connect-bank-img"
                            :src="item.favicon || '/images/default-avatar.jpg'"
                        />
                        <span
                            :class="{'rotate': isSync && item._id === syncSelected, 'icon-success green': statusConnectBank &&  item.status === statusConnectBank.Connected, 'icon-war grey': (statusConnectBank &&  item.status === statusConnectBank.Connected && item.isDisabled) || item.refreshinfo.statusCode !== 0, 'icon-sync': (statusConnectBank && (item.status === statusConnectBank.Connecting)) || !item.accountId}"
                            class="small icon-status"
                        />
                    </div>
                    <div class="connect-bank-name">{{item.accountName || item.providerName}}</div>
                </div>
                <div class="d-flex flex-wrap align-items-center my-1 flex-grow-1 justify-content-end">
                    <div class="connect-bank-number">{{convertToSecret(item.accountNumber) || ''}}</div>
                    <button
                        v-if="item.refreshinfo.statusCode !== 0"
                        class="connect-bank-btn btn-small btn w-auto"
                        @click="reTryConnect(item)"
                    >
                        reconnect
                    </button>
                    <button
                        class="connect-bank-btn btn btn-small grey normal-point w-auto"
                        v-else
                    >{{item.type === bankType.Bank ? 'Bank' : 'CC'}}</button>
                </div>
            </li>
            <li
                v-if="!isManagerView"
                class="connect-item btn"
                :class="{active: isAddBank}"
                @click="addBank"
            >+ADD NEW BANK ACCOUNT</li>
        </ul>
        <ul
            v-else
            class="connect-list"
        >
            <li class="connect-item text-left" style="color: gray">BANK ACCOUNT</li>
            <div class="no-data text-center">
                <img
                    src="~/assets/images/no-data.png"
                    alt="no data"
                >
                <p class="text-note">No account.</p>
            </div>
        </ul>
        
        <!-- List Manual -->
        <ul
            v-if="listManual.length"
            class="connect-list"
        >
            <li class="connect-item text-left" style="color: gray">ACCOUNT NUMBER</li>
            <li
                class="connect-item d-flex flex-wrap"
                @click="selectAccount(item)"
                v-for="(item, index) in listManual"
                :key="index"
                :class="{active: accountSelected === item}"
                :queryAccount="$route.query.itemBank || ''"
            >
                <div class="d-flex flex-wrap align-items-center my-1">
                    <div class="connect-bank-logo">
                        <img
                            class="connect-bank-img"
                            :src="item.favicon || '/images/default-avatar.jpg'"
                        />
                        <span
                            :class="{'rotate': isSync && item._id === syncSelected, 'icon-success green': statusConnectBank &&  item.status === statusConnectBank.Connected, 'icon-war grey': (statusConnectBank &&  item.status === statusConnectBank.Connected && item.isDisabled) || item.refreshinfo.statusCode !== 0, 'icon-sync': (statusConnectBank && (item.status === statusConnectBank.Connecting)) || !item.accountId}"
                            class="small icon-status"
                        />
                    </div>
                    <div class="connect-bank-name">{{item.accountName || item.providerName}}</div>
                </div>
                <div class="d-flex flex-wrap align-items-center my-1 flex-grow-1 justify-content-end">
                    <div class="connect-bank-number">{{convertToSecret(item.accountNumber) || ''}}</div>
                    <button
                        v-if="item.refreshinfo.statusCode !== 0"
                        class="connect-bank-btn btn-small btn w-auto"
                        @click="reTryConnect(item)"
                    >
                        reconnect
                    </button>
                    <button
                        class="connect-bank-btn btn btn-small grey normal-point w-auto"
                        v-else
                    >{{item.type === bankType.Bank ? 'Bank' : 'CC'}}</button>
                </div>
            </li>
            <li class="connect-item text-center" style="color:blue" data-toggle="modal" data-target="#modal-add-account-number"> + ADD NEW ACCOUNT NUMBER</li>
        </ul>
        <ul
            v-else
            class="connect-list"
        >
            <li class="connect-item text-left" style="color: gray">ACCOUNT NUMBER</li>
            <li class="connect-item no-data text-center">
                <img
                    src="~/assets/images/no-data.png"
                    alt="no data"
                >
                <p class="text-note">No account.</p>
            </li>
            <li class="connect-item text-center" style="color:blue" data-toggle="modal" data-target="#modal-add-account-number"> + ADD NEW ACCOUNT NUMBER</li>
        </ul>
        

        <ModalAddAccountNumber @refresh="refreshList"/>
    </div>
</template>

<script>
import {StatusConnectBank, BankType} from '~/common/commonType';
import {convertToSecret, changeParam} from '~/helpers/dataHelper';
import ModalAddAccountNumber from './ModalAddAccountNumber';

export default {
    data() {
        return {
            showListConnected: false,
            accountSelected: null,
            statusConnectBank: StatusConnectBank,
            bankType: BankType,
            isAddBank: false,
            isSync: false,
            syncSelected: null
        };
    },
    props: {
        list: {
            type: Array,
            default: []
        },
        isManagerView: {
            type: Boolean,
            default: false
        },
        listManual: {
            type: Array,
            default: []
        }
    },
    components: {
        ModalAddAccountNumber
    },
    methods: {
        toggleList() {
            this.showListConnected = !this.showListConnected;
            this.$emit('toggleConnected');
        },
        selectAccount(item) {
            if (!item)
                return;
            if ((item.providerName && item.status !== StatusConnectBank.Connected) || (Object.keys(item).length && !item.accountId))
                return;
            if (item.status === StatusConnectBank.Connected)
                this.isAddBank = false;

            this.accountSelected = item;
            changeParam('itemBank', this.accountSelected._id);
            this.$emit('accountSelected', item);
        },
        addBank() {
            this.isAddBank = true;
            this.selectAccount({});
            this.$emit('addBank');
        },
        reTryConnect(data) {
            this.isSync = true;
            this.syncSelected = data._id;
            this.$emit('reTryConnect', data);
        },
        refreshList() {
            this.$emit('refreshList');
        },
        doneSync() {
            this.isSync = false;
        },
        convertToSecret(value) {
            return convertToSecret(value);
        }
    }
};
</script>

