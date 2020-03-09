<template>
    <div class="modal fade box-popup" id="popup-confirm" role="dialog" data-backdrop="static">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <h3 class="popup-title">{{ title }}</h3>
                    <div v-if="user.name" class="row-item">
                        <div class="col-info-left">
                            <img class="item-img" :src="user.img" title="" alt=""/>
                        </div>
                        <div class="col-info-right">
                            <span class="item-name">{{ user.name }}</span>
                            <span class="item-email">{{ user.email }}</span>
                        </div>
                    </div>
                    <p v-if="description" class="popup-description">{{ description }}</p>
                    <div class="row">
                        <div class="col-12 two-btn text-center">
                            <button @click="handleAction()" :class="{ red : buttonAction === 'Disable' || buttonAction==='Delete'}" class="form-btn">{{ buttonAction }}</button>
                            <button data-dismiss="modal" :class="{ grey : buttonCancel === 'Cancel'}" class="form-btn">{{ buttonCancel}}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>  
</template>
<script>
export default {
    data() {
        return {

        };
    },
    props: {
        id: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
        user: {
            type: Object,
            default: {img: '', name: '', email: ''}
        },
        buttonAction: {
            type: String,
            default: ''
        },
        buttonCancel: {
            type: String,
            default: ''
        },
        description: {
            type: String,
            default: ''
        }
    },
    methods: {
        handleAction() {
            this.$emit('handleAction', {id: this.id});
        }
    }
};
</script>

