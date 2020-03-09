<template>
    <div :id="id" class="modal show box-popup new-popup">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-head">
                    <h3 class="modal-title">New folder</h3>
                </div>
                <div class="modal-container">
                    <div class="form-group">
                        <label class="form-label">folder name</label>
                        <input v-model="name" type="text" class="form-control form-input">
                    </div>
                    <div class="group-btn text-right">
                        <button class="form-btn" @click="createFolder">Create</button>
                        <button class="form-btn grey" @click="close">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data: () => ({
        name: ''
    }),
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    methods: {
        open() {
            this.name = '';
            $('#' + this.id).modal({
                keyboard: false,
                backdrop: 'static',
                show: true
            });
        },
        close() {
            $('#' + this.id).modal('hide');
        },
        createFolder() {
            this.$emit('create', this.name);
            this.close();
        }
    }
};
</script>

