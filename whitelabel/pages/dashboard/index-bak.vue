<template>
    <section class="dashboard">
        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12 page-head">
                <div class="row">
                    <div class="col-md-6 col-sm-6 col-xs-12">
                        <page-title :titles="titles"/>
                    </div>
                    <div class="col-md-6 col-sm-6 col-xs-12 text-right">
                    </div>
                </div>
            </div>
        </div>
        <div class="row space">
            <div class="col-md-4 col-sm-4 col-xs-12">
                <div class="box box-static">
                    <div class="row">
                        <div class="col-md-6 col-sm-6 col-xs-12">
                            <h3 class="box-title">Clients</h3>
                        </div>
                        <div class="col-md-6 col-sm-6 col-xs-12 text-right">
                            <nuxt-link class="view-all" to="/client-management">View all</nuxt-link>
                        </div>
                        <div class="col-md-12 col-sm-12 col-xs-12">
                             <div class="row">
                                <div class="col-md-3 col-sm-6 col-xs-6 statistic-col">
                                    <label class="statistic-title">All Clients</label>
                                    <p class="statistic-number">{{analyticClients.totalClients}}</p>
                                </div>
                                <div class="col-md-3 col-sm-6 col-xs-6 statistic-col">
                                    <label class="statistic-title">Invited Clients</label>
                                    <p class="statistic-number">{{analyticClients.totalInvited}}</p>
                                </div>
                                <div class="col-md-3 col-sm-6 col-xs-6 statistic-col special">
                                    <label class="statistic-title">Not Connect Bank</label>
                                    <p class="statistic-number">{{analyticClients.totalNotConnect}}</p>
                                </div>
                                <div class="col-md-3 col-sm-6 col-xs-6 statistic-col">
                                   <img class="img-chart" src="~/assets/images/chart.svg"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4 col-sm-4 col-xs-12">
                <div class="box box-static">
                    <div class="row">
                        <div class="col-md-6 col-sm-6 col-xs-12">
                            <h3 class="box-title">Managers</h3>
                        </div>
                        <div class="col-md-6 col-sm-6 col-xs-12 text-right">
                            <nuxt-link class="view-all" to="/team-management">View all</nuxt-link>
                        </div>
                        <div class="col-md-12 col-sm-12 col-xs-12">
                             <div class="row">
                                <div class="col-md-3 col-sm-6 col-xs-6 statistic-col">
                                    <label class="statistic-title">All Managers</label>
                                    <p class="statistic-number">{{analyticManagers.totalManagers}}</p>
                                </div>
                                <div class="col-md-3 col-sm-6 col-xs-6 statistic-col">
                                    <label class="statistic-title">Product Managers</label>
                                    <p class="statistic-number">{{analyticManagers.totalProductManager}}</p>
                                </div>
                                <div class="col-md-3 col-sm-6 col-xs-6 statistic-col">
                                    <label class="statistic-title">Supervisor</label>
                                    <p class="statistic-number">{{analyticManagers.totalSupervisor}}</p>
                                </div>
                                <div class="col-md-3 col-sm-6 col-xs-6 statistic-col">
                                    <img class="img-chart" src="~/assets/images/chart.svg"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4 col-sm-4 col-xs-12">
                <div class="box box-custom">
                    <div class="row">
                        <div class="col-md-9 col-sm-9 col-xs-12">
                            <h3 class="box-title">Clients not assigned</h3>
                        </div>
                        <div class="col-md-3 col-sm-3 col-xs-12 text-right">
                            <!-- <nuxt-link class="view-all" to="/">View all</nuxt-link> -->
                        </div>
                    </div>
                    <div class="row row-label">
                        <div class="col-7"><label class="col-label">Clients (Total {{clientNotAssigns.total ? clientNotAssigns.total : 0}})</label></div>
                        <!-- <div class="col text-right"><label class="col-label">assign managery</label></div> -->
                    </div>
                    <div class="box-item set-height">
                        <div class="no-data text-center"  v-if="clientNotAssigns.total < 1">
                            <img src="~/assets/images/no-data.png" alt="no data">
                            <p class="text-note">No data available.</p>
                        </div>
                        <div class="row row-item" v-for="(client, index) in clientNotAssigns.list" :key="index" v-show="clientNotAssigns.total > 0">
                            <div class="col-12 align-self-center">
                                <img class="item-img" :src="client.avatar ? mapUrlGoogleStorage(client.avatar) : '/images/default-avatar.jpg'" title="" alt=""/>
                                <span class="item-name">{{client.fullName}}</span>
                                <span class="item-email">{{client.email}}</span>
                            </div>
                            <!-- <div class="col align-self-center text-right">
                                <span class="item-manager">0 Manager</span>
                            </div> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row space">
            <div class="col-12">
                <div class="box">
                    <h3 class="box-title">Not cruncher yet</h3>
                    <div class="row row-label">
                        <div class="col-3"><label class="col-label">Clients (Total {{notCruncher.total ? notCruncher.total : 0}})</label></div>
                        <div class="col text-center"><label class="col-label">entity name</label></div>
                        <!-- <div class="col text-center"><label class="col-label">ABN NO.</label></div> -->
                        <div class="col text-center"><label class="col-label">Managers</label></div>
                        <div class="col text-center"><label class="col-label">Active status</label></div>
                        <div class="col text-center"><label class="col-label">Cruncher status</label></div>
                        <div class="col text-center"><label class="col-label">Dashboard</label></div>
                        <div class="col-1 text-right"><label class="col-label">Options</label></div>
                    </div>
                    <div class="box-item not-cruncher">
                        <div class="row row-item" v-if="notCruncher.total < 1">
                            <div class="col-12">
                                <div class="no-data text-center">
                                    <img src="~/assets/images/no-data.png" alt="no data">
                                    <p class="text-note">No data available.</p>
                                </div>
                            </div>
                        </div>
                        <div class="row row-item" v-for="(client, index) in notCruncher.list" :key="index" v-show="notCruncher.total > 0">
                            <div class="col-3 align-self-center">
                                <img class="item-img" :src=" client.avatar && client.avatar.url ? client.avatar.url : '/images/default-avatar.jpg'" title="" alt=""/>
                                <span class="item-name">{{client.fullName}}</span>
                                <span class="item-email">{{client.email}}</span>
                            </div>
                            <div class="col align-self-center text-center">
                                <span class="item-entity">{{client.businessInfo ? client.businessInfo.entityName : ''}}</span>
                            </div>
                            <!-- <div class="col align-self-center text-center">
                                <span class="item-abn">{{item.abn}}</span>
                            </div> -->
                            <div class="col align-self-center text-center">
                                <span class="item-manager" @click="openBoxManager(client._id)">{{client.totalManager}} Managers</span>
                                <box-manager :id="client._id" ref="boxManagers" />
                            </div>
                            <div class="col align-self-center text-center">
                                <span :class="{green:index===0 || index===1}" class="item-status">{{client.status}} minutes</span>
                            </div>
                            <div class="col align-self-center text-center">
                                        
                                <span v-if="client.crunchStatus && client.crunchStatus.status && !client.crunchStatus.status.isFinished && client.crunchStatus.status.overdue && client.crunchStatus.status.overdue === 0 && !client.crunchStatus.status.isFinished" class="item-status">
                                    Not started
                                </span>

                                <span v-else-if="client.crunchStatus && client.crunchStatus.status && !client.crunchStatus.status.isFinished && client.crunchStatus.status.overdue && client.crunchStatus.status.overdue > 7" class="red item-status">
                                    Overdue {{client.crunchStatus.status.overdue}} days
                                </span>

                                <span v-else-if="client.crunchStatus && client.crunchStatus.status && !client.crunchStatus.status.isFinished && client.crunchStatus.status.overdue && client.crunchStatus.status.overdue > 9" class="green item-status">
                                    Inprogress ()
                                </span>

                                <span v-else-if="client.crunchStatus && client.crunchStatus.status && !client.crunchStatus.status.isFinished && client.crunchStatus.status.isFinished" class="item-status">
                                    Completed
                                </span>

                                <!-- <span class="miss item-status">
                                    <img class="item-miss" src="~/assets/images/noti-misscrunch.svg" alt="" title="">
                                    {{item.crunchStatus}}
                                </span> -->
                                <span v-else class="item-status">
                                    No data
                                </span>
                                
                                <ul v-if="client.crunchStatus && client.crunchStatus.details && client.crunchStatus.details.length > 0" class="item-list-crunch">
                                    <li class="list-crunch-label">
                                        <span class="crunch-label">Month</span>
                                        <span class="crunch-label">Bank</span>
                                        <span class="crunch-label">Credit card</span>
                                    </li>
                                    <li v-for="(crunch, index) in client.crunchStatus.details" :key="index" class="list-crunch-item">
                                        <span class="crunch-item-month" >{{crunch.month | convertMonthToWord}} {{crunch.year | sliceString}}</span>
                                        <template v-if="crunch ===1">
                                            <span v-if="!crunch.isFinished && crunch.overdue && crunch.overdue === 0" class="crunch-item-status">
                                                Not started
                                            </span>

                                            <span v-else-if="!crunch.isFinished && crunch.overdue && crunch.overdue > 7" class="red crunch-item-status">
                                                Overdue {{crunch.overdue}} days
                                            </span>

                                            <span v-else-if="!crunch.isFinished && crunch.overdue && crunch.overdue > 9" class="green crunch-item-status">
                                                Inprogress
                                            </span>

                                            <span v-else-if="crunch.isFinished" class="crunch-item-status">
                                                Completed
                                            </span>

                                            <span class="crunch-item-status" v-else>
                                                No data
                                            </span>
                                        </template>
                                        <template v-if="crunch.type === 2">
                                            <span v-if="!crunch.isFinished && crunch.overdue && crunch.overdue === 0" class="crunch-item-status">
                                                Not started
                                            </span>

                                            <span v-else-if="!crunch.isFinished && crunch.overdue && crunch.overdue > 7" class="red crunch-item-status">
                                                Overdue {{crunch.overdue}} days
                                            </span>

                                            <span v-else-if="!crunch.isFinished && crunch.overdue && crunch.overdue > 9" class="green crunch-item-status">
                                                Inprogress ()
                                            </span>

                                            <span v-else-if="crunch.isFinished" class="crunch-item-status">
                                                Completed
                                            </span>

                                            <span class="crunch-item-status" v-else>
                                                No data
                                            </span>
                                        </template>
                                    </li>
                                </ul>
                            </div>
                            <div class="col align-self-center text-center">
                                <!-- <button class="btn-normal font-7">VIEW</button> -->
                                <nuxt-link :to="`/client/${client._id}/transaction`" class="btn-normal">VIEW</nuxt-link>
                            </div>
                            <div class="col-1 align-self-center text-right">
                                <div class="dropdown">
                                    <a class="item-option dropdown-toggle" data-toggle="dropdown">
                                        ...
                                    </a>
                                    <ul class="dropdown-menu dropdown-bottom">
                                        <li><a class="option-item red" @click="confirmDelete(client._id)">Disable Client</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row space">
            <div class="col-12">
                <div class="box">
                    <h3 class="box-title">Finish cruncher</h3>
                    <div class="row row-label">
                        <div class="col-sm-3 col-12"><label class="col-label">Clients (Total {{finishCruncher.total ? finishCruncher.total : 0}})</label></div>
                        <div class="col text-center"><label class="col-label">entity name</label></div>
                        <!-- <div class="col text-center"><label class="col-label">ABN NO.</label></div> -->
                        <div class="col text-center"><label class="col-label">Managers</label></div>
                        <div class="col text-center"><label class="col-label">Active status</label></div>
                        <div class="col text-center"><label class="col-label">Cruncher status</label></div>
                        <div class="col text-center"><label class="col-label">Dashboard</label></div>
                        <div class="col-1 text-right"><label class="col-label">Options</label></div>
                    </div>
                    <div class="box-item">
                        <div class="row row-item" v-if="finishCruncher.total < 1">
                            <div class="col-12">
                                <div class="no-data text-center">
                                    <img src="~/assets/images/no-data.png" alt="no data">
                                    <p class="text-note">No data available.</p>
                                </div>
                            </div>
                        </div>
                        <div class="row row-item" v-for="(client, index) in finishCruncher.list" :key="index" v-show="finishCruncher.total > 0">
                            <div class="col-sm-3 col-12 align-self-center">
                                <img class="item-img" :src=" client.avatar ? client.avatar : '/images/default-avatar.jpg'" title="" alt=""/>
                                <span class="item-name">{{client.fullName}}</span>
                                <span class="item-email">{{client.email}}</span>
                            </div>
                            <div class="col align-self-center text-center">
                                <span class="item-entity">{{client.businessInfo ? client.businessInfo.entityName : ''}}</span>
                            </div>
                            <!-- <div class="col align-self-center text-center">
                                <span class="item-abn">{{item.abn}}</span>
                            </div> -->
                            <div class="col align-self-center text-center">
                                <span class="item-manager" @click="openBoxManager(client._id)">{{client.totalManager}} Managers</span>
                                <box-manager :id="client._id" ref="boxManagers" />
                            </div>
                            <div class="col align-self-center text-center">
                                <span class="item-status">{{client.status}} minutes</span>
                            </div>
                            <div class="col align-self-center text-center">
                                        
                                <span v-if="client.crunchStatus && client.crunchStatus.status && !client.crunchStatus.status.isFinished && client.crunchStatus.status.overdue && client.crunchStatus.status.overdue === 0 && !client.crunchStatus.status.isFinished" class="item-status">
                                    Not started
                                </span>

                                <span v-else-if="client.crunchStatus && client.crunchStatus.status && !client.crunchStatus.status.isFinished && client.crunchStatus.status.overdue && client.crunchStatus.status.overdue > 7" class="red item-status">
                                    Overdue {{client.crunchStatus.status.overdue}} days
                                </span>

                                <span v-else-if="client.crunchStatus && client.crunchStatus.status && !client.crunchStatus.status.isFinished && client.crunchStatus.status.overdue && client.crunchStatus.status.overdue > 9" class="green item-status">
                                    Inprogress ()
                                </span>

                                <span v-else-if="client.crunchStatus && client.crunchStatus.status && !client.crunchStatus.status.isFinished && client.crunchStatus.status.isFinished" class="item-status">
                                    Completed
                                </span>

                                <!-- <span class="miss item-status">
                                    <img class="item-miss" src="~/assets/images/noti-misscrunch.svg" alt="" title="">
                                    {{item.crunchStatus}}
                                </span> -->
                                <span v-else class="item-status">
                                    No data
                                </span>
                                
                                <ul v-if="client.crunchStatus && client.crunchStatus.details && client.crunchStatus.details.length > 0" class="item-list-crunch">
                                    <li class="list-crunch-label">
                                        <span class="crunch-label">Month</span>
                                        <span class="crunch-label">Bank</span>
                                        <span class="crunch-label">Credit card</span>
                                    </li>
                                    <li v-for="(crunch, index) in client.crunchStatus.details" :key="index" class="list-crunch-item">
                                        <span class="crunch-item-month" >{{crunch.month | convertMonthToWord}} {{crunch.year | sliceString}}</span>
                                        <template v-if="crunch ===1">
                                            <span v-if="!crunch.isFinished && crunch.overdue && crunch.overdue === 0" class="crunch-item-status">
                                                Not started
                                            </span>

                                            <span v-else-if="!crunch.isFinished && crunch.overdue && crunch.overdue > 7" class="red crunch-item-status">
                                                Overdue {{crunch.overdue}} days
                                            </span>

                                            <span v-else-if="!crunch.isFinished && crunch.overdue && crunch.overdue > 9" class="green crunch-item-status">
                                                Inprogress
                                            </span>

                                            <span v-else-if="crunch.isFinished" class="crunch-item-status">
                                                Completed
                                            </span>

                                            <span class="crunch-item-status" v-else>
                                                No data
                                            </span>
                                        </template>
                                        <template v-if="crunch.type === 2">
                                            <span v-if="!crunch.isFinished && crunch.overdue && crunch.overdue === 0" class="crunch-item-status">
                                                Not started
                                            </span>

                                            <span v-else-if="!crunch.isFinished && crunch.overdue && crunch.overdue > 7" class="red crunch-item-status">
                                                Overdue {{crunch.overdue}} days
                                            </span>

                                            <span v-else-if="!crunch.isFinished && crunch.overdue && crunch.overdue > 9" class="green crunch-item-status">
                                                Inprogress ()
                                            </span>

                                            <span v-else-if="crunch.isFinished" class="crunch-item-status">
                                                Completed
                                            </span>

                                            <span class="crunch-item-status" v-else>
                                                No data
                                            </span>
                                        </template>
                                    </li>
                                </ul>
                            </div>
                            <div class="col align-self-center text-center">
                                <!-- <button class="btn-normal font-7">VIEW</button> -->
                                <nuxt-link :to="`/client/${client._id}/transaction`" class="btn-normal">VIEW</nuxt-link>
                            </div>
                            <div class="col-sm-1 col-12 align-self-center text-right">
                                <div class="dropdown">
                                    <a class="item-option dropdown-toggle" data-toggle="dropdown">
                                        ...
                                    </a>
                                    <ul class="dropdown-menu dropdown-bottom">
                                        <li><a class="option-item red" @click="confirmDelete(client._id)">Disable Client</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row space" hidden>
            <div class="col-md-8 col-sm-12">
                <div class="box">
                    <div class="row">
                        <div class="col-md-6 col-sm-6 col-xs-12">
                            <h3 class="box-title">Clients invited</h3>
                        </div>
                        <div class="col-md-6 col-sm-6 col-xs-12 text-right">
                            <!-- <nuxt-link class="view-all" to="/">View all</nuxt-link> -->
                        </div>
                    </div>
                    <div class="row row-label">
                        <div class="col-3"><label class="col-label">Clients (Total {{clientInvites.total}})</label></div>
                        <div class="col text-center"><label class="col-label">Invited by</label></div>
                        <div class="col text-center"><label class="col-label">Time sent</label></div>
                        <div class="col text-center"><label class="col-label">Resend</label></div>
                        <div class="col text-right"><label class="col-label">Options</label></div>
                    </div>
                    <div class="box-item">
                        <div class="row row-item" v-if="clientInvites.total < 1">
                            <div class="col-12">
                                <span>No Data</span>
                            </div>
                        </div>
                        <div class="row row-item" v-for="(client, index) in clientInvites.list" :key="index" v-show="clientInvites.total > 0">
                            <div class="col-sm-3 col-12 align-self-center">
                                <img class="item-img" :src="client.avatar ? mapUrlGoogleStorage(client.avatar) : '/images/default-avatar.jpg'" title="" alt=""/>
                                <span class="item-name">{{client.fullName}}</span>
                                <span class="item-email">{{client.email}}</span>
                            </div>
                            <div class="col align-self-center">
                                <img class="item-img" :src="client.userId.avatar.length ? mapUrlGoogleStorage(client.userId.avatar[0].url) : '/images/default-avatar.jpg'" title="" alt=""/>
                                <span class="item-name">{{client.userId.fullName}}</span>
                                <span class="item-email">{{client.userId.email}}</span>
                            </div>
                            <div class="col align-self-center text-center">
                                <span class="item-abn" v-if="client.status" style="color: green;">Pending</span>
                                <span class="item-abn" v-if="!client.status" style="color: red;">Expired</span>
                            </div>
                            <div class="col align-self-center text-center">
                                <button class="btn-normal font-7" data-toggle="modal" @click="reSendInvite(client._id)">Resend</button>
                            </div>
                            <div class="col-sm-2 col-12 align-self-center text-right">
                                <div class="dropdown">
                                    <a class="item-option dropdown-toggle" data-toggle="dropdown">
                                        ...
                                    </a>
                                    <ul class="dropdown-menu dropdown-bottom">
                                        <li @click="deleteInvitation(client._id)"><a class="option-item red">Disable Client</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <popup-confirm id="popup-confirm"  :title="title" @success="actionConfirm" ref="popupConfirm"></popup-confirm>
            </div>
            <div class="col-md-4 col-sm-12">
                <div class="box">
                    <div class="row">
                        <div class="col-md-6 col-sm-6 col-xs-12">
                            <h3 class="box-title">Clients not assigned</h3>
                        </div>
                        <div class="col-md-6 col-sm-6 col-xs-12 text-right">
                            <!-- <nuxt-link class="view-all" to="/">View all</nuxt-link> -->
                        </div>
                    </div>
                    <div class="row row-label">
                        <div class="col-7"><label class="col-label">Clients (Total {{clientNotAssigns.total ? clientNotAssigns.total : 0}})</label></div>
                        <!-- <div class="col text-right"><label class="col-label">assign managery</label></div> -->
                    </div>
                    <div class="box-item">
                        <div class="row row-item" v-if="clientNotAssigns.total < 1">
                            <div class="col-12">
                                <span>No Data</span>
                            </div>
                        </div>
                        <div class="row row-item" v-for="(client, index) in clientNotAssigns.list" :key="index" v-show="clientNotAssigns.total > 0">
                            <div class="col-sm-7 col-12 align-self-center">
                                <img class="item-img" :src="client.avatar ? mapUrlGoogleStorage(client.avatar) : '/images/default-avatar.jpg'" title="" alt=""/>
                                <span class="item-name">{{client.fullName}}</span>
                                <span class="item-email">{{client.email}}</span>
                            </div>
                            <!-- <div class="col align-self-center text-right">
                                <span class="item-manager">0 Manager</span>
                            </div> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import PageTitle from '~/components/PageTitle';
