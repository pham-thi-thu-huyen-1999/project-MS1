<template>
    <div class="swimlane">
        <ul id="swimlane-list" :style="{transform:`translateY(${marginTop}px)`}">
            <li class="loading-phrase" :id="`wdt-item-${index}-${customId}`" v-for="(item, index) in items" :key="index">
                {{item}}
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: ['items', 'index', 'isError', 'shouldCheckFirstItem'],
    watch: {
        index: function(newData, oldData) {
            if (newData && this.items && newData < this.items.length && newData >= 0) {
                if (this.isError) {
                    this.translateStep(oldData + 1);
                    return;
                }
                if (newData - oldData > 1) {
                    for (let i = oldData + 1; i <= newData; i++) {
                        this.translateStep(i);
                    }
                }
                else
                    this.translateStep(newData);
            }
        }
    },
    data() {
        return {
            marginTop: 10,
        };
    },
    computed: {
        customId: function() {
            return this.createCustomId();
        }
    },
    mounted() {
        if (this.shouldCheckFirstItem) {
            setTimeout(() => {
                $(`#wdt-item-${0}-${this.customId}`).delay(1200).addClass('wdt-checked');
            }, 800);
        }
    },
    methods: {
        async translateStep(index) {
            if (this.isError)
                $(`#wdt-item-${index}-${this.customId}`).delay(1200).addClass('wdt-error');
            else
                $(`#wdt-item-${index}-${this.customId}`).delay(1200).addClass('wdt-checked');
            this.marginTop = 10 - index * 30;
            await this.sleep(2400);
        },
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        createCustomId() {
            return (Math.floor(Math.random() * 10000)).toString();
        }
    }
};
</script>