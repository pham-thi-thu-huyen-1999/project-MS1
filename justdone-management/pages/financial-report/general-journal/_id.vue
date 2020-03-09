<template>
    <div>
        <vertical-menu />
        <section class="financial-template financial-detail">
            <div class="row">
                <div class="col-md-12 col-sm-12 col-xs-12 page-head">
                    <div class="row">
                        <div class="col-md-6 col-sm-6 col-xs-12">
                            <page-title :titles="titles" />
                        </div>
                        <div class="col-md-6 col-sm-6 col-xs-12 text-right">
                            <!-- <a :href="`/financial-report/general-journal?productCode=${$route.query.productCode ? $route.query.productCode : ''}&clientId=${$route.query.userId ? $route.query.userId : '' }&beginMonth=${$route.query.beginMonth ? $route.query.beginMonth : ''}&beginYear=${$route.query.beginYear ? $route.query.beginYear : ''}&endMonth=${$route.query.endMonth ? $route.query.endMonth : ''}&endYear=${$route.query.endYear ? $route.query.endYear : ''}`" class="btn-normal fz-9 btn-back">BACK TO LIST</a>  -->
                            <a
                                @click="$router.push(`/financial-report/general-journal?productCode=${$route.query.productCode ? $route.query.productCode : ''}&clientId=${$route.query.clientId ? $route.query.clientId : $route.query.userId }&beginMonth=${$route.query.beginMonth ? $route.query.beginMonth : ''}&beginYear=${$route.query.beginYear ? $route.query.beginYear : ''}&endMonth=${$route.query.endMonth ? $route.query.endMonth : ''}&endYear=${$route.query.endYear ? $route.query.endYear : ''}`)"
                                class="btn-normal fz-9 btn-back"
                            >BACK TO LIST</a>
                        </div>
                        <div class="col-12 page-filter">
                        </div>
                    </div>
                    <div class="row row-info">
                        <div class="col-md-6 col-sm-6 col-xs-12">
                            <h2 class="title-info">{{code}} <template v-if="idGj !== 'create-gj'"><i v-if="summary.status">(Tax Inclusve)</i><i v-else>(Tax Exclusive)</i></template></h2>
                            <div
                                class="dropdown dropdown-year"
                                :class="{'border-red': isCheck && !monthSelect}"
                            >
                                <a
                                    class="dropdown-toggle item-normal"
                                    style="font-size: 13px;"
                                    data-toggle="dropdown"
                                >{{ monthSelect | convertFinancial(year) }}</a>
                                <ul class="dropdown-menu">
                                    <li
                                        class="dropdown-menu-link"
                                        v-for="month in 6"
                                        @click="selectMonth(7 - month, Number(year) + 1)"
                                        :key="7 -month"
                                    >{{ 7 - month | convertFinancial(year)}}</li>
                                    <li
                                        class="dropdown-menu-link"
                                        v-for="month in 6"
                                        @click="selectMonth(13 - month, Number(year))"
                                        :key="13 -month"
                                    >{{ 13 - month | convertFinancial(year)}}</li>
                                </ul>
                            </div>
                            <button
                                class="btn btn-small ml-2 mb-1"
                                v-if="updateGJ"
                                @click="updateGJDate()"
                            > Update GJ </button>
                        </div>
                        <div class="col-md-6 col-sm-6 col-xs-12 text-right">
                            <div class="dropdown normal-btn">
                                <a
                                    class="btn dropdown-toggle not-arrow"
                                    v-show="idGj === 'create-gj'"
                                    @click="saveAll()"
                                >
                                    SAVE
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-12 col-sm-12 col-xs-12 page-list gj-list">
                    <div class="row">
                        <div class="col-md">
                            <div
                                class="box"
                                v-if="roles.ProductAdmin && $store.state.userAuth && ($store.state.userAuth.permission.role.code !== roles.ProductAdmin)"
                            >
                                <div class="row mb-15">
                                    <div class="col-md-6">
                                        <h3 class="gj-title">Adjustment Transactions</h3>
                                    </div>
                                    <div class="col-md-6 text-right">
                                        <div class="dropdown normal-btn">
                                            <a
                                                class="btn dropdown-toggle not-arrow"
                                                @click="createItem('adjTrans')"
                                            >
                                                ADD NEW
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div class="box-item pdr-15">
                                    <div
                                        class="row row-label"
                                        style="margin: 0px -15px;"
                                    >
                                        <!-- <div class="col width-116"><label class="col-label">MONTH</label></div> -->
                                        <div class="col-2"><label class="col-label">TRANSACTION</label></div>
                                        <div class="col"><label class="col-label">current COA</label></div>
                                        <div class="col"><label class="col-label">CHANGE COA</label></div>
                                        <div class="col width-90"><label class="col-label">debit</label></div>
                                        <div class="col width-90"><label class="col-label">credit</label></div>
                                        <div class="col width-90"><label class="col-label">tax</label></div>
                                        <div class="col"><label class="col-label">Memo</label></div>
                                        <div class="col width-90"><label class="col-label">Evidenced</label></div>
                                        <div class="col text-right width-90"><label class="col-label">Actions</label></div>
                                    </div>
                                    <div
                                        class="row row-item"
                                        :id="'rowId' + index"
                                        :class="{'edit' : isEdit}"
                                        v-for="(item, index) in list"
                                        v-if="item.type === 1"
                                        :key="'adj-'+index"
                                    >
                                        <!-- <div class="col width-116 align-self-center">
                                            <div class="dropdown" :class="{'border-red': isCheck && !item.month}">
                                                <a class="dropdown-toggle item-normal" data-toggle="dropdown">{{ item.month | convertFinancial(year) }}</a>
                                                <ul class="dropdown-menu">
                                                    <li class="dropdown-menu-link" v-for="month in 6" @click="selectMonth(index, 7 - month)" :key="7 -month">{{ 7 - month | convertFinancial(year)}}</li>
                                                    <li class="dropdown-menu-link" v-for="month in 6" @click="selectMonth(index, 13 - month)" :key="13 -month">{{ 13 - month | convertFinancial(year)}}</li>
                                                </ul>
                                            </div>
                                        </div> -->
                                        <div class="col-2 align-self-center">
                                            <div
                                                class="dropdown"
                                                :title="item.transaction.keyword"
                                            >
                                                <input
                                                    type="text"
                                                    data-toggle="dropdown"
                                                    class="dropdown-toggle item-normal"
                                                    :class="{'border-red': isCheck && !item.transaction.keyword}"
                                                    @input="searchTransition(item.transaction.keyword, index)"
                                                    v-model="item.transaction.keyword"
                                                >
                                                <span
                                                    class="input-loading"
                                                    v-if="item.transaction.loading"
                                                ></span>
                                                <ul
                                                    class="dropdown-menu"
                                                    :class="'adj-trans-'+index"
                                                >
                                                    <li
                                                        class="dropdown-menu-link"
                                                        v-for="(itemTrans, index0) in transaction.list"
                                                        :key="'trans-'+index0"
                                                        @click="selectTrans(index, itemTrans)"
                                                        v-if="itemTrans.coaId"
                                                    >{{itemTrans.description.original}}</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="col align-self-center">
                                            <span class="item-normal">{{item.before && item.before.coaId && item.before.coaId.name}}</span>
                                        </div>
                                        <div class="col align-self-center">
                                            <div
                                                class="dropdown"
                                                :title="item.after.coa.keyword"
                                            >
                                                <input
                                                    type="text"
                                                    name="coa name"
                                                    data-toggle="dropdown"
                                                    class="dropdown-toggle item-normal"
                                                    :class="{'border-red': isCheck && !item.after.coa.keyword}"
                                                    @input="searchCoa(item.after.coa.keyword, index)"
                                                    v-model="item.after.coa.keyword"
                                                >
                                                <span
                                                    class="input-loading"
                                                    v-if="item.after.coa.loading"
                                                ></span>
                                                <ul
                                                    class="dropdown-menu"
                                                    :class="'adj-coa-'+index"
                                                >
                                                    <li
                                                        class="dropdown-menu-link"
                                                        v-for="(itemCoa, index1) in coa.list"
                                                        :key="'coa-'+index1"
                                                        @click="selectCoa(index, itemCoa)"
                                                    >{{itemCoa.coa.name}}</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="col align-self-center width-90">
                                            <span class="item-normal">{{(item.transaction.baseType === 'DEBIT' ? item.extend.amount : '') | convertToCurrency}}</span>
                                        </div>
                                        <div class="col align-self-center width-90">
                                            <span class="item-normal">{{(item.transaction.baseType !== 'DEBIT' ? item.extend.amount : '') | convertToCurrency}}</span>
                                        </div>
                                        <div class="col align-self-center width-90">
                                            <span
                                                class="item-normal"
                                                :style="{color: item.isIncludeTax ? '#1c5df4' : ''}"
                                            >{{item.tax}}</span>
                                        </div>
                                        <div
                                            class="col align-self-center"
                                            :title="item.note"
                                        >
                                            <input
                                                type="text"
                                                name="note"
                                                class="item-normal"
                                                v-model="item.note"
                                            >
                                        </div>
                                        <div class="col align-self-center width-90 eviden">
                                            <a
                                                v-if="item._id && item.evidenced"
                                                :href="item.evidenced.url | mapUrlGoogleStorage"
                                                target="_blank"
                                            ><img
                                                    class="evidenced"
                                                    :src="getIconFile(item.evidenced.url)"
                                                    alt="evidenced"
                                                ></a>
                                            <a v-else><img
                                                    class="evidenced"
                                                    src="~/assets/images/image-default.svg"
                                                    alt="evidenced"
                                                ></a>
                                            <!-- <template v-if="item._id">
                                                <label :for="'id-upload-'+index" class="label-change mb-0" v-if="item.evidenced">
                                                    <input type="file" @change="upload($event, index, item._id)" name="upload" :id="'id-upload-'+index" hidden>
                                                    <a :href="item.evidenced.url | mapUrlGoogleStorage" target="_blank"><img class="evidenced" :src="getIconFile(item.evidenced.url)" alt="evidenced"></a>
                                                    <span class="txt-mask">Change</span>
                                                </label>
                                                <label :for="'id-upload-'+index" class="btn-normal color-second mb-0 btn-upload" v-else>upload
                                                    <input type="file" @change="upload($event, index, item._id)" name="upload" :id="'id-upload-'+index" hidden>
                                                </label>
                                            </template> -->
                                        </div>
                                        <div class="col align-self-center text-right width-90 action">
                                            <div class="dropdown">
                                                <a
                                                    class="item-option dropdown-toggle edit"
                                                    data-toggle="dropdown"
                                                >
                                                    ...
                                                </a>
                                                <ul
                                                    class="dropdown-menu"
                                                    style="opacity:1"
                                                >
                                                    <li><a
                                                            class="option-item"
                                                            @click="handleEdit(index)"
                                                        >Edit</a></li>
                                                    <li v-if="item._id">
                                                        <label
                                                            class="option-item"
                                                            :for="'id-upload-'+index"
                                                        >Upload evidenced
                                                            <input
                                                                type="file"
                                                                @change="upload($event, index, item._id)"
                                                                name="upload"
                                                                :id="'id-upload-'+index"
                                                                hidden
                                                            >
                                                        </label>
                                                    </li>
                                                    <li
                                                        v-if="item.haveTax"
                                                        :for="'id-tax-'+index"
                                                    ><label
                                                            style="margin-bottom:0"
                                                            class="option-item"
                                                        >tax inclusive
                                                            <input
                                                                @click="changeTax(index, item)"
                                                                type="checkbox"
                                                                v-model="item.isIncludeTax"
                                                                :id="'id-tax-'+index"
                                                                style="float: right;"
                                                            />
                                                        </label></li>
                                                    <li v-if="$store.state.userAuth && $store.state.userAuth.permission.role.code === role.SuperAdmin"><a
                                                            class="option-item"
                                                            @click="deleteGeneralJournalItem(index, item._id)"
                                                        >Delete</a></li>
                                                </ul>
                                            </div>
                                            <button
                                                class="btn-normal grey save"
                                                @click="cancelAction(index, item)"
                                            >CANCEL</button>
                                            <button
                                                class="btn-normal grey save"
                                                @click="handleSave(index, item)"
                                            >SAVE</button>
                                        </div>
                                        <!-- <div class="col-2 align-self-center">
                                            <button class="btn-normal grey save" @click="handleSave(index, item)">SAVE</button>
                                            <button class="btn-normal grey edit" @click="handleEdit('rowId' + index)">EDIT</button>
                                            <button class="btn-normal grey edit" @click="deleteGeneralJournalItem(item._id)">DELETE</button>
                                            <button class="btn-normal grey save" @click="cancelAction(index, item)">CANCEL</button>
                                        </div> -->
                                    </div>
                                    <div class="col-md-12 col-sm-12 col-xs-12">
                                        <div class="paginate">
                                            <client-only>
                                                <pagination
                                                    id="team-pagination"
                                                    :page="page"
                                                    :limit="limit"
                                                    :total="total"
                                                    @change="changePage"
                                                />
                                            </client-only>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    class="box-item pdr-15"
                                    v-if="list.length === 0"
                                >
                                    <div class="row row-item">
                                        <div class="col-12 align-self-center">
                                            <div class="no-data text-center">
                                                <img
                                                    src="~/assets/images/no-data.png"
                                                    alt="no data"
                                                >
                                                <p class="text-note">Please select option.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="box">
                                <div class="row mb-15">
                                    <div class="col-md-6">
                                        <h3 class="gj-title">New Transactions</h3>
                                    </div>
                                    <div class="col-md-6 text-right">
                                        <div class="dropdown normal-btn">
                                            <a
                                                class="btn dropdown-toggle not-arrow"
                                                @click="createItem"
                                            >
                                                ADD NEW
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div class="box-item pdr-15">
                                    <div
                                        class="row row-label"
                                        style="margin: 0px -15px;"
                                    >
                                        <!-- <div class="col width-116"><label class="col-label">MONTH</label></div> -->
                                        <div class="col-2"><label class="col-label">TRANSACTION</label></div>
                                        <div class="col"><label class="col-label">COA NAME</label></div>
                                        <div class="col width-90"><label class="col-label">debit</label></div>
                                        <div class="col width-90"><label class="col-label">credit</label></div>
                                        <div class="col width-90"><label class="col-label">tax</label></div>
                                        <div class="col"><label class="col-label">Memo</label></div>
                                        <div class="col width-90"><label class="col-label"></label></div>
                                        <div class="col text-right width-90"><label class="col-label">Actions</label></div>
                                    </div>
                                    <div
                                        class="row row-item"
                                        :id="'rowId' + index"
                                        :class="{'edit' : isEdit}"
                                        v-for="(item, index) in list"
                                        v-if="item.type === 2"
                                        :key="'new-'+index"
                                    >
                                        <!-- <div class="col width-116 align-self-center">
                                            <div class="dropdown" :class="{'border-red': isCheck && !item.month}">
                                                <a class="dropdown-toggle item-normal" data-toggle="dropdown">{{ item.month | convertFinancial(year) }}</a>
                                                <ul class="dropdown-menu">
                                                    <li class="dropdown-menu-link" v-for="month in 6" @click="selectMonth(index, 7 - month)" :key="7 -month">{{ 7 - month | convertFinancial(year)}}</li>
                                                    <li class="dropdown-menu-link" v-for="month in 6" @click="selectMonth(index, 13 - month)" :key="13 -month">{{ 13 - month | convertFinancial(year)}}</li>
                                                </ul>
                                            </div>
                                        </div> -->
                                        <div class="col-2 align-self-center">
                                            <input
                                                type="text"
                                                class="item-normal"
                                                v-model="item.extend.description"
                                                :class="{'border-red': isCheck && !item.extend.description}"
                                            >
                                        </div>
                                        <div class="col align-self-center">
                                            <div
                                                class="dropdown"
                                                :title="item.after.coa.keyword"
                                            >
                                                <input
                                                    type="text"
                                                    name="coa name"
                                                    data-toggle="dropdown"
                                                    :class="{'border-red': isCheck && !item.after.coa.keyword}"
                                                    class="dropdown-toggle item-normal"
                                                    @input="searchCoa(item.after.coa.keyword, index)"
                                                    v-model="item.after.coa.keyword"
                                                >
                                                <span
                                                    class="input-loading"
                                                    v-if="item.after.coa.loading"
                                                ></span>
                                                <ul
                                                    class="dropdown-menu"
                                                    :class="'new-coa-'+index"
                                                >
                                                    <li
                                                        class="dropdown-menu-link"
                                                        v-for="(itemCoa, index1) in coa.list"
                                                        :key="'coa-'+index1"
                                                        @click="selectCoa(index, itemCoa)"
                                                    >{{itemCoa.coa.name}}</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="col align-self-center width-90">
                                            <span
                                                class="item-normal"
                                                v-if="!item.isEdit"
                                            >{{item.extend.debit ? item.extend.debit : '' | convertToCurrency}}</span>
                                            <input
                                                v-else
                                                type="text"
                                                class="item-normal"
                                                :class="{'border-red': isCheck && !item.extend.debit && !item.extend.credit}"
                                                v-model="item.extend.debit"
                                            >
                                        </div>
                                        <div class="col align-self-center width-90">
                                            <span
                                                class="item-normal"
                                                v-if="!item.isEdit"
                                            >{{item.extend.credit ? item.extend.credit : '' | convertToCurrency}}</span>
                                            <input
                                                v-else
                                                type="text"
                                                class="item-normal"
                                                v-model="item.extend.credit"
                                                :class="{'border-red': isCheck && !item.extend.debit && !item.extend.credit}"
                                            >
                                        </div>
                                        <div class="col align-self-center width-90">
                                            <span
                                                class="item-normal"
                                                :style="{color: item.isIncludeTax ? '#1c5df4' : ''}"
                                            >{{item.tax}}</span>
                                        </div>
                                        <div
                                            class="col align-self-center"
                                            :title="item.note"
                                        >
                                            <input
                                                type="text"
                                                name="note"
                                                class="item-normal"
                                                v-model="item.note"
                                            >
                                        </div>
                                        <div class="col align-self-center width-90 eviden">

                                        </div>
                                        <div class="col align-self-center text-right width-90 action">
                                            <div class="dropdown">
                                                <a
                                                    class="item-option dropdown-toggle edit"
                                                    data-toggle="dropdown"
                                                >
                                                    ...
                                                </a>
                                                <ul
                                                    class="dropdown-menu"
                                                    style="opacity:1"
                                                >
                                                    <li><a
                                                            class="option-item"
                                                            @click="handleEdit(index)"
                                                        >Edit</a></li>
                                                    <li
                                                        v-if="item.haveTax"
                                                        :for="'id-tax-'+index"
                                                    ><label
                                                            style="margin-bottom:0"
                                                            class="option-item"
                                                        >tax inclusive
                                                            <input
                                                                @click="changeTax(index, item)"
                                                                type="checkbox"
                                                                v-model="item.isIncludeTax"
                                                                :id="'id-tax-'+index"
                                                                style="float: right;"
                                                            />
                                                        </label></li>
                                                    <li v-if="$store.state.userAuth && $store.state.userAuth.permission.role.code === role.SuperAdmin"><a
                                                            class="option-item"
                                                            @click="deleteGeneralJournalItem(index, item._id)"
                                                        >Delete</a></li>
                                                </ul>
                                            </div>
                                            <button
                                                class="btn-normal grey save"
                                                @click="cancelAction(index, item)"
                                            >CANCEL</button>
                                            <button
                                                class="btn-normal grey save"
                                                @click="handleSave(index, item)"
                                            >SAVE</button>
                                        </div>
                                    </div>
                                    <div class="col-md-12 col-sm-12 col-xs-12">
                                        <div class="paginate">
                                            <client-only>
                                                <pagination
                                                    id="team-pagination"
                                                    :page="page"
                                                    :limit="limit"
                                                    :total="total"
                                                    @change="changePage"
                                                />
                                            </client-only>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    class="box-item pdr-15"
                                    v-if="list.length === 0"
                                >
                                    <div class="row row-item">
                                        <div class="col-12 align-self-center">
                                            <div class="no-data text-center">
                                                <img
                                                    src="~/assets/images/no-data.png"
                                                    alt="no data"
                                                >
                                                <p class="text-note">Please select option.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="box">
                                <div class="row mb-15">
                                    <div class="col-md-6">
                                        <h3 class="gj-title">MEMO</h3>
                                    </div>
                                    <div class="col-md-6 text-right">
                                        <div
                                            class="dropdown normal-btn"
                                            v-show="idGj !== 'create-gj'"
                                        >
                                            <a
                                                class="btn dropdown-toggle not-arrow"
                                                @click="saveMemo()"
                                            >
                                                Save
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div class="row mb-10 ">
                                    <div class="col-md-12">
                                        <textarea
                                            type="textarea"
                                            class="item-normal memo"
                                            v-model="memo"
                                        />
                                        </div>
                                </div>
                            </div>
                            <div class="box">
                                <div class="row mb-10 ">
                                    <div class="col-md-6"><span class="gj-label">Total Debit:</span></div>
                                    <div class="col-md-6 text-right"><span class="gj-value">{{summary.totalDebit | convertToCurrency}}</span></div>
                                    <div class="stroke"></div>
                                </div>
                                <div class="row mb-10">
                                    <div class="col-md-6"><span class="gj-label">Total Credit:</span></div>
                                    <div class="col-md-6 text-right"><span class="gj-value">{{summary.totalCredit | convertToCurrency}}</span></div>
                                </div>
                                <div class="row mb-10">
                                    <div class="col-md-6"><span class="gj-label">Tax</span></div>
                                    <div class="col-md-6 text-right"><span class="gj-value" :class="{disable: summary.status}">{{(summary.taxDebit - summary.taxCredit) | convertToCurrency}}</span></div>
                                    <div class="stroke"></div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6"><span class="gj-label">Out of Balance:</span></div>
                                    <div class="col-md-6 text-right"><span class="gj-value">{{summary.balance | convertToCurrency}}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <popup-confirm id="confirm-delete" ref="confirm_delete" description='Do you really want to delete these records? This process cannot be undone.' @success ="handlerDelete"/>
        </section>
    </div>
