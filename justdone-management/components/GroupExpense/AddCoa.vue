<template>
    <div class="modal fade box-popup expense" id="add-coa" role="dialog" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="form-group">
                        <label class="form-label">Select chart of account</label>
                        <div class="box-select-coa">
                            <div class="dropdown-toggle" data-toggle="dropdown">
                                <input class="form-input search-coa" type="text" />
                                <i class="fa fa-search" aria-hidden="true"></i>
                            </div>
                            <ul class="dropdown-menu">
                                <li class="dropdown-menu-link">
                                    <span class="dropdown-link-title">Lab expense</span>
                                </li>
                                <li class="dropdown-menu-link">
                                    <span class="dropdown-link-title">Facility expense</span>
                                </li>
                                <li class="dropdown-menu-link">
                                    <span class="dropdown-link-title">Dental suppliese</span>
                                </li>
                                <li class="dropdown-menu-link">
                                    <span class="dropdown-link-title">Minor expenses</span>
                                </li>
                                <li class="dropdown-menu-link">
                                    <span class="dropdown-link-title">Dental suppliese</span>
                                </li>
                                <li class="dropdown-menu-link">
                                    <span class="dropdown-link-title">Minor expenses</span>
                                </li>
                            </ul>
                            <div class="list-coa-select">
                                <h5 class="group-name">Discretionary Expens</h5>
                                <ul class="list-coa">
                                    <li class="coa-item"><span class="coa-id">2-0300</span><span class="coa-name">Licences</span><span class="delete">Delete</span></li>
                                    <li class="coa-item"><span class="coa-id">2-0400</span><span class="coa-name">Membership Dues</span><span class="delete">Delete</span></li>
                                    <li class="coa-item"><span class="coa-id">2-0500</span><span class="coa-name">Office Supplies</span><span class="delete">Delete</span></li>
                                    <li class="coa-item"><span class="coa-id">2-0300</span><span class="coa-name">Licences</span><span class="delete">Delete</span></li>
                                    <li class="coa-item"><span class="coa-id">2-0400</span><span class="coa-name">Membership Dues</span><span class="delete">Delete</span></li>
                                    <li class="coa-item"><span class="coa-id">2-0500</span><span class="coa-name">Office Supplies</span><span class="delete">Delete</span></li>
                                    <li class="coa-item"><span class="coa-id">2-0300</span><span class="coa-name">Licences</span><span class="delete">Delete</span></li>
                                    <li class="coa-item"><span class="coa-id">2-0400</span><span class="coa-name">Membership Dues</span><span class="delete">Delete</span></li>
                                    <li class="coa-item"><span class="coa-id">2-0500</span><span class="coa-name">Office Supplies</span><span class="delete">Delete</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 two-btn text-center">
                            <button class="form-btn">Save</button>
                            <button class="form-btn grey" data-dismiss="modal">cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>  
</template>
<script>
export default {
    data() {
        return {

        };
    },
};
</script>

