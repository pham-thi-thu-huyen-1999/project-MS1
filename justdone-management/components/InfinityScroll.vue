<template>
    <div
        :id="id"
    >
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: 'infinity-scroll',
    mounted() {
        // document.getElementById(this.id).addEventListener('scroll', this.scrollListener);
    },
    props: {
        id: {
            type: String,
            default: 'infinity_scroll'
        },
        onReachBottom: {
            type: Function,
            default: () => { }
        },
        className: {
            type: String,
            default: ''
        },
        total: {
            type: Number,
            default: 0
        }
    },
    methods: {
        // scrollListener(event) {
        //     event.stopPropagation();
        //     console.log('ttttttttttttttttttt');
        // }
    }
};
</script>