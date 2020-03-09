<template>
    <div class="modal fade box-popup reconnect-confirm" :id="id" role="dialog" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <img class="img-reconnect" src="~/assets/images/connect-big.svg" />
                    <h3 class="popup-title">reconnect bank</h3>
                    <p class="popup-description">
                        The system will keep the old transactions and just update it.<br/>
                            and not effect to Cruncher data.
                    </p>
                    <div class="row">
                        <div class="col-12 two-btn text-center">
                            <button @click="reconnectBank" class="form-btn">ok</button>
                            <button @click="cancel" class="white form-btn">cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>  
</template>

<script>
import EventBus from '~/plugins/event-bus';

export default {
    data() {
        return {
            clientId: '',
            productCode: null,
        };
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    methods: {
        reset() {
            this.clientId = '';
            this.productCode = null;
        },
        open(data) {
            this.reset();

            if (!data)
                return false;

            this.clientId = data.clientId;
            this.productCode = data.productCode;
            $('#' + this.id).modal('show');
        },
        async reconnectBank() {
            if (!this.clientId || !this.productCode)
                return false;

            let body = {
                clientId: this.clientId,
                productCode: this.productCode
            };
            let {data, error} = await this.$services.userService.reconnectBank(body);
            if (error || !data)
                EventBus.$emit('NOTIFICATION_ERROR', {title: 'Failed', description: 'Allow for client reconnect bank fail'});
            else {
                EventBus.$emit('NOTIFICATION_SUCCESS', {title: 'Success', description: 'Allow for client reconnect bank success'});
                $('#' + this.id).modal('hide');
            }
        },
        cancel() {
            $('#' + this.id).modal('hide');
        }
    }
};
</script>