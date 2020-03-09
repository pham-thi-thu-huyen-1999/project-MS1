<template>
    <section class="client-in-management">
        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12 page-head">
                <div class="row">
                    <div class="col-md-6 col-sm-6 col-xs-12">
                        <page-title :titles="titles" />
                    </div>
                    <div class="col-md-6 col-sm-6 col-xs-12 text-right">
                        <div class="dropdown normal-btn">
                            <button
                                class="btn dropdown-toggle not-arrow"
                                type="button"
                            >
                                BACK
                            </button>
                        </div>
                    </div>
                    <div class="col-12 page-filter">
                        <lookup-keyword :title="'Client Search'" />
                    </div>
                </div>
            </div>
            <div class="col-md-12 col-sm-12 col-xs-12 page-list">
                <div class="row">
                    <div class="col-md col-sm-12 col-xs-12">
                        <div class="box">
                            <div class="row row-label">
                                <div class="col-3"><label class="col-label">Clients (Total {{total}})</label></div>
                                <div class="col text-center"><label class="col-label">ABN NO.</label></div>
                                <div class="col text-center"><label class="col-label">Products</label></div>
                                <div class="col text-center"><label class="col-label">Managements</label></div>
                                <div class="col text-center"><label class="col-label"> status</label></div>
                                <div class="col text-center"><label class="col-label">Cruncher status</label></div>
                                <div class="col-1 text-center"><label class="col-label">dashboard</label></div>
                                <div class="col-1 text-right"><label class="col-label">Options</label></div>
                            </div>
                            <div class="box-item pdr-15">
                                <div
                                    class="row row-item"
                                    v-for="(client, index) in clients"
                                    :key="index"
                                >
                                    <div class="col-3 align-self-center">
                                        <img
                                            class="item-img"
                                            :src="client.avatar || '/images/default-avatar.jpg'"
                                            title=""
                                            alt=""
                                        />
                                        <span
                                            class="item-name"
                                            :title="client.name"
                                        >{{client.name}}</span>
                                        <span
                                            class="item-email"
                                            :title="client.email"
                                        >{{client.email}}</span>
                                    </div>
                                    <div class="col align-self-center text-center">
                                        <span class="item-abn">{{client.abn}}</span>
                                    </div>
                                    <div class="col align-self-center text-center">
                                        <span class="item-normal">Perci</span>
                                    </div>
                                    <div class="col align-self-center text-center">
                                        <ul
                                            class="item-managements"
                                            @click="openBoxManager('box'+index)"
                                        >
                                            <li class="item-managements-child">
                                                <img
                                                    class="item-managements-img"
                                                    src="/images/default-avatar.jpg"
                                                />
                                            </li>
                                            <li class="item-managements-child">
                                                <img
                                                    class="item-managements-img"
                                                    src="/images/default-avatar.jpg"
                                                />
                                            </li>
                                            <li class="item-managements-child">
                                                <span class="item-managements-img"><span class="item-managements-num">+5</span></span>
                                            </li>
                                        </ul>
                                        <box-manager
                                            :id="'box'+index"
                                            ref="BoxManager"
                                        ></box-manager>
                                    </div>
                                    <div class="col align-self-center text-center">
                                        <span
                                            :class="{green:index===0 || index===1}"
                                            class="item-status"
                                        >{{client.status || '2 minute'}}</span>
                                    </div>
                                    <div class="col align-self-center text-center">
                                        <span
                                            :class="{green:index===0, red:index===1, miss:index===3}"
                                            class="item-status"
                                        >
                                            <img
                                                class="item-miss"
                                                src="~/assets/images/noti-misscrunch.svg"
                                                alt=""
                                                title=""
                                            >
                                            {{client.statusCrunch}}
                                        </span>
                                        <ul class="item-list-crunch">
                                            <li class="list-crunch-label">
                                                <span class="crunch-label">Month</span>
                                                <span class="crunch-label">Bank</span>
                                                <span class="crunch-label">Credit card</span>
                                            </li>
                                            <li class="list-crunch-item">
                                                <span class="crunch-item-month">July 17</span>
                                                <span class="crunch-item-status">Completed</span>
                                                <span class="crunch-item-status">Completed</span>
                                            </li>
                                            <li class="list-crunch-item">
                                                <span class="crunch-item-month">August 17</span><span class="crunch-item-status">Completed</span><span class="crunch-item-status">Completed</span>
                                            </li>
                                            <li class="list-crunch-item">
                                                <span class="crunch-item-month">September 17</span><span class="crunch-item-status red">Overdue 30 days</span><span class="crunch-item-status">Completed</span>
                                            </li>
                                            <li class="list-crunch-item">
                                                <span class="crunch-item-month">October 17</span><span class="crunch-item-status">Awaiting approval</span><span class="crunch-item-status">Awaiting approval</span>
                                            </li>
                                            <li class="list-crunch-item">
                                                <span class="crunch-item-month">November 17</span><span class="crunch-item-status green">In progress</span><span class="crunch-item-status">Awaiting approval</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="col-1 align-self-center text-center">
                                        <nuxt-link
                                            class="btn-normal"
                                            :to="getLinkTransaction('5a962f5a4fdcbc5683b932d8')"
                                        >VIEW</nuxt-link>
                                    </div>
                                    <div class="col-1 align-self-center text-right">
                                        <div class="dropdown">
                                            <a
                                                class="item-option dropdown-toggle"
                                                data-toggle="dropdown"
                                            >
                                                ...
                                            </a>
                                            <ul class="dropdown-menu">
                                                <!-- <li><a class="option-item" data-toggle="modal" :data-target="'#client' + index">Assign Managers</a></li> -->
                                                <li><a class="option-item red">Disable Account</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="paginate">
                            <client-only>
                                <pagination
                                    id="team-pagination"
                                    :page="page"
                                    :limit="limit"
                                    :total="total"
                                    @change="changePage"
                                />
                            </client-only>
                        </div>
                    </div>
                    <div class="col-md-auto col-sm-12 col-xs-12">
                        <history-logs></history-logs>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import LookupKeyword from '~/components/LookupKeyword';
