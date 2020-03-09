<template>
    <div :id="id" class="modal fade box-popup new-popup show">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-head">
                    <h3 class="modal-title">Upload request</h3>
                </div>
                <div class="modal-container">
                    <div class="form-group">
                        <label class="form-label">Enter client's email</label>
                        <input type="text" v-model="email"  class="form-control form-input">
                        <div class="option-date">
                            <span class="txt-grey">Expiration Date: </span>
                                <no-ssr>
                                    <date-picker  class="input-date" v-model="date" :config="options" :id="'date-picker'" readonly="readonly"/>
                                </no-ssr>
                                <label for="date-picker" class="label-date">
                                    <img src="~/assets/images/ico_calendar.svg" alt="calendar">
                                </label>
                        </div>
                    </div>
                    <div class="group-btn text-right">
                        <button class="form-btn" @click="submitRequest">Create</button>
                        <button class="form-btn grey" @click="close">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    data: () => ({
        date: new Date(),
        options: {
            format: 'MM/DD/YYYY (H:mm A)',
            useCurrent: false,
            ignoreReadonly: true,
            allowInputToggle: true,
        },
        email: ''
    }),
    methods: {
        open() {
            this.email = '';
            $('#' + this.id).modal({
                keyboard: false,
                backdrop: 'static',
                show: true,
            });
        },
        close() {
            $('#' + this.id).modal('hide');
        },
        submitRequest() {
            this.$emit('submit', {emailTo: this.email, expiredDate: this.date});
            this.close();
        }
    }
};
</script>

