<template>
  <div class="box-content">
        <div class="section-bank connect-bank-small">
            <h3 class="box-center-title">Bank Accounts</h3>
            <connect-bank :editable="editable" :clientId="clientId" :accountType="1"></connect-bank> 
        </div>
        <div class="section-credit connect-bank-small">
            <h3 class="box-center-title">Credit Cards</h3>
            <connect-bank :editable="editable" :clientId="clientId" :accountType="2"></connect-bank>
            
        </div>
    </div>
</template>

<script>
import ConnectBank from '~/components/transaction/ConnectBank';

export default {
    props: {
        clientId: {
            type: String
        }
    },
    data() {
        return {
            editable: null
        };
    },
    created() {
        if (!this.clientId)
            this.editable = true;
        else this.editable = false;
    },
    components: {
        ConnectBank,
    },
};
</script>