<template>
    <div
        :id="id"
        class="upload-request modal fade show"
    >
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">MAGIC LINK</h3>
                    <button
                        onClick={this.closeModal}
                        type="button"
                        class="close"
                        @click="close"
                        aria-label="Close"
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <ul
                        class="nav mb-4"
                        id="pills-tab"
                        role="tablist"
                    >
                        <li class="nav-item">
                            <a
                                class="tab"
                                :class="{active: tab == 1}"
                                id="pills-home-tab"
                                data-toggle="pill"
                                href="#pills-home"
                                role="tab"
                                aria-controls="pills-home"
                                aria-selected="true"
                                @click="changeTab(1)"
                            >UPLOAD REQUEST</a>
                        </li>
                        <li class="nav-item">
                            <a
                                class="tab"
                                :class="{active: tab == 2}"
                                id="pills-profile-tab"
                                data-toggle="pill"
                                href="#pills-profile"
                                role="tab"
                                aria-controls="pills-profile"
                                aria-selected="false"
                                @click="listMagicLinks"
                            >SENDING LIST</a>
                        </li>
                    </ul>
                    <div id="pills-tabContent">
                        <div v-if="tab === 1">
                            <div class="form-group">
                                <label class="form-label">Subject</label>
                                <input
                                    type="text"
                                    v-model="subject"
                                    placeholder="Enter subject"
                                    class="form-control form-input"
                                />
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="form-label">Client's name</label>
                                        <input
                                            type="text"
                                            v-model="name"
                                            placeholder="Enter client's name"
                                            class="form-control form-input"
                                        />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="form-label">Client's email</label>
                                        <input
                                            type="text"
                                            v-model="email"
                                            placeholder="Enter client's email"
                                            class="form-control form-input"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Content</label>
                                <textarea
                                    type="text"
                                    v-model="content"
                                    placeholder="Enter your content"
                                    class="form-control form-input"
                                    style="min-height:70px"
                                />
                                </div>
              <div class="form-group option-date d-flex align-items-center">
                <span class="txt-grey mr-2">Expiration Date:</span>
                <div>
                  <client-only>
                    <date-picker
                      class="input-date"
                      v-model="date"
                      :config="options"
                      :id="'date-picker'"
                    />
                  </client-only>
                </div>
              </div>

              <div class="form-group">
                <label class="text-uppercase form-label">select system</label>
                <div class="d-flex flex-wrap">
                  <button
                    class="btn mr-4"
                    :class="{outline: system !== 'FR'}"
                    @click="changeSystem('FR')"
                  >Fast Rabbit</button>
                  <button
                    class="btn mr-4"
                    :class="{outline: system !== 'MPP'}"
                    @click="changeSystem('MPP')"
                  >MPP</button>
                  <button
                    class="btn"
                    :class="{outline: system !== 'YBA'}"
                    @click="changeSystem('YBA')"
                  >YBA</button>
                </div>
              </div>
              <div class="group-btn text-right d-flex justify-content-end">
                <div class="mr-2">
                  <button class="btn form-btn white border-btn mr-10" @click="close">Cancel</button>
                </div>
                <div>
                  <button class="btn form-btn border-btn" @click="submitRequest">Create</button>
                </div>
              </div>
            </div>
            <div
            class="link-list list"
              v-else
            >
              <table class="table">
                <thead>
                  <tr>
                    <td>Email</td>
                    <td>Expiration date</td>
                    <td>Status</td>
                    <td>Actions</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="link in sendingList" :key="link._id" class="item">
                    <td>
                      <div class="name">{{link.name || name}}</div>
                      <div class="email">{{link.emailTo || email}}</div>
                    </td>
                    <td>
                      {{moment(link.expiredAt).format('DD/MM/YYYY [(]hh:mm A[)]')}}
                    </td>
                    <td v-if="moment(link.expiredAt) > moment()" class="sent">Sent</td>
                    <td v-else class="expired">Expired</td>
                    <td>
                      <button class="btn" @click="viewFile(link._id)">View file</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
export default {
    props: {
        id: {
            type: String,
            default: ''
        },
        folder: {
            type: Object,
            default: {
                name: '',
                email: ''
            }
        },
        uploadUser: {
            type: Object
        }
    },
    data() {
        return {
            date: null,
            options: {
                format: 'DD/MM/YYYY (H:mm)',
                useCurrent: false,
                focusOnShow: true,
                minDate: moment()
            },
            name: '',
            email: '',
            subject: '',
            content: '',
            system: 'FR',
            sendingList: [],
            tab: 1
        };
    },
    methods: {
        moment,
        open() {
            this.date = moment()
                .add(1, 'days')
                .format('DD/MM/YYYY (H:mm)');
            this.system = 'FR';
            this.name = this.uploadUser.name;
            this.email = this.uploadUser.email;
            this.tab = 1;
            this.sendingList = [];
            $('#' + this.id).modal({
                keyboard: false,
                backdrop: 'static',
                show: true
            });
        },
        close() {
            $('#' + this.id).modal('hide');
            this.content = '';
            this.system = '';
        },
        changeSystem(system) {
            this.system = system;
        },
        submitRequest() {
            if (
                !this.subject ||
                !this.name ||
                !this.email ||
                !this.content ||
                !this.date
            ) {
                this.$notify({
                    type: 'error',
                    title: 'Create failed',
                    text: 'Please enter full information.'
                });
                return false;
            }

            this.$emit('submit', {
                subject: this.subject,
                name: this.name,
                emailTo: this.email,
                content: this.content,
                expiredDate: this.date,
                system: this.system
            });
            this.close();
        },
        changeTab(tabIndex) {
            this.tab = tabIndex;
        },
        async listMagicLinks() {
            this.$setLoading();
            this.changeTab(2);
            this.sendingList = [];
            const {data = []} = await this.$services.fileManagementService.listMagicLinks(this.folderId);
            this.sendingList = data || [];
            this.$setLoading(false);
        },
        viewFile(magicLinkId) {
            this.close();
            this.$emit('listFilesByMagicLinkId', magicLinkId);
        }
    },
    watch: {
        folder() {
            this.subject = `FILE UPLOAD REQUEST - ${this.folder.name || ''}`;
        },
        uploadUser() {
            this.name = this.uploadUser.name;
            this.email = this.uploadUser.email;
        }
    },
    computed: {
        folderId() {
            const {folder = {}} = this;
            return folder.id || '';
        }
    }
};
</script>

<style scoped>
.link-list {
    max-height: 500px;
    overflow-x: hidden;
    overflow-y: auto;
}
</style>
