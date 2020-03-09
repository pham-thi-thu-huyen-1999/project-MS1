<template>
    <div class="modal fade box-popup show" id="invite-popup" role="dialog" data-backdrop="static">
        <loading :isShowLoading="showLoading"/>        
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <div v-if="image" class="text-center">
                        <img class="popup-img" :src="image" title="" alt=""> 
                    </div>
                    <h3 class="popup-title">{{title}}</h3>    
                    <div class="row">
                        <div class="col-6 pdr-5">
                            <div class="form-group">
                                <label class="form-label">FirstName</label>
                                <input type="text" class="form-control form-input" placeholder="Name" v-model="data.firstName">
                            </div>
                        </div>
                        <div class="col-6 pdl-5">
                            <div class="form-group">
                                <label class="form-label">LastName</label>
                                <input type="text" class="form-control form-input" placeholder="Name" v-model="data.lastName">
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="text" class="form-control form-input" placeholder="Email" v-model="data.email">
                    </div>
                    <div class="form-group" v-if="errorText" style="text-align: center;">
                        <label class="form-label" style="color: red;">{{ errorText }}</label>                    
                    </div> 
                    <div class="col-12  text-center">
                        <div class="row">
                            <div class="col-6"><button class="form-btn" @click="sendInvitation">Invite</button></div>
                            <div class="col-6">  <button data-dismiss="modal" class="form-btn grey">cancel</button></div>
                        </div>
                    </div>                   
                   
                </div>
            </div>
        </div>
    </div>  
</template>

<script>
import Loading from '~/components/Loading';
export default {
    data() {
        return {
            data: {
                email: null,
                firstName: null,
                lastName: null
            },
            errorText: null,
            showLoading: false
        };
    },
    components: {
        Loading
    },
    props: {
        title: {
            type: String,
            default: ''
        },
        image: {
            type: String,
            default: ''
        }
    },
    methods: {
        open() {
            this.reset();
            $('#invite-popup').modal('show');
        },
        close() {
            $('#invite-popup').modal('hide');
        },
        reset() {
            this.data = {
                email: '',
                firstName: '',
                lastName: ''
            };
            this.errorText = '';
            this.showLoading = false;
        },
        async sendInvitation() {
            if (!this.validataName(this.data.firstName) || !this.validataName(this.data.lastName)) {
                this.errorText = 'Info invalid!';
                return;
            }

            if (!this.validateEmail())
                return;

            this.showLoading = true;
            let result = await this.$services.userService.sendInvitation(this.data);
            if (result.error) {
                this.errorText = result.error.message;
                this.showLoading = false;
                return result.error;
            }
            this.showLoading = false;
            this.close();
            this.notifiSuccess();
        },
        validataName(name) {
            if (!name || name.trim().length === 0 || name.trim().length > 20)
                return false;
            return true;
        },
        validateEmail() {
            this.data.email = this.data.email.toLowerCase().trim();
            var regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
            if (!regExp.test(this.data.email)) {
                this.errorText = 'Email is invalid!';
                return false;
            }
            return true;
        },
        notifiSuccess() {
            this.$notify({
                group: 'success',
                title: 'Update completed',
                text: 'Thank you'
            });
        },
    }
};
</script>

