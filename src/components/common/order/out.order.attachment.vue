<template>
  <div v-if="loadingData">
    <oms-loading :loading="loadingData"></oms-loading>
  </div>
  <div v-else="">
    <attachment-show :attachmentRight="attachmentRight" :currentOrder="currentOrder" :orderAttachment="accessory.followDocuments"
                     label="随货同行单" objectType="followDocument"
                     @refreshAttachment="queryAttachmentList"></attachment-show>

    <attachment-show :attachmentRight="{
        watch: 'erp-warehouse-temperature-watch',
        download: 'erp-warehouse-temperature-watch',
        upload: 'erp-order-document-upload',
        remove: 'erp-order-document-delete'
      }" :currentOrder="currentOrder"
                     :orderAttachment="accessory.transitTemperatureFroms"
                     label="在途温度"
                     objectType="transitTemperatureFrom"
                     @refreshAttachment="queryAttachmentList"></attachment-show>

    <div v-show="currentOrder.state === '7' ">
      <attachment-show :attachmentRight="attachmentRight" :currentOrder="currentOrder"
                       :isShowUpload="false"
                       :orderAttachment="accessory.cancelDocuments"
                       label="取消订单" @refreshAttachment="queryAttachmentList"></attachment-show>
    </div>

  </div>
</template>
<script>
import {http} from '@/resources';
import attachmentShow from './attachmentShow.vue';

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
      accessory: {
        followDocuments: [], // 随货同行单
        wayBills: [], // 运输单
        drugControlReports: [], // 药检报告
        batchReleases: [], // 批签发
        importCertificates: [], // 进口注册证
        customsPass: [], // 通关单
        transitTemperatureFroms: [], // 在途温度
        warehouseTemperatureFroms: [], // 在库温度
        others: [], // 其他
        cancelDocuments: []// 取消订单
      },
      attachmentRight: {// 附件管理权限
        watch: 'erp-order-document-watch',
        download: 'erp-order-document-watch',
        upload: 'erp-order-document-upload',
        remove: 'erp-order-document-delete'
      }
    };
  },
  watch: {
    index(val) {
      this.accessory = {
        followDocuments: [], // 随货同行单
        wayBills: [], // 运输单
        drugControlReports: [], // 药检报告
        batchReleases: [], // 批签发
        importCertificates: [], // 进口注册证
        customsPass: [], // 通关单
        transitTemperatureFroms: [], // 在途温度
        warehouseTemperatureFroms: [], // 在库温度
        others: [], // 其他
        cancelDocuments: []// 取消订单
      };
      if (val === 3) this.queryAttachmentList();
    }
  },
  methods: {
    queryAttachmentList: function () {// 附件管理
      if (!this.currentOrder.id) return;
      this.loadingData = true;
      http.get('/order-attachment/order/' + this.currentOrder.id).then(res => {
        this.accessory = res.data;
        this.loadingData = false;
      }).catch(() => {
        this.loadingData = false;
      });
    }
  }
};
</script>