import BoxManager from '~/components/BoxManager';
import Pagination from '~/components/Pagination';
import PopupConfirm from '~/components/PopupConfirm';
import {mapUrlGoogleStorage} from '~/helpers/dataHelper';

export default {
    data: () => ({
        productCode: null,
        showDisabled: false,
        titles: ['Dashboard'],
        title: null,
        analyticClients: [],
        analyticManagers: [],
        user: {},
        notCruncher: {
            keyword: '',
            list: [],
            page: 1,
            limit: 10,
            total: 0,
        },
        finishCruncher: {
            keyword: '',
            list: [],
            page: 1,
            limit: 10,
            total: 0,
        },
        clientInvites: {
            keyword: '',
            list: [],
            page: 1,
            limit: 10,
            total: 0,
            isInvited: null,
        },
        clientNotAssigns: {
            keyword: '',
            list: [],
            page: 1,
            limit: 10,
            total: 0,
        }
    }),
    created() {
        this.reset();
    },
    mounted() {
        $(document).on('click', function(e) {
            if ($(e.target).is('.item-managements, .box-manager, .item-manager') === false) {
                $('.box-manager').removeClass('active');
            }
        });
        this.initData();
    },
    components: {
        PageTitle,
        BoxManager,
        Pagination,
        PopupConfirm
    },
    methods: {
        reset() {
            this.productCode = this.$store.state.productCode;
            this.isInvited = true;
            this.title = '';
            this.notCruncher = {
                keyword: '',
                list: [],
                page: 1,
                limit: 10,
                total: 0,
            };
            this.finishCruncher = {
                keyword: '',
                list: [],
                page: 1,
                limit: 10,
                total: 0,
            };
            this.clientInvites = {
                keyword: '',
                list: [],
                isInvited: null,
                page: 1,
                limit: 10,
                total: 0,
            };
            this.clientNotAssigns = {
                keyword: '',
                list: [],
                page: 1,
                limit: 10,
                total: 0,
            };
        },
        initData() {
            this.getClients();
            this.getManagers();
            this.getNotAssigns();
            this.getCountNotAssigns();
            this.getNotCruncher();
            this.getCountlistNotcruncher();
            this.getFinishCruncher();
            this.getCountlistFinishcruncher();
            this.initPage();
        },
        async initPage() {
            await this.getInvited();
            await this.getCountInvited();
            let body = [];

            this.clientInvites.list.forEach(item => {
                body.push(item._id);
            });

            await this.getStatus(body);
        },
        openBoxManager(_id) {
            $('.box-manager').removeClass('active');
            this.$refs.boxManagers.find(b => b.id === _id).open(_id);
        },
        async getInvited() {
            let {data} = await this.$services.reportService.getClientInviteds(this.productCode, this.clientInvites.page, this.clientInvites.limit);
            if (data)
                this.clientInvites.list = data || [];
        },
        async getCountInvited() {
            let count = await this.$services.reportService.getCountClientInviteds(this.productCode);
            if (count.error)
                return count.error;
            else
                this.clientInvites.total = count.data;
        },
        async getNotAssigns() {
            let {data} = await this.$services.reportService.getClientNotassigned(this.productCode, this.clientNotAssigns.page, this.clientNotAssigns.limit);
            if (data)
                this.clientNotAssigns.list = data || [];
        },
        async getCountNotAssigns() {
            let count = await this.$services.reportService.getCountNotassigned(this.productCode);
            if (count.error)
                return count.error;
            else
                this.clientNotAssigns.total = count.data;
        },
        async getNotCruncher() {
            let {data} = await this.$services.reportService.getlistNotcruncher(this.productCode, this.notCruncher.page, this.notCruncher.limit);
            if (data) {
                data.forEach((item) => {
                    // item.subName = this.trimName(item.fullName);
                    if (item.avatar && item.avatar.url) {
                        item.avatar.url = mapUrlGoogleStorage(item.avatar.url);
                    }
                });
                this.notCruncher.list = data || [];
            }
        },
        async getFinishCruncher() {
            let {data} = await this.$services.reportService.getlistFinishcruncher(this.productCode, this.finishCruncher.page, this.finishCruncher.limit);
            if (data)
                this.finishCruncher.list = data || [];
        },
        async getCountlistNotcruncher() {
            let result = await this.$services.reportService.getCountlistNotcruncher(this.productCode);
            if (result.data)
                this.notCruncher.total = result.data || 0;
        },
        async getCountlistFinishcruncher() {
            let result = await this.$services.reportService.getCountlistFinishcruncher(this.productCode);
            if (result.data)
                this.finishCruncher.total = result.data || 0;
        },

        async getClients() {
            let {data} = await this.$services.reportService.getAnalyticClients(this.productCode);
            if (data)
                this.analyticClients = data[0].summary || 0;
        },
        async getManagers() {
            let {data} = await this.$services.reportService.getAnalyticManagers(this.productCode);
            if (data)
                this.analyticManagers = data[0].summary || 0;
        },
        async getStatus(body) {
            if (!body || !body.length)
                return;
            let {data} = await this.$services.userService.getStatusInvited(body);
            if (data) {
                this.clientInvites.list.forEach(item => {
                    data.forEach(element => {
                        if (item._id === element._id)
                            item.status = element.status;
                    });
                });
                this.$forceUpdate();
            }
        },
        async reInvitation(inviteId) {
            if (!inviteId)
                return;

            let {data} = await this.$services.userService.reInvitation(inviteId);
            if (data) {
                for (let i = 0; i < this.clientInvites.list.length; i++) {
                    if (this.clientInvites.list[i]._id === data._id)
                        this.clientInvites.list[i].status = true;
                }
                this.$forceUpdate();
            }
        },
        reSendInvite(inviteId) {
            if (!inviteId)
                return;
            let data = {
                inviteId: inviteId,
                action: 're-send'
            };
            this.title = 'Are you sure you want to cancel this invitation?';
            this.$refs.popupConfirm.open(data);
        },
        deleteInvitation(inviteId) {
            if (!inviteId)
                return;
            let data = {
                inviteId: inviteId,
                action: 'delete'
            };
            this.title = 'Are you sure you want to cancel this delete?';
            this.$refs.popupConfirm.open(data);
        },
        actionConfirm(event) {
            if (event.action === 're-send')
                this.reInvitation(event.inviteId);
            else
                this.delete(event.inviteId);
        },
        mapUrlGoogleStorage(url) {
            return mapUrlGoogleStorage(url);
        },
        ValidURL(str) {
            var pattern = /^(https:\/\/)((\w+|\d+)(\:*\d+|)(\/))|^((https:\/\/)(\w+|\d+)(\.*\w+|\d+))/; // eslint-disable-line  no-useless-escape
            if (!pattern.test(str)) {
                return false;
            }
            else
                return true;
        },
    }
};
</script>
