<template>
    <div
        class="box-manager"
        :id="id"
    >
        <div class="row">
            <div
                class="col-3"
                v-for="(role, index) in list"
                :key="index"
            >
                <h5 class="title-col">{{role.name}}</h5>
                <div class="list-product-manager">
                    <div
                        class="row-item"
                        v-for="(manager, index) in role.managers"
                        :key="index"
                    >
                        <img
                            class="item-img"
                            :src="manager.avatar ? manager.avatar : '/images/default-avatar.jpg'"
                            title=""
                            alt=""
                        />
                        <span class="item-name">{{manager.fullName}}</span>
                        <span
                            class="item-email"
                            :title="manager.email"
                        >{{manager.email}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapUrlGoogleStorage} from '~/helpers/dataHelper';

export default {
    props: ['id'],
    data() {
        return {
            _id: '',
            list: [],
        };
    },
    methods: {
        open(_id) {
            $('#' + _id).toggleClass('active');
            if (_id && this._id && this._id === _id)
                return;

            this.reset();

            if (_id) {
                this.getManagers(_id);
                this._id = _id;
            }
        },
        reset() {
            this._id = '';
            this.managers = [];
        },
        async getManagers(_id) {
            let {data, error} = await this.$services.userService.getManagersByUsers([], [], [_id]);
            let roles = [];

            if (error)
                return false;
            else {
                data[0].managers.forEach(item => {
                    if (item.avatar)
                        item.avatar = mapUrlGoogleStorage(item.avatar);
                    if (item.permission && item.permission.role) {
                        if (!roles.find(r => r._id === item.permission.role._id))
                            roles.push(item.permission.role);
                    }
                });

                roles.sort((a, b) => {
                    if (a.level < b.level) return -1;
                    if (a.level > b.level) return 1;
                    return 0;
                });

                roles.forEach(role => {
                    role.managers = [];
                    data[0].managers.forEach(item => {
                        if (item.permission && item.permission.role && item.permission.role._id === role._id) {
                            role.managers.push(item);
                        }
                    });
                });
            }
            this.list = roles || [];
        },
        async assignManager(managerId) {
            let result = await this.$services.userService.assignManager(this._id, [managerId]);
            if (!result)
                return false;
            else
                this.getManager(this._id);
        },
        async unassignManager(managerId) {
            let result = await this.$services.userService.unassignManager(this._id, [managerId]);
            if (!result)
                return false;
            else
                this.getManager(this._id);
        }
    }
};
</script>
