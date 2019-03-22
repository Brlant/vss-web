<template>
  <div v-if="loadingData">
    <oms-loading :loading="loadingData"></oms-loading>
  </div>
  <div v-else="">
    <attachment-show label="随货同行单" :orderAttachment="accessory.followDocuments" :currentOrder="currentOrder"
                     objectType="followDocument" :attachmentRight="attachmentRight"
                     @refreshAttachment="queryAttachmentList"></attachment-show>

    <attachment-show label="运输单" :orderAttachment="accessory.wayBills" :currentOrder="currentOrder"
                     objectType="wayBill" :attachmentRight="attachmentRight"
                     @refreshAttachment="queryAttachmentList"></attachment-show>

    <attachment-show label="在途温度" :orderAttachment="accessory.transitTemperatureFroms"
                     :currentOrder="currentOrder"
                     objectType="transitTemperatureFrom"
                     :attachmentRight="attachmentRight"
                     @refreshAttachment="queryAttachmentList"></attachment-show>

    <attachment-show label="在库温度" :orderAttachment="accessory.warehouseTemperatureFroms"
                     :currentOrder="currentOrder"
                     objectType="warehouseTemperatureFrom"
                     :attachmentRight="attachmentRight"
                     @refreshAttachment="queryAttachmentList"></attachment-show>

    <div v-show="currentOrder.state === '7' ">
      <attachment-show label="取消订单" :orderAttachment="accessory.cancelDocuments"
                       :currentOrder="currentOrder"
                       :attachmentRight="attachmentRight"
                       @refreshAttachment="queryAttachmentList" :isShowUpload="false"></attachment-show>
    </div>

    <attachment-show label="其他" :orderAttachment="accessory.others"
                     :attachmentRight="attachmentRight"
                     :currentOrder="currentOrder"
                     objectType="other" @refreshAttachment="queryAttachmentList"></attachment-show>

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
          upload: '',
          remove: ''
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
        if (val === 5) this.queryAttachmentList();
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
