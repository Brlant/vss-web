<template>
  <div v-if="loadingData">
    <oms-loading :loading="loadingData"></oms-loading>
  </div>
  <div v-else="">
    <attachment-show :attachmentRight="attachmentRight" :currentOrder="currentOrder" :orderAttachment="attachmentList"
                     label="报损附件" objectType="breakageOrder"
                     @refreshAttachment="queryAttachmentList"></attachment-show>
  </div>
</template>
<script>
import {http} from '@/resources';
import attachmentShow from '@/components/common/order/attachmentShow.vue';

export default {
  components: {
    attachmentShow
  },
  props: {
    currentOrder: {
      required: true,
      type: Object,
      default: function () {
        return {};
      }
    },
    index: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      loadingData: true,
      attachmentList: [],
      attachmentRight: {// 附件管理权限
        watch: 'breakage-order-document-watch',
        download: 'breakage-order-document-watch',
        upload: 'breakage-order-document-upload',
        remove: 'breakage-order-document-upload'
      }
    };
  },
  watch: {
    index(val) {
      if (val === 3) this.queryAttachmentList();
    }
  },
  methods: {
    queryAttachmentList: function () {// 附件管理
      if (!this.currentOrder.id) return;
      this.loadingData = true;
      http.get('/omsAttachment/breakageOrder/' + this.currentOrder.id).then(res => {
        this.attachmentList = res.data;
        this.loadingData = false;
      }).catch(() => {
        this.loadingData = false;
      });
    }
  }
};
</script>