</template>

<script>
import VerticalMenu from '~/components/Report/VerticalMenu';
import PageTitle from '~/components/PageTitle';
import Pagination from '~/components/Pagination';
import PopupConfirm from '~/components/PopupConfirm';
import {convertFinancial} from '~/helpers/dateHelper';
import {mapUrlGoogleStorage, convertToCurrency} from '~/helpers/dataHelper';
import {GstType, CrunchType, RoleCode} from '~/common/commonType';

export default {
    data() {
        return {
            titles: ['Financial Report', 'General Journal'],
            list: [],
            isEdit: false,
            page: 1,
            limit: 100,
            total: 0,
            idGj: '',
            userId: '',
            year: '',
            code: '',
            coa: {
                isLoad: true,
                list: [],
                page: 1,
                limit: 20,
                total: null,
                timeout: null,
            },
            transaction: {
                list: []
            },
            isCheck: false,
            GstType: GstType,
            crunchType: CrunchType,
            summary: {
                totalDebit: 0,
                totalCredit: 0,
                taxDebit: 0,
                taxCredit: 0,
                tax: 0,
                balance: 0,
                status: true
            },
            params: null,
            memo: '',
            monthSelect: new Date().getMonth() + 1,
            timeout: null,
            roles: RoleCode,
            monthCreate: null,
            yearCreate: null,
            beginMonth: null,
            beginYear: null,
            endMonth: null,
            endYear: null,
            productCode: null,
            updateGJ: false
        };
    },
    components: {
        VerticalMenu,
        PageTitle,
        Pagination,
        PopupConfirm
    },
    async created() {
        let storage = localStorage.params && JSON.parse(localStorage.params);
        let year;
        let client;
        let product;
        if (storage && storage.length) {
            year = storage.find(item => item.name === 'beginYear');
            client = storage.find(item => item.name === 'clientId');
            product = storage.find(item => item.name === 'productCode');
            this.beginMonth = storage.find(item => item.name === 'beginMonth') && storage.find(item => item.name === 'beginMonth').value;
            this.beginYear = storage.find(item => item.name === 'beginYear') && storage.find(item => item.name === 'beginYear').value;
            this.endMonth = storage.find(item => item.name === 'endMonth') && storage.find(item => item.name === 'endMonth').value;
            this.endYear = storage.find(item => item.name === 'endYear') && storage.find(item => item.name === 'endYear').value;
            this.productCode = storage.find(item => item.name === 'productCode') && storage.find(item => item.name === 'productCode').value;
        }
        this.params = {year: year ? year.value : '', client: client ? client.value : '', product: product ? product.value : ''};

        this.role = RoleCode;
        this.idGj = this.$route.params.id;
        this.userId = this.$route.query.clientId || this.params.client;
        this.year = this.$route.query.beginYear || this.params.year;
        this.code = this.$route.query.code || (localStorage.gJitemtitle ? localStorage.gJitemtitle : '');
        this.memo = localStorage.gJitemnote ? localStorage.gJitemnote : this.$route.query.nemo;
        this.monthCreate = this.monthSelect;
        this.yearCreate = this.year;

        await this.getGJ();
    },
    methods: {
        handleEdit(index) {
            $(`#rowId${index}`).addClass('edit');
            this.list[index].isEdit = true;
            this.$forceUpdate();
        },
        async handleSave(index, item) {
            this.isCheck = true;
            if (!this.monthSelect)
                this.$notify({
                    type: 'error',
                    title: 'Failed',
                    text: 'Please select month.'
                });
            if (!item.transactionId && item.type !== 2)
                this.$notify({
                    type: 'error',
                    title: 'Failed',
                    text: 'Please select transaction.'
                });
            if (!item.extend.description && item.type !== 1)
                this.$notify({
                    type: 'error',
                    title: 'Failed',
                    text: 'Please enter transaction.'
                });
            if (!item.after.coa.coa && !(item.after.coa.keyword && (item.after.coa.keyword === 'Sale Income' || item.after.coa.keyword === 'Drawing' || item.after.coa.keyword === 'Other')))
                this.$notify({
                    type: 'error',
                    title: 'Failed',
                    text: 'Please select COA.'
                });
            if (!item.extend.debit && !item.extend.credit && !item.extend.amount)
                this.$notify({
                    type: 'error',
                    title: 'Failed',
                    text: 'Please enter amount.'
                });
            if (!this.monthSelect || (!item.transactionId && item.type !== 2) || (!item.after.coa.coa && !(item.after.coa.keyword && (item.after.coa.keyword === 'Sale Income' || item.after.coa.keyword === 'Drawing' || item.after.coa.keyword === 'Other'))) || (!item.extend.debit && !item.extend.credit && !item.extend.amount) || (!item.extend.description && item.type !== 1))
                return false;

            let dataCreate = {};
            dataCreate.gjId = this.idGj !== 'create-gj' ? this.idGj : undefined;
            dataCreate.userId = this.userId;
            dataCreate.year = this.monthSelect < 7 ? +this.year + 1 : this.year;
            dataCreate.month = this.monthSelect;
            if (item.type !== 2)
                dataCreate.before = {coaId: item.before.coaId._id, typeCrunch: item.before.crunchType};
            dataCreate.after = {coaId: (item.after.coa.coa && item.after.coa.coa._id) ? item.after.coa.coa._id : '', typeCrunch: item.after.crunchType, name: item.after.coa.keyword};
            dataCreate.type = item.type;
            dataCreate.transactionId = item.type === 1 ? item.transactionId : undefined;
            // dataCreate.coaId = item.after.coa.coa._id;
            dataCreate.note = item.note;
            dataCreate.isIncludeTax = item.isIncludeTax;

            if (item.type !== 1) {
                dataCreate.extend = item.extend;
                dataCreate.extend.amount = dataCreate.extend.credit ? dataCreate.extend.credit : dataCreate.extend.debit;
                dataCreate.extend.isCredit = !!dataCreate.extend.credit;
            }

            $(`#rowId${index}`).removeClass('edit');
            this.list[index].isEdit = false;

            let result = {};

            if (item._id)
                result = await this.$services.generalJournalService.updateGeneralJournalItem(item._id, dataCreate);
            else if (this.idGj && this.idGj !== 'create-gj') result = await this.$services.generalJournalService.createGeneralJournalItem(dataCreate);
            else {
                this.summary.totalDebit = 0;
                this.summary.totalCredit = 0;
                this.summary.taxDebit = 0;
                this.summary.taxCredit = 0;
                this.summary.tax = 0;
                this.summary.balance = 0;
                this.summary.status = true;
                this.list.forEach(item => {
                    if (item.tax !== 'N-T' && item.tax !== 'FRE' && !item.isIncludeTax) this.summary.status = false;
                });
                this.list.map(item => {
                    if (item.type !== 1) {
                        // this.summary.totalDebit += item.extend.debit ? (item.isIncludeTax ? +item.extend.debit / 1.1 : +item.extend.debit) : 0;
                        // this.summary.totalCredit += item.extend.credit ? (item.isIncludeTax ? +item.extend.credit / 1.1 : +item.extend.credit) : 0;
                        // this.summary.tax += item.isIncludeTax ? (item.extend.debit ? +item.extend.debit / 11 : +item.extend.credit / 11) : 0;

                        this.summary.totalDebit += item.extend.debit ? +item.extend.debit : 0;
                        this.summary.totalCredit += item.extend.credit ? +item.extend.credit : 0;
                        if (item.extend.debit)
                            this.summary.taxDebit += (item.tax !== 'N-T' && item.tax !== 'FRE') ? (this.summary.status ? +item.extend.debit / 11 : +item.extend.debit / 10) : 0;
                        else this.summary.taxCredit += (item.tax !== 'N-T' && item.tax !== 'FRE') ? (this.summary.status ? +item.extend.credit / 11 : +item.extend.credit / 10) : 0;
                    }
                    else {
                        if (item.transaction.baseType === 'DEBIT') {
                            this.summary.totalDebit += item.extend.amount ? +item.extend.amount : 0;
                            this.summary.taxDebit += (item.tax !== 'N-T' && item.tax !== 'FRE') ? (this.summary.status ? +item.extend.amount / 11 : +item.extend.amount / 10) : 0;
                        }
                        else {
                            this.summary.totalCredit += item.extend.amount ? +item.extend.amount : 0;
                            this.summary.taxCredit += (item.tax !== 'N-T' && item.tax !== 'FRE') ? (this.summary.status ? +item.extend.amount / 11 : +item.extend.amount / 10) : 0;
                        }
                    }
                });

                if (!this.summary.status)
                    this.summary.balance = this.summary.totalDebit - this.summary.totalCredit + this.summary.taxDebit - this.summary.taxCredit;
                else this.summary.balance = this.summary.totalDebit - this.summary.totalCredit;
            }
            if (result.data) {
                this.$notify({
                    type: 'success',
                    title: 'Save success',
                    text: 'Thank you'
                });
                await this.getGJ();
            }
            this.isCheck = false;
        },
        changePage(page) {
            this.page = page;
            this.getGJ();
        },
        async selectMonth(month, year) {
            this.monthSelect = month;
            this.monthCreate = month;
            this.yearCreate = year;
            if (this.idGj !== 'create-gj')
                this.updateGJ = true;
        },
        async updateGJDate(month, year) {
            if (this.idGj !== 'create-gj') {
                let dataUpdate = {
                    month: this.monthCreate,
                    year: this.yearCreate
                };
                let {data, error} = await this.$services.generalJournalService.updateDateGJ(this.idGj, dataUpdate);
                if (error) {
                    this.$notify({
                        type: 'error',
                        title: 'Some thing went wrong!',
                        text: 'Please check your API or Data'
                    });
                }
                if (data) {
                    this.updateGJ = false;
                    this.getGJ();
                    this.$notify({
                        type: 'success',
                        title: 'Update success',
                        text: 'Please check your data'
                    });
                }
            }
            this.monthSelect = month;
        },
        async getGeneralJournalItem() {
            this.summary.totalDebit = 0;
            this.summary.totalCredit = 0;
            this.summary.taxDebit = 0;
            this.summary.taxCredit = 0;
            this.summary.tax = 0;
            this.summary.balance = 0;
            this.summary.status = true;
            let {data} = await this.$services.generalJournalService.getGeneralJournalItem(this.idGj, this.page, this.limit);
            if (data) {
                data.forEach(item => {
                    if (item.after.coaId && item.after.coaId.name) {
                        if ((item.after.coaId.gstType === this.GstType.GST || item.after.coaId.gstType === this.GstType.CAP) && !item.isIncludeTax)
                            this.summary.status = false;
                    }
                    else {
                        if ((item.after.name && item.after.name === 'Sale Income') && !item.isIncludeTax) {
                            this.summary.status = false;
                        }
                    }
                });
                data.map(item => {
                    if (item.after.coa)
                        item.after.coa.keyword = '';
                    else {
                        if (item.after.coaId && item.after.coaId.name) {
                            item.after.coa = {
                                keyword: item.after.coaId.name,
                                coa: {
                                    _id: item.after.coaId._id
                                }
                            };
                            item.tax = item.after.coaId.gstType === this.GstType.NotReporTable ? 'N-T' : item.after.coaId.gstType === this.GstType.GSTFree ? 'FRE' : item.after.coaId.gstType === this.GstType.GST ? 'GST' : item.after.coaId.gstType === this.GstType.CAP ? 'CAP' : '';
                            item.haveTax = !((item.after.coaId.gstType === this.GstType.NotReporTable || item.after.coaId.gstType === this.GstType.GSTFree));
                        }
                        else {
                            item.after.coa = {
                                keyword: item.after.name ? item.after.name : '',
                            };
                            if (item.after.name && item.after.name === 'Sale Income') {
                                item.tax = 'GST';
                                item.haveTax = true;
                            }
                            if (item.after.name && item.after.name !== 'Sale Income') {
                                item.tax = 'N-T';
                                item.haveTax = false;
                            }
                        }
                    }

                    if (item.transaction)
                        item.transaction.keyword = '';
                    else {
                        if (item.transactionId && item.transactionId.description)
                            item.transaction = {
                                keyword: item.transactionId.description.original,
                                baseType: item.transactionId.baseType
                            };
                        else item.transaction = {
                            keyword: ''
                        };
                    }

                    if (!item.extend) {
                        item.extend = {};
                        if (item.transactionId)
                            item.extend.amount = item.transactionId.amount.amount;
                    }
                    else {
                        if (item.extend.isCredit)
                            item.extend.credit = item.extend.amount;
                        else item.extend.debit = item.extend.amount;
                    }

                    if (item.type !== 1) {
                        this.summary.totalDebit += item.extend.debit ? +item.extend.debit : 0;
                        this.summary.totalCredit += item.extend.credit ? +item.extend.credit : 0;
                        if (item.extend.debit)
                            this.summary.taxDebit += (item.tax !== 'N-T' && item.tax !== 'FRE') ? (this.summary.status ? +item.extend.debit / 11 : +item.extend.debit / 10) : 0;
                        else this.summary.taxCredit += (item.tax !== 'N-T' && item.tax !== 'FRE') ? (this.summary.status ? +item.extend.credit / 11 : +item.extend.credit / 10) : 0;
                    }
                    else {
                        if (item.transaction.baseType === 'DEBIT') {
                            this.summary.totalDebit += item.extend.amount ? +item.extend.amount : 0;
                            this.summary.taxDebit += (item.tax !== 'N-T' && item.tax !== 'FRE') ? (this.summary.status ? +item.extend.amount / 11 : +item.extend.amount / 10) : 0;
                        }
                        else {
                            this.summary.totalCredit += item.extend.amount ? +item.extend.amount : 0;
                            this.summary.taxCredit += (item.tax !== 'N-T' && item.tax !== 'FRE') ? (this.summary.status ? +item.extend.amount / 11 : +item.extend.amount / 10) : 0;
                        }
                    }
                });

                if (!this.summary.status)
                    this.summary.balance = this.summary.totalDebit - this.summary.totalCredit + this.summary.taxDebit - this.summary.taxCredit;
                else this.summary.balance = this.summary.totalDebit - this.summary.totalCredit;
                this.list = data;
                this.monthSelect = this.list.length ? this.list[0].month : 6;
            }
        },
        async getGeneralJournalItemTotal() {
            let {data} = await this.$services.generalJournalService.getGeneralJournalItemTotal(this.idGj);
            if (data) {
                this.total = data;
            }
        },
        searchCoa(keyword, index) {
            this.list[index].after.coa.loading = true;

            clearTimeout(this.timeout);
            this.timeout = setTimeout(async () => {
                await this.getChartAccount(keyword);
                await this.countChartAccount(keyword);

                $(`.adj-coa-` + index).addClass('show');
                $(`.new-coa-` + index).addClass('show');
                this.list[index].after.coa.loading = false;
                this.$forceUpdate();
            }, 600);
        },
        searchTransition(keyword, index) {
            this.list[index].transaction.loading = true;
            let timeout;
            clearTimeout(timeout);
            timeout = setTimeout(async () => {
                let {data} = await this.$services.transactionService.getTransactionByName(this.userId, this.monthSelect, this.monthSelect < 7 ? +this.year + 1 : +this.year, keyword);
                if (data) {
                    this.transaction.list = data;
                }
                $(`.adj-trans-` + index).addClass('show');
                $(`.new-trans-` + index).addClass('show');
                this.list[index].transaction.loading = false;
            }, 300);
        },
        selectCoa(index, coa) {
            this.list[index].after.coa = coa;
            this.list[index].after.coa.keyword = coa.coa.name;
            this.list[index].tax = coa.coa.gstType === this.GstType.NotReporTable ? 'N-T' : coa.coa.gstType === this.GstType.GSTFree ? 'FRE' : coa.coa.gstType === this.GstType.GST ? 'GST' : coa.coa.gstType === this.GstType.CAP ? 'CAP' : '';
            this.list[index].after.crunchType = coa.crunchType ? coa.crunchType : this.crunchType.Expenses;
            this.list[index].haveTax = !((coa.coa.gstType === this.GstType.NotReporTable || coa.coa.gstType === this.GstType.GSTFree));
            this.list[index].isIncludeTax = !!((coa.coa.gstType === this.GstType.GST || coa.coa.gstType === this.GstType.CAP));

            $(`.adj-coa-` + index).removeClass('show');
            $(`.new-coa-` + index).removeClass('show');
        },
        selectTrans(index, itemTrans) {
            this.list[index].transaction = itemTrans;
            this.list[index].transaction.keyword = itemTrans.description.original;
            this.list[index].transactionId = itemTrans._id;
            this.list[index].before.coaId = itemTrans.coaId;

            if (this.list[index].type !== 2)
                this.list[index].extend.amount = itemTrans.amount.amount;

            $(`.adj-trans-` + index).removeClass('show');
            $(`.new-trans-` + index).removeClass('show');
        },
        async getGJ() {
            this.$setLoading();
            await this.getGeneralJournalItem();
            await this.getGeneralJournalItemTotal();
            this.$setLoading(false);
        },
        async getChartAccount(keyword) {
            if (!this.coa.isLoad)
                return;
            this.coa.isLoad = false;

            let {data} = await this.$services.chartAccountService.search(keyword, this.coa.page, this.coa.limit);
            if (data && data.length) {
                this.coa.list = data;
                let found = data.findIndex(item => {
                    return item.coa.name === 'Sales Income';
                });
                if (found > 0)
                    data[found].crunchType = this.crunchType.Income;
                let coaPlus = [
                    {coa: {name: 'Drawing', gstType: this.GstType.NotReporTable}, crunchType: this.crunchType.Drawings},
                    {coa: {name: 'Other', gstType: this.GstType.NotReporTable}, crunchType: this.crunchType.Other}];
                this.coa.list = [...this.coa.list, ...coaPlus];
            }

            this.coa.isLoad = true;
        },
        async countChartAccount(keyword) {
            let {data} = await this.$services.chartAccountService.getCountSearch(keyword);
            if (data) {
                this.coa.total = data;
            }
        },
        createItem(type) {
            this.isCheck = false;
            if (type === 'adjTrans')
                this.list.push({_id: '', month: '', transaction: {keyword: '', loading: false}, transactionId: '', before: {}, after: {coa: {keyword: '', loading: false}, crunchType: 0}, note: '', evidenced: '', upload: {}, type: 1, extend: {amount: 0}, isEdit: false, tax: '', isIncludeTax: false, haveTax: true});
            else this.list.push({_id: '', month: '', transaction: {keyword: '', loading: false}, transactionId: '', before: {}, after: {coa: {keyword: '', loading: false}, crunchType: 0}, note: '', evidenced: '', upload: {}, type: 2, extend: {debit: 0, credit: 0, description: '', isCredit: false}, isEdit: false, tax: '', isIncludeTax: false, haveTax: true});
            let idx = this.list.length - 1;
            setTimeout(() => {
                $(`#rowId${idx}`).addClass('edit');
                this.list[this.list.length - 1].isEdit = true;
            }, 200);
        },
        async upload(event, index) {
            let formData = new FormData();
            let file = event.target ? event.target.files[0] : event[0];
            formData.append('fileobject', file);
            this.list[index].upload = formData;
            await this.uploadEvidenced(this.list[index]._id, index);
        },
        async uploadEvidenced(id, index) {
            let file = this.list[index].upload;
            if (!file) return false;
            let {data} = await this.$services.generalJournalService.updateEvidenced(id, file);
            if (data)
                this.$notify({
                    type: 'success',
                    title: 'Upload success',
                    text: 'Thank you'
                });
            this.getGJ();
        },
        async deleteGeneralJournalItem(index, id) {
            this.$refs.confirm_delete.open({index: index, id: id});
        },
        async handlerDelete({index, id}) {
            if (!id) {
                this.list.splice(index, 1);
                return false;
            }
            let {data} = await this.$services.generalJournalService.deleteGeneralJournalItem(id);
            if (data) {
                this.$notify({
                    type: 'success',
                    title: 'Delete success',
                    text: 'Thank you'
                });
                this.getGJ();
            }
        },
        getIconFile(file) {
            if (file.includes('.csv'))
                return '/images/csv-icon.png';
            else if (file.includes('.doc') || file.includes('.docx'))
                return '/images/doc-file-format-symbol-black.svg';
            else if (file.includes('.xls') || file.includes('.xlsx'))
                return '/images/xls-file-format-symbol-black.svg';
            else if (file.includes('.pdf'))
                return '/images/pdf-file-format-symbol-black.svg';
            else return mapUrlGoogleStorage(file);
        },
        cancelAction(index, item) {
            if (!item._id)
                this.list.splice(index, 1);
            else {
                this.list[index].isEdit = false;
                this.$forceUpdate();

                $(`#rowId${index}`).removeClass('edit');
            }
        },
        async saveMemo() {
            let result = await this.$services.generalJournalService.updateGeneralJournalNote(this.idGj, {note: this.memo});
            if (result.data) {
                localStorage.gJitemnote = this.memo;
                this.$notify({
                    type: 'success',
                    title: 'Update success',
                    text: 'Thank you'
                });
            }
        },
        async saveAll() {
            if (this.summary.balance !== 0) {
                this.$notify({
                    type: 'error',
                    title: 'Failed',
                    text: 'Out of Balance must equal 0.'
                });
                return false;
            }
            if (!this.monthSelect) {
                this.$notify({
                    type: 'error',
                    title: 'Failed',
                    text: 'Please select month.'
                });
                return false;
            }
            if (!this.list.length) {
                this.$notify({
                    type: 'error',
                    title: 'Failed',
                    text: 'No data.'
                });
                return false;
            }

            this.$setLoading();

            this.isCheck = true;
            let dataCreate = {};
            let confirm = true;
            dataCreate.userId = this.userId;
            dataCreate.month = this.monthCreate;
            dataCreate.year = this.yearCreate;
            dataCreate.beginYear = this.beginYear;
            dataCreate.note = this.memo;
            dataCreate.items = [];

            this.list.forEach(item => {
                if (!this.monthSelect)
                    this.$notify({
                        type: 'error',
                        title: 'Failed',
                        text: 'Please select month.'
                    });
                if (!item.transactionId && item.type !== 2)
                    this.$notify({
                        type: 'error',
                        title: 'Failed',
                        text: 'Please select transaction.'
                    });
                if (!item.after.coa.coa && !(item.after.coa.keyword && (item.after.coa.keyword === 'Sale Income' || item.after.coa.keyword === 'Drawing' || item.after.coa.keyword === 'Other')))
                    this.$notify({
                        type: 'error',
                        title: 'Failed',
                        text: 'Please select COA.'
                    });
                if (!item.extend.description && item.type !== 1)
                    this.$notify({
                        type: 'error',
                        title: 'Failed',
                        text: 'Please enter transaction.'
                    });
                if (!item.extend.debit && !item.extend.credit && !item.extend.amount)
                    this.$notify({
                        type: 'error',
                        title: 'Failed',
                        text: 'Please enter amount.'
                    });
                if (!this.monthSelect || (!item.transactionId && item.type !== 2) || (!item.after.coa.coa && !(item.after.coa.keyword && (item.after.coa.keyword === 'Sale Income' || item.after.coa.keyword === 'Drawing' || item.after.coa.keyword === 'Other'))) || (!item.extend.debit && !item.extend.credit && !item.extend.amount) || (!item.extend.description && item.type !== 1)) {
                    confirm = false;
                    return false;
                }

                let itemx = {};
                itemx.month = this.monthSelect;
                itemx.year = this.monthSelect < 7 ? +this.year + 1 : this.year;
                // itemx.coaId = item.after.coa.coa._id;
                if (item.type !== 2)
                    itemx.before = {coaId: item.before.coaId._id, typeCrunch: item.before.crunchType};
                itemx.after = {coaId: item.after.coa.coa._id ? item.after.coa.coa._id : '', typeCrunch: item.after.crunchType, name: item.after.coa.keyword};
                itemx.type = item.type;
                itemx.transactionId = item.transactionId;
                itemx.note = item.note;
                itemx.isIncludeTax = item.isIncludeTax;
                if (item.type !== 1) {
                    let extend = {};
                    extend.amount = item.extend.debit ? item.extend.debit : item.extend.credit;
                    extend.isCredit = !item.extend.debit;
                    extend.description = item.extend.description;
                    itemx.extend = extend;
                    itemx.transactionId = undefined;
                }
                dataCreate.items.push(itemx);
            });
            this.$setLoading(false);

            if (confirm) {
                let {data} = await this.$services.generalJournalService.createGeneralJournal(dataCreate);
                if (data) {
                    this.$notify({
                        type: 'success',
                        title: 'Create success',
                        text: 'Thank you'
                    });
                    this.$router.push(`/financial-report/general-journal?productCode=${this.productCode}&clientId=${this.userId}&beginMonth=${this.beginMonth}&beginYear=${this.beginYear}&endMonth=${this.endMonth}&endYear=${this.endYear}`);
                }
            }
        },
        changeTax(index, item) {
            let timeout;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                this.handleSave(index, item);
            }, 300);
        }
    },
    filters: {
        convertFinancial(month, year) {
            return convertFinancial(month, year);
        },
        mapUrlGoogleStorage(url) {
            return mapUrlGoogleStorage(url);
        },
        convertToCurrency(value) {
            return convertToCurrency(+value);
        }
    }
};
</script>
