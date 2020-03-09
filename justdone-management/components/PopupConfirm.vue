<template>
    <div class="modal fade box-popup" :id="id" role="dialog" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <h3 class="popup-title">{{ title }}</h3>
                    <p v-if="description" class="popup-description">{{ description }}</p>
                    <div class="row">
                        <div class="col-12 two-btn text-center">
                            <button @click="success" class="red form-btn">{{buttonName1}}</button>
                            <button @click="cancel" class=" grey form-btn">{{buttonName2}}</button>
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
            title: ''
        };
    },
    props: {
        id: {
            type: String,
            default: ''
        },
        description: {
            type: String,
            default: ''
        },
        buttonName1: {
            type: String,
            default: 'Yes'
        },
        buttonName2: {
            type: String,
            default: 'No'
        }
    },
    methods: {
        open(data) {
            this.data = data;
            this.title = 'Are you sure?';
            if (this.data.title)
                this.title = this.data.title;
            $('#' + this.id).modal('show');
        },
        success() {
            $('#' + this.id).modal('hide');
            this.$emit('success', this.data);
        },
        cancel() {
            $('#' + this.id).modal('hide');
            this.$emit('cancel');
        }
    }
};
</script>

