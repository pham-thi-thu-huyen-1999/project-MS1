<template>
    <div class="box-manager" :id="id">
        <div class="row">
            <div class="col-6 col-xs-12">
                <h5 class="title-col">Product manager</h5>
                <div class="dropdown" v-if="$auth.checkPermission($module.MANAGER.claim.GET.code, ($store.state.userAuth ? $store.state.userAuth.permission.role.code : null))">
                    <div class="dropdown-toggle" data-toggle="dropdown">
                        <button class="btn-select-manager" @click="getListManagers">
                            Select manager
                            <i class="fa fa-caret-up" aria-hidden="true"></i>
                            <i class="fa fa-caret-down" aria-hidden="true"></i>
                        </button>
                    </div>
                    <ul class="dropdown-menu">
                        <li class="select-manager">
                            <input class="select-manager-search" type="text">
                            <i class="fa fa-search" aria-hidden="true"></i>
                        </li>
                        <li class="select-manager">
                            <ul class="select-manager-list">
                                <li v-for="(item, index) in lists" :key="index" class="select-manager-item" @click="assignManager(item._id)">
                                    {{item.fullName}} 
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <div class="list-product-manager">
                        <div class="row-item" v-for="(productManger, index) in managers" :key="index" v-if="productManger.code === 4">
                            <div>
                                <img class="item-img" :src="productManger.avatar ? productManger.avatar : '/images/default-avatar.jpg' " title="" alt=""/>
                                <span class="item-name">{{productManger.fullName}}</span>
                                <span class="item-email" :title="productManger.email">{{productManger.email}}</span>
                                <span class="delete-assign" @click="unassignManager(productManger._id)"><i class="fa fa-times"></i></span>
                            </div>
                        </div>
                    </div>
                </div>
                <template v-else>
                    <div v-if="productManger.code === 4" class="row-item" v-for="(productManger, index) in managers" :key="index">
                        <img class="item-img" :src="productManger.avatar ? productManger.avatar : '/images/default-avatar.jpg' " title="" alt=""/>
                        <span class="item-name">{{productManger.fullName}}</span>
                        <span class="item-email" :title="productManger.email">{{productManger.email}}</span>
                        <!-- <span class="delete-assign" @click="unassignManager(productManger._id)"><i class="fa fa-times"></i></span> -->
                    </div>
                </template>
            </div>
            <div class="col-6 col-xs-12">
                <h5 class="title-col">Supervisor</h5>
                <div class="row-item" v-for="(supervisor, index) in managers" :key="index" v-if="supervisor.code === 5">
                    <div>
                        <img class="item-img" :src="supervisor.avatar ? supervisor.avatar : '/images/default-avatar.jpg' " title="" alt=""/>
                        <span class="item-name">{{supervisor.fullName}}</span>
                        <span class="item-email" :title="supervisor.email">{{supervisor.email}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {RoleCode} from '~/common/commonType';
import {mapUrlGoogleStorage} from '~/helpers/dataHelper';
import EventBus from '~/plugins/event-bus';
export default {
    props: ['id'],
    data: () => ({
        _id: '',
        managers: [],
        lists: [],
    }),
    methods: {
        open(_id) {
            $('.box-manager').not(document.getElementById(_id)).removeClass('active');
            $('#' + _id).toggleClass('active');
            if (_id && this._id && this._id === _id)
                return;

            this.reset();

            if (_id) {
                this.getManager(_id);
                this.getListManagers(_id);
                this._id = _id;
            }
        },
        reset() {
            this._id = '';
            this.managers = [];
            this.lists = [];
        },
        async getListManagers() {
            let {data, error} = await this.$services.userService.getManagers([this.$store.state.productCode], [RoleCode.ProductManager], '', false, 1, 10);
            if (error)
                EventBus.$emit('NOTIFICATION_ERROR', {title: 'Error', description: error.message});
            else
                this.lists = data || [];
        },
        async getManager(_id) {
            let {data, error} = await this.$services.userService.getManagersByClients([], [], [_id]);
            let managerArr = data[0].managers;

            for (let manager of managerArr) {
                manager.code = manager.permission.role.code;
                manager.avatar = mapUrlGoogleStorage(manager.avatar);
            }
            if (error) {
                EventBus.$emit('NOTIFICATION_ERROR', {title: 'Error', description: error.message});
            }
            else {
                this.managers = data[0].managers || [];
            }
        },
        async assignManager(managerId) {
            let result = await this.$services.userService.assignManager(this._id, [managerId]);
            if (!result) {
                EventBus.$emit('NOTIFICATION_ERROR', {title: 'Error', description: 'Assign Manager fail'});
            }
            else {
                console.log('Assign success');
                this.getManager(this._id);
            }
        },
        async unassignManager(managerId) {
            let result = await this.$services.userService.unassignManager(this._id, [managerId]);
            if (!result) {
                EventBus.$emit('NOTIFICATION_ERROR', {title: 'Error', description: 'Uassign Manager fail'});
            }
            else {
                console.log('Uassign success');
                this.getManager(this._id);
            }
        }
    }
};
</script>

