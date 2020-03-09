<template>
    <div class="box-history-logs box-right">
        <h3 class="section-title">History logs <i class="fa fa-clock-o" aria-hidden="true"></i></h3>
        <div class="history-logs">
            <!--<h4 class="list-box-title">Today</h4>-->
            <div class="box-right-section init-loadmore-history">
                <ul class="list-box list-loadmore-history" v-if="list.length">
                    <li class="list-item" v-for="(history, index) in list" :key="index">
                        <span class="list-link" v-html="history.description"></span><span class="list-time">{{ history.createdAt | timeFromNow }}</span>
                    </li>
                </ul>
                <div class="no-data text-center" v-else>
                    <img src="~/assets/images/no-data.png" alt="no data">
                    <p class="text-note">No data available.</p>
                </div>
            </div>
            
            <!--<h4 class="list-box-title">Week</h4>
            <div class="box-right-section">
                <ul class="list-box">
                    <li class="list-item">
                        <a class="list-link">Emma Gibson has invited Julia into system</a><span class="list-time">Just now</span>
                    </li>
                    <li class="list-item">
                        <a class="list-link">Emma Gibson has invited Julia into system</a><span class="list-time">10 mins ago</span>
                    </li>
                    <li class="list-item">
                        <a class="list-link">Emma Gibson has invited Julia into system</a><span class="list-time">10 mins ago</span>
                    </li>
                </ul>
            </div>
            <h4 class="list-box-title">Month</h4>
            <div class="box-right-section">
                <ul class="list-box">
                    <li class="list-item">
                        <a class="list-link">Emma Gibson has invited Julia into system</a><span class="list-time">Just now</span>
                    </li>
                    <li class="list-item">
                        <a class="list-link">Emma Gibson has invited Julia into system</a><span class="list-time">10 mins ago</span>
                    </li>
                    <li class="list-item">
                        <a class="list-link">Emma Gibson has invited Julia into system</a><span class="list-time">10 mins ago</span>
                    </li>
                </ul>
            </div>-->
        </div>
    </div>
</template>

<script>
import {timeFromNow} from '~/helpers/dateHelper';
import EventBus from '~/plugins/event-bus';

export default {
    data() {
        return {
            userId: '',
            list: [],
            page: 1,
            limit: 10,
            total: 0,
            module: null,
            type: null,
            isLoad: false
        };
    },
    created() {
        this.userId = this.$store.state.userAuth._id;
    },
    mounted() {
        this.initHistory();
    },
    updated() {
        this.loadMoreHistory();
    },
    methods: {
        initHistory() {
            this.isLoad = true;
            if (this.isLoad) {
                this.getList();
                this.getCount();
            }
        },
        async getList() {
            this.isLoad = false;
            let {data, error} = await this.$services.historyService.getByUserId(this.module, this.type, this.page, this.limit);
            if (error)
                EventBus.$emit('NOTIFICATION_ERROR', {title: 'Error', description: error.message});
            else
                this.list = this.list.concat(data);

            this.isLoad = true;
        },
        async getCount() {
            let {data, error} = await this.$services.historyService.getCountByUserId(this.userId);
            if (error)
                EventBus.$emit('NOTIFICATION_ERROR', {title: 'Error', description: error.message});
            else
                this.total = data || 0;
        },
        loadMoreHistory() {
            let initLoadMoreEl = document.querySelector('.init-loadmore-history');
            let listLoadMoreEl = document.querySelector('.list-loadmore-history');
            initLoadMoreEl.addEventListener('scroll', async () => {
                if ((initLoadMoreEl.scrollTop + initLoadMoreEl.offsetHeight) > (listLoadMoreEl.offsetHeight - 10)) {
                    if (this.list.length < this.total) {
                        if (this.isLoad) {
                            this.page += 1;
                            await this.getList();
                        }
                    }
                }
            });
        }
    },
    filters: {
        timeFromNow(date) {
            return timeFromNow(date);
        }
    }
};
</script>