import Pagination from '~/components/Pagination';
import HistoryLogs from '~/components/HistoryLogs';
import BoxManager from '~/components/BoxManager';
import PageTitle from '~/components/PageTitle';

export default {
    data() {
        return {
            clients: [],
            condition: {
                keyword: '',
            },
            page: 1,
            limit: 10,
            total: 20,
            timeout: null,
            titles: ['Dashboard']
        };
    },
    created() {
        this.clients = [
            {img: '/images/default-avatar.jpg', name: 'Florence Dawson', entity: 'Bobby Cox', email: 'hammes.ora@gmail.com', abn: '260008 672 179', managers: '2 Managers', status: 'Online', statusCrunch: 'Not started'},
            {img: '/images/default-avatar.jpg', name: 'Hattie Lowe', entity: 'Lester George', email: 'hammes.ora@gmail.com', abn: '260008 672 179', managers: '2 Managers', status: 'Online', statusCrunch: 'Not started'},
            {img: '/images/default-avatar.jpg', name: 'Craig Tate', entity: 'Troy Love', email: 'hammes.ora@gmail.com', abn: '260008 672 179', managers: '2 Managers', status: '2 mins ago', statusCrunch: 'Not started'},
            {img: '/images/default-avatar.jpg', name: 'Brent May', entity: 'Blake Greene', email: 'hammes.ora@gmail.com', abn: '260008 672 179', managers: '2 Managers', status: '2 mins ago', statusCrunch: 'Overdue 2 days'},
            {img: '/images/default-avatar.jpg', name: 'Florence Dawson', entity: 'Bobby Cox', email: 'hammes.ora@gmail.com', abn: '260008 672 179', managers: '2 Managers', status: '2 mins ago', statusCrunch: 'Overdue 2 days'},
            {img: '/images/default-avatar.jpg', name: 'Craig Tate', entity: 'Troy Love', email: 'hammes.ora@gmail.com', abn: '260008 672 179', managers: '2 Managers', status: '2 mins ago', statusCrunch: 'Not started'},
            {img: '/images/default-avatar.jpg', name: 'Brent May', entity: 'Blake Greene', email: 'hammes.ora@gmail.com', abn: '260008 672 179', managers: '2 Managers', status: '2 mins ago', statusCrunch: 'Overdue 2 days'},
            {img: '/images/default-avatar.jpg', name: 'Florence Dawson', entity: 'Bobby Cox', email: 'hammes.ora@gmail.com', abn: '260008 672 179', managers: '2 Managers', status: '2 mins ago', statusCrunch: 'Overdue 2 days'},
            {img: '/images/default-avatar.jpg', name: 'Florence Dawson', entity: 'Bobby Cox', email: 'hammes.ora@gmail.com', abn: '260008 672 179', managers: '2 Managers', status: '2 mins ago', statusCrunch: 'Overdue 2 days'},
            {img: '/images/default-avatar.jpg', name: 'Florence Dawson', entity: 'Bobby Cox', email: 'hammes.ora@gmail.com', abn: '260008 672 179', managers: '2 Managers', status: '2 mins ago', statusCrunch: 'Overdue 2 days'},
            {img: '/images/default-avatar.jpg', name: 'Florence Dawson', entity: 'Bobby Cox', email: 'hammes.ora@gmail.com', abn: '260008 672 179', managers: '2 Managers', status: '2 mins ago', statusCrunch: 'Overdue 2 days'},
            {img: '/images/default-avatar.jpg', name: 'Florence Dawson', entity: 'Bobby Cox', email: 'hammes.ora@gmail.com', abn: '260008 672 179', managers: '2 Managers', status: '2 mins ago', statusCrunch: 'Overdue 2 days'},
            {img: '/images/default-avatar.jpg', name: 'Florence Dawson', entity: 'Bobby Cox', email: 'hammes.ora@gmail.com', abn: '260008 672 179', managers: '2 Managers', status: '2 mins ago', statusCrunch: 'Overdue 2 days'},
            {img: '/images/default-avatar.jpg', name: 'Florence Dawson', entity: 'Bobby Cox', email: 'hammes.ora@gmail.com', abn: '260008 672 179', managers: '2 Managers', status: '2 mins ago', statusCrunch: 'Overdue 2 days'},
            {img: '/images/default-avatar.jpg', name: 'Florence Dawson', entity: 'Bobby Cox', email: 'hammes.ora@gmail.com', abn: '260008 672 179', managers: '2 Managers', status: '2 mins ago', statusCrunch: 'Overdue 2 days'},
            {img: '/images/default-avatar.jpg', name: 'Florence Dawson', entity: 'Bobby Cox', email: 'hammes.ora@gmail.com', abn: '260008 672 179', managers: '2 Managers', status: '2 mins ago', statusCrunch: 'Overdue 2 days'},
            {img: '/images/default-avatar.jpg', name: 'Florence Dawson', entity: 'Bobby Cox', email: 'hammes.ora@gmail.com', abn: '260008 672 179', managers: '2 Managers', status: '2 mins ago', statusCrunch: 'Overdue 2 days'},
        ];
    },
    mounted() {
        $(document).on('click', function(e) {
            if ($(e.target).is('.item-managements, .box-manager') === false) {
                $('.box-manager').removeClass('active');
            }
        });
    },
    components: {
        Pagination,
        HistoryLogs,
        BoxManager,
        LookupKeyword,
        PageTitle
    },
    methods: {
        async changePage(page) {

        },
        openBoxManager(id) {
            this.$refs.BoxManager.find(b => b.id === id).open(id);
        },
    }
};
</script>
