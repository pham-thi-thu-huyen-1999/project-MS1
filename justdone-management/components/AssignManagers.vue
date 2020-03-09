<template>
    <div class="modal fade box-popup assign-managers" :id="id" role="dialog" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog">
            <div class="modal-content">
                <button @click="close" class="btn-close border-black"><img src="~/assets/images/close.svg"/></button>
                <div class="modal-body">
                    <h3 class="popup-title">Assign Managers</h3>
                    <div class="assign-info">
                        <span class="assign-name">{{ userTarget.fullName }}</span>
                        (<span class="assign-email">{{ userTarget.email }}</span>)
                    </div>
                    <div class="box-manager">
                        <div class="row mb-30" v-if="$store.state.userAuth && type === 'CLIENT_MANAGEMENT' && ($store.state.userAuth.permission.role.code === role.SuperAdmin || $store.state.userAuth.permission.role.code === role.RegionAdmin
                        || $store.state.userAuth.permission.role.code === role.Supervisor)">
                            <!-- <div class="col select-asign">
                                <h5 class="title-col">Product Type</h5>
                                <div class="dropdown">
                                    <div class="dropdown-toggle" data-toggle="dropdown">
                                        <button class="btn-select-manager">
                                            Select Product Type
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
                                                <li class="select-manager-item">
                                                Randy Wolfe 
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>  
                            </div> -->
                            <div class="col">
                                <h5 class="title-col">Product</h5>
                                <div class="dropdown">
                                    <div class="dropdown-toggle" data-toggle="dropdown">
                                        <button class="btn-select-manager">
                                            {{ productSelected.name ? productSelected.name : 'Select product' }}
                                            <i class="fa fa-caret-up" aria-hidden="true"></i>
                                            <i class="fa fa-caret-down" aria-hidden="true"></i>
                                        </button>
                                    </div>
                                    <ul class="dropdown-menu">
                                        <!-- <li class="select-manager">
                                            <input class="select-manager-search" type="text">
                                            <i class="fa fa-search" aria-hidden="true"></i>
                                        </li> -->
                                        <li class="select-manager">
                                            <ul class="select-manager-list">
                                                <li class="select-manager-item" v-for="(product, index) in productSystems" :key="index" @click="changeItem(product)">
                                                {{ product.name }}
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col"></div>
                            <div class="col"></div>
                            <div class="col"></div>
                        </div>
                        <div class="row">
                            <div class="col-3" v-for="(role, index) in roleSystems" :key="index" v-if="roleSystems.length > 0 && role.code < userTarget.roleCode">
                                <h5 class="title-col">{{ role.name }}</h5>
                                <div class="dropdown">
                                    <div class="dropdown-toggle" data-toggle="dropdown">
                                        <button class="btn-select-manager" @click="getListNotAssign(role._id, role.code, '')">
                                            Select Admin
                                            <i class="fa fa-caret-up" aria-hidden="true"></i>
                                            <i class="fa fa-caret-down" aria-hidden="true"></i>
                                        </button>
                                    </div>
                                    <ul class="dropdown-menu">
                                        <li class="select-manager">
                                            <input class="select-manager-search" type="text" v-model="textSearch" @input="getListNotAssign(role._id, role.code, textSearch)">
                                            <i class="fa fa-search" aria-hidden="true"></i>
                                        </li>
                                        <li class="select-manager">
                                            <ul class="select-manager-list">
                                                <li class="select-manager-item" v-for="(notAssign, index) in role.notAssignManagers" :key="index" @click="assignManager(notAssign._id)" v-if="role.notAssignManagers.length > 0">
                                                    {{ notAssign.fullName }}
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                    <div class="list-product-manager">
                                        <div class="row-item" v-for="(manager, index) in role.managers" :key="index">
                                            <img class="item-img" :src="manager.avatar || '/images/default-avatar.jpg'" title="" alt=""/>
                                            <span class="item-name">{{ manager.fullName }}</span>
                                            <span class="item-email" :title="manager.email">{{ manager.email }}</span>
                                            <span class="delete-assign" @click="unassignManager(manager._id)"><i class="fa fa-times"></i></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- <div class="row">
                        <div class="col-12 two-btn text-center">
                            <button @click="success" class="red form-btn">{{buttonName1}}</button>
                            <button @click="close" class=" grey form-btn">{{buttonName2}}</button>
                        </div>
                    </div> -->
                </div>
            </div>
        </div>
    </div>  
</template>

<script>
import EventBus from '~/plugins/event-bus';
import {RoleCode, ProductCode} from '~/common/commonType';
import {mapUrlGoogleStorage} from '~/helpers/dataHelper';

