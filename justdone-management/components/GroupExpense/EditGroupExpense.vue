<template>
    <div class="modal fade box-popup expense" id="edit-group-expense" role="dialog" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="form-group">
                        <div class="row">
                            <div class="col-6 pdr-5">
                                <label class="form-label">Group expense code</label>
                                <input type="text" class="form-control form-input" placeholder="">           
                            </div>
                            <div class="col-6 pdl-5">
                                <label class="form-label">Group expense name</label>
                                <input type="text" class="form-control form-input" placeholder="">
                            </div>
                        </div>
                    </div>
                    <hr>
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

