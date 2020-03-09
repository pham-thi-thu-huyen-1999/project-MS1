<template>
    <section class="user-list">
        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12 page-head">
                <div class="row">
                    <div class="col-md-6 col-sm-6 col-xs-12">
                        <page-title :titles="titles"/>
                    </div>
                    <div class="col-md-6 col-sm-6 col-xs-12 text-right">
                        <div class="dropdown normal-btn">
                            <button class="btn dropdown-toggle not-arrow" type="button" data-toggle="dropdown">
                                    ADD NEW
                            </button>
                        </div>
                    </div>
                    <div class="col-12 page-filter">
                        <lookup-keyword/>
                    </div>
                </div>
            </div>
            <div class="col-md-12 col-sm-12 col-xs-12 page-list">
                <div class="row">
                    <div class="col-md">
                        <div class="box">
                            <div class="row row-label">
                                <div class="col-7"><label class="col-label">Managers (Total 68)</label></div>
                                <div class="col text-center"><label class="col-label">time disable</label></div>
                                <div class="col text-center"><label class="col-label">enable account</label></div>
                                <div class="col-1 text-right"><label class="col-label">Options</label></div>
                            </div>
                            <div class="box-item pdr-15">
                                <div class="row row-item" v-for="(item, index) in listNotcruncher" :key="index">
                                    <div class="col-lg-7 col-md-6 col-sm-5 col-12 align-self-center">
                                        <img class="item-img" :src="item.img" title="" alt=""/>
                                        <span class="item-name">{{item.name}}</span>
                                        <span class="item-email">{{item.email}}</span>
                                    </div>
                                    <div class="col align-self-center text-center">
                                        <span class="item-time">{{item.status}}</span>
                                    </div>
                                    <div class="col align-self-center text-center">
                                        <button class="btn-normal" data-toggle="modal" data-target="#popup-confirm">ENABLE</button>
                                    </div>
                                    <div class="col-lg-1 col-md-2 col-sm-2 col-3 align-self-center text-right">
                                        <div class="dropdown">
                                            <a class="item-option dropdown-toggle" data-toggle="dropdown">
                                                ...
                                            </a>
                                            <ul class="dropdown-menu">
                                                <li><a class="option-item red">Disable Account</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <popup-confirm :user="user" :title="'Are you sure you want to enable this account?'" :description="'You have disabled this account on December 13, 2017'" :button1="'Enable'" :button2="'Cancel'"></popup-confirm>
                        </div>
                    </div>
                    <div class="col-md-auto">
                        <!-- <started-list></started-list> -->
                        <history-logs></history-logs>
                    </div>
                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <div class="paginate">
                            <no-ssr>
                                <pagination id="user-pagination" :page="page" :limit="limit" :total="total" @change="changePage" />
                            </no-ssr>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import LookupKeyword from '~/components/LookupKeyword';
import Pagination from '~/components/Pagination';
import StartedList from '~/components/StartedList';
import HistoryLogs from '~/components/HistoryLogs';
import PopupConfirm from '~/components/PopupConfirm';
import PageTitle from '~/components/PageTitle';
export default {
    data() {
        return {
            listNotcruncher: [
                {img: '/images/default-avatar.jpg', name: 'Florence Dawson', entity: 'Bobby Cox', email: 'hammes.ora@gmail.com', abn: '260008 672 179', managers: '2 Managers', status: '2 mins ago', statusCrunch: 'Not started'},
                {img: '/images/default-avatar.jpg', name: 'Hattie Lowe', entity: 'Lester George', email: 'hammes.ora@gmail.com', abn: '260008 672 179', managers: '2 Managers', status: '2 mins ago', statusCrunch: 'Not started'},
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
            ],
            page: 1,
            limit: 10,
            total: 20,
            user: {img: '/images/default-avatar.jpg', name: 'Florence Dawson', email: 'hammes.ora@gmail.com'},
            titles: ['Disabled user list'],
        };
    },
    components: {
        LookupKeyword,
        Pagination,
        StartedList,
        HistoryLogs,
        PopupConfirm,
        PageTitle
    },
    methods: {
        changePage() {

        }
    },
};
</script>