export default {
    props: ['id'],
    data() {
        return {
            type: '',
            role: null,
            userTarget: {
                _id: '',
                fullName: null,
                email: null,
                roleCode: null,
                productCode: null
            },
            roleSystems: [],
            productSystems: [],
            productSelected: {
                code: null,
                name: '',
                _id: ''
            },
            textSearch: null,
        };
    },
    created() {
        this.role = RoleCode;
    },
    methods: {
        open(_id, fullName, email, productCode, roleCode, type) {
            $('#manager_' + _id).modal('show');
            this.userTarget.fullName = fullName;
            this.userTarget.email = email;
            this.userTarget.roleCode = roleCode;
            this.userTarget.productCode = productCode;
            if (_id && this.userTarget._id && this.userTarget._id === _id)
                return;

            if (_id)
                this.userTarget._id = _id;

            this.type = type;
            if (type === 'TEAM_MANAGEMENT') {
                let product = {
                    code: null,
                    name: '',
                };
                if (productCode) {
                    for (let key in ProductCode) {
                        if (ProductCode[key] === productCode) {
                            product.code = ProductCode[key];
                            product.name = key;
                        }
                    }
                }
                else {
                    for (let key in ProductCode) {
                        if (ProductCode[key] === this.$store.state.productCode) {
                            product.code = ProductCode[key];
                            product.name = key;
                        }
                    }
                }
                this.changeItem(product);
            }
            else if (type === 'CLIENT_MANAGEMENT') {
                if (this.$store.state.userAuth.permission.role.code === this.role.SuperAdmin ||
                this.$store.state.userAuth.permission.role.code === this.role.RegionAdmin ||
                this.$store.state.userAuth.permission.role.code === this.role.Supervisor)
                    this.getProductType();
                else {
                    let product = {
                        code: null,
                        name: '',
                    };
                    if (productCode) {
                        for (let key in ProductCode) {
                            if (ProductCode[key] === productCode) {
                                product.code = ProductCode[key];
                                product.name = key;
                            }
                        }
                    }
                    else {
                        for (let key in ProductCode) {
                            if (ProductCode[key] === this.$store.state.productCode) {
                                product.code = ProductCode[key];
                                product.name = key;
                            }
                        }
                    }
                    this.changeItem(product);
                }
            }
        },
        async getProductType() {
            let lstProduct = [this.$store.state.productCode];
            if (this.userTarget && this.userTarget.productCode)
                lstProduct.push(this.userTarget.productCode);
            let {data, error} = await this.$services.productService.lookup(lstProduct);
            if (error)
                return false;
            if (data)
                this.productSystems = data || [];
            if (this.$store.state.userAuth.permission.role.code !== this.role.SuperAdmin) {
                let productManager = {};
                let productRemove = [];
                this.productSystems.forEach(function(i, index) {
                    if (i.name === 'Management') {
                        productManager.code = i.code;
                        productManager.name = i.name;
                        productManager._id = i._id;
                    }
                    else {
                        productRemove.push(index);
                    }
                });
                await productRemove.map(i => this.productSystems.splice(i));
                this.changeItem(productManager);
            }
        },
        async getManagers(_id) {
            let {data, error} = await this.$services.roleService.getRoles(this.productSelected.code);
            if (!data || error)
                return false;

            let roles = data;
            for (const role of roles) {
                if (role.code < this.userTarget.roleCode) {
                    let result = await this.$services.userService.getManagersByUsers([this.productSelected.code], [role.code], [_id]);
                    result.data.forEach(manager => {
                        if (manager.managers && manager.managers.length > 0) {
                            role.managers = manager.managers;
                            role.managers.forEach((item) => {
                                item.avatar = mapUrlGoogleStorage(item.avatar);
                            });
                        }
                        else
                            role.managers = [];
                    });
                }
            }
            this.roleSystems = roles;
            this.$forceUpdate();
        },
        async getListNotAssign(roleId, roleCodes, keyword) {
            let {data, error} = await this.$services.userService.getManagersForAssign(this.productSelected.code, this.userTarget._id, [roleCodes], keyword, 1, 10);
            if (error)
                EventBus.$emit('NOTIFICATION_ERROR', {title: 'Failed', description: error});

            if (data) {
                this.roleSystems.forEach(role => {
                    if (role._id === roleId)
                        role.notAssignManagers = data;
                });
            }
            this.$forceUpdate();
        },
        async assignManager(managerId) {
            let result = await this.$services.userService.assignManager(this.userTarget._id, [managerId]);
            if (!result)
                EventBus.$emit('NOTIFICATION_ERROR', {title: 'Failed', description: 'Assign Manager Failed'});
            else {
                EventBus.$emit('NOTIFICATION_SUCCESS', {title: 'Success', description: 'Assign Manager Success'});
                this.getManagers(this.userTarget._id);
            }
        },
        async unassignManager(managerId) {
            let result = await this.$services.userService.unassignManager(this.userTarget._id, [managerId]);
            if (!result)
                EventBus.$emit('NOTIFICATION_ERROR', {title: 'Failed', description: 'Uassign Manager fail'});
            else {
                EventBus.$emit('NOTIFICATION_SUCCESS', {title: 'Success', description: 'Uassign success'});
                this.getManagers(this.userTarget._id);
            }
        },
        changeItem(product) {
            this.productSelected = product;
            this.getManagers(this.userTarget._id);
        },
        success() {
            $('#manager_' + this.userTarget._id).modal('hide');
            this.$emit('success', this.data);
        },
        close() {
            $('#manager_' + this.userTarget._id).modal('hide');
            this.$emit('close');
        }
    }
};
</script>
