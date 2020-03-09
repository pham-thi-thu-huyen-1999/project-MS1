<template>
    <div class="modal box-popup expense" id="add-group-expense" role="dialog" data-backdrop="static">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">   
                    <div class="form-group">
                        <div class="row">
                            <!-- <div class="col-4 pdr-5">
                                <label class="form-label">Group code</label>
                                <input type="text" class="form-control form-input" :class="{error : errorGroupCode}" placeholder="" v-model="groupData.codeGroupExpense">
                            </div> -->
                            <div class="col-12">
                                <label class="form-label">Group name</label>
                                <input type="text" class="form-control form-input" :class="{error : errorGroupName}" placeholder="" v-model="groupData.nameGroupexpense">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 text-center">
                            <p v-if="errorText" class="form-label-error">{{errorText}}</p>
                        </div>
                        <div class="col-12 two-btn text-center">
                            <button @click="handleSubmit()" class="form-btn">Save</button>
                            <button data-dismiss="modal" class="form-btn grey">cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>  
</template>

<script>
export default {
    props: {
        groupData: {
            idGroupExpense: {
                type: String,
                default: ''
            },
            nameGroupexpense: {
                type: String,
                default: ''
            },
            codeGroupExpense: {
                type: Number,
                default: 1
            },
            action: {
                type: String,
                default: 'create'
            },
            order: {
                type: Number,
                default: 1
            }
        }

    },
    data() {
        return {
            nameGroup: '',
            errorText: '',
            errorGroupNameText: '',
            errorGroupCodeText: '',
            errorGroupCode: false,
            errorGroupName: false,
        };
    },
    methods: {
        resetForm() {
            this.nameGroup = '';
            this.errorText = '';
            this.errorGroupNameText = '';
            this.errorGroupCodeText = '';
            this.errorGroupCode = false;
            this.errorGroupName = false;
        },
        async handleSubmit() {
            // if (!this.validateCode(this.groupData.codeGroupExpense)) {
            //     this.errorGroupCode = true;
            //     this.errorText = 'The code is incorrect.';
            //     return false;
            // }

            console.log('this.groupData===>', this.groupData);

            if (!this.validataName(this.groupData.nameGroupexpense)) {
                this.errorGroupName = true;
                this.errorText = 'The name is incorrect.';
                return false;
            }

            let data = {
                name: this.groupData.nameGroupexpense,
                code: 1,
                order: this.groupData.order,
            };

            let result;
            if (this.groupData.action === 'create')
                result = await this.$services.groupExpenseService.creatGroup(data);
            else {
                if (!this.groupData.idGroupExpense)
                    return;
                result = await this.$services.groupExpenseService.updateGroup(this.groupData.idGroupExpense, data);
            }

            if (result.data) {
                this.$emit('createSuccess', result.data);
                this.notifiSuccess();
                this.exitModal();
            }
            else {
                this.errorGroupName = true;
                this.errorGroupCode = true;
                this.errorText = result.error.message;
                return false;
            }
        },
        // validateCode(code) {
        //     if (!code || isNaN(code) || code <= 0 || code.toString().trim().length > 0)
        //         return false;
        //     return true;
        // },
        validataName(name) {
            if (!name || name.trim().length === 0 || name.trim().length > 50)
                return false;
            return true;
        },
        notifiSuccess() {
            this.$notify({
                group: 'success',
                title: 'Creat completed',
                text: 'Thank you'
            });
        },
        exitModal() {
            $('#add-group-expense').modal('hide');
        }
    }
};
</script>

