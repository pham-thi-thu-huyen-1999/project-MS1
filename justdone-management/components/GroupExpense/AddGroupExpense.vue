<template>
    <div class="modal fade box-popup expense" id="add-group-expense" role="dialog" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">   
                    <div class="form-group">
                        <div class="row">
                            <div class="col-6 pdr-5">
                                <label class="form-label">Group expense code</label>
                                <input type="text" class="form-control form-input error" placeholder="">
                                <span class="form-label-error">Group code already exists</span>
                            </div>
                            <div class="col-6 pdl-5">
                                <label class="form-label">Group expense name</label>
                                <input type="text" class="form-control form-input" placeholder="">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 two-btn text-center">
                            <button class="form-btn">create</button>
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

