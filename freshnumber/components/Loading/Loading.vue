<template>
    <div class="loading" v-if="isShowLoading">
        <div class="loading-page">
            <div class="windows8">
                <div class="wBall" id="wBall_1">
                    <div class="wInnerBall"></div>
                </div>
                <div class="wBall" id="wBall_2">
                    <div class="wInnerBall"></div>
                </div>
                <div class="wBall" id="wBall_3">
                    <div class="wInnerBall"></div>
                </div>
                <div class="wBall" id="wBall_4">
                    <div class="wInnerBall"></div>
                </div>
                <div class="wBall" id="wBall_5">
                    <div class="wInnerBall"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Loading from './index';
export default {
    name: 'VueLoadingPage',
    data() {
        return {
            isShowLoading: false
        };
    },
    beforeMount() {
        Loading.event.$on('open', () => {
            this.open();
        });
        Loading.event.$on('close', () => {
            this.close();
        });
    },
    methods: {
        open() {
            this.isShowLoading = true;
        },
        close() {
            this.isShowLoading = false;
        }
    }
};
</script>
