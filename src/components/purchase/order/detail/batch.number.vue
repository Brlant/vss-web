<style lang="less" scoped="">
  .batch-number-upload {
    margin-left: 10px;
    border-right: 2px solid #eee;
  }
</style>
<template>
  <div>
    <div v-if="loadingData">
      <oms-loading :loading="loadingData"></oms-loading>
    </div>
    <div v-else-if="!batchNumbers.length" class="empty-info">
      无相关批号信息
    </div>
    <div v-if="batchNumbers.length">
      <div class="qp-box" v-for="(item,index) in batchNumbers" @click="currentItem = item">
        <h3>
          批号 {{index + 1}} -
          {{ item.no }}
        </h3>

        <el-row style="margin-bottom: 10px">
          <el-col :span="20">
            <el-row style="margin-bottom: 10px"
                    v-show="!isShow(item)">
              <perm label="batch-number-upload">
                <el-col :span="11" class="batch-number-upload">
                  <oms-upload-relation uploadName="选取药检报告附件"
                                       :formData="{objectId:item.batchNumberId,objectType:'batch'}"
                                       @change="changeDrugControlReportFiles"
                                       :showFileList="isShowFileList"></oms-upload-relation>
                </el-col>
                <el-col :span="11" class="batch-number-upload">
                  <oms-upload-relation uploadName="选取批签发附件" :formData="{objectId:item.batchNumberId,objectType:'batch'}"
                                       @change="changeBatchReleaseFiles"
                                       :showFileList="isShowFileList"></oms-upload-relation>
                </el-col>
              </perm>
            </el-row>
            <el-row style="margin-bottom: 10px" v-show="!isShow(item)">
              <perm label="batch-number-upload">
                <el-col :span="11" class="batch-number-upload">
                  <oms-upload-relation uploadName="选取进口注册证" :formData="{objectId:item.batchNumberId,objectType:'batch'}"
                                       @change="changeImportCertificatesFiles"
                                       :showFileList="isShowFileList"></oms-upload-relation>
                </el-col>
                <el-col :span="11" class="batch-number-upload">
                  <oms-upload-relation uploadName="选取通关单" :formData="{objectId:item.batchNumberId,objectType:'batch'}"
                                       @change="changeCustomsPassFiles"
                                       :showFileList="isShowFileList"></oms-upload-relation>
                </el-col>
              </perm>
            </el-row>
          </el-col>
          <el-col :span="2" v-show="!isShow(item)">
            <el-button type="primary" size="small" @click.prevent="onSubmit(item)">确认绑定</el-button>
          </el-col>
        </el-row>
        <div v-show="isShow(item)">
          <attachment-show label="药检报告" :orderAttachment="item.attachmentMap.drugControlReports"
                           :currentOrder="currentOrder"
                           objectType="" :objectId="item.batchNumberId"
                           :attachmentRight="attachmentRight"
                           :isShowUpload="false" @refreshAttachment="queryBatchNumbers"></attachment-show>

          <attachment-show label="批签发" :orderAttachment="item.attachmentMap.batchReleases" :currentOrder="currentOrder"
                           objectType="" :objectId="item.batchNumberId"
                           :attachmentRight="attachmentRight"
                           :isShowUpload="false" @refreshAttachment="queryBatchNumbers"></attachment-show>

          <attachment-show label="进口注册证" :orderAttachment="item.attachmentMap.importCertificates"
                           :currentOrder="currentOrder"
                           objectType="" :objectId="item.batchNumberId"
                           :attachmentRight="attachmentRight"
                           :isShowUpload="false" @refreshAttachment="queryBatchNumbers"></attachment-show>

          <attachment-show label="通关单" :orderAttachment="item.attachmentMap.customsPass" :currentOrder="currentOrder"
                           objectType="" :objectId="item.batchNumberId"
                           :attachmentRight="attachmentRight"
                           :isShowUpload="false" @refreshAttachment="queryBatchNumbers"></attachment-show>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
  import { http } from '@/resources';
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
    data () {
      return {
        loadingData: true,
        batchNumbers: [],
        attachmentRight: {// 附件管理权限
          watch: 'show',
          download: 'batch-number-download',
          upload: '',
          remove: ''
        },
        drugControlReport: {
          id: '',
          drugControlReportIds: []
        },
        batchReleases: {
          id: '',
          batchReleasesIds: []
        },
        importCertificates: {
          id: '',
          importCertificatesIds: []
        },
        customsPass: {
          id: '',
          customsPassIds: []
        },
        currentItem: {},
        isShowFileList: true
      };
    },
    watch: {
      index (val) {
        this.batchNumbers = [];
        if (val === 4) this.queryBatchNumbers();
      }
    },
    methods: {
      isShow (item) {
        return item.attachmentMap.drugControlReports.length || item.attachmentMap.batchReleases.length ||
          item.attachmentMap.importCertificates.length || item.attachmentMap.customsPass.length;
      },
      changeDrugControlReportFiles: function (fileList) {// 上传附件时，获取附加id
        let ids = [];
        fileList.forEach(file => {
          ids.push(file.attachmentId);
        });
        this.drugControlReport = Object.assign({}, {
          id: this.currentItem.id,
          drugControlReportIds: ids
        });
        this.isShowFileList = true;
      },
      changeBatchReleaseFiles: function (fileList) {// 上传附件时，获取附加id
        let ids = [];
        fileList.forEach(file => {
          ids.push(file.attachmentId);
        });
        this.batchReleases = Object.assign({}, {
          id: this.currentItem.id,
          batchReleasesIds: ids
        });
        this.isShowFileList = true;
      },
      changeImportCertificatesFiles: function (fileList) {// 上传附件时，获取附加id
        let ids = [];
        fileList.forEach(file => {
          ids.push(file.attachmentId);
        });
        this.importCertificates = Object.assign({}, {
          id: this.currentItem.id,
          importCertificatesIds: ids
        });
        this.isShowFileList = true;
      },
      changeCustomsPassFiles: function (fileList) {// 上传附件时，获取附加id
        let ids = [];
        fileList.forEach(file => {
          ids.push(file.attachmentId);
        });
        this.customsPass = Object.assign({}, {
          id: this.currentItem.id,
          customsPassIds: ids
        });
        this.isShowFileList = true;
      },
      queryBatchNumbers () {// 查询
        if (!this.currentOrder.id) return;
        http.get('/receipt/order/' + this.currentOrder.id).then(res => {
          this.batchNumbers = res.data;
          this.loadingData = false;
        });
      },
      onSubmit: function (item) {
        let batchReleases = [];
        let drugControlReports = [];
        let importCertificates = [];
        let customsPass = [];
        if (item.id === this.drugControlReport.id) {
          drugControlReports = this.drugControlReport.drugControlReportIds;
        }
        if (item.id === this.batchReleases.id) {
          batchReleases = this.batchReleases.batchReleasesIds;
        }
        if (item.id === this.importCertificates.id) {
          importCertificates = this.importCertificates.importCertificatesIds;
        }
        if (item.id === this.customsPass.id) {
          customsPass = this.customsPass.customsPassIds;
        }
        if (!batchReleases.length && !drugControlReports.length && !importCertificates.length && !customsPass.length) {
          this.$notify.info({
            duration: 2000,
            message: '请选择附件'
          });
          return;
        }
        let obj = {
          batchReleases: batchReleases,
          drugControlReports: drugControlReports,
          importCertificates: importCertificates,
          customsPass: customsPass
        };
        http.put('/batch-number/' + item.batchNumberId + '/attachment', obj).then(() => {
          this.isShowFileList = false;
          this.$notify.success({
            duration: 2000,
            title: '成功',
            message: '已成功上传附件'
          });
          this.queryBatchNumbers();
          this.drugControlReport = {
            id: '',
            drugControlReportIds: []
          };
          this.batchReleases = {
            id: '',
            batchReleasesIds: []
          };
        });
      }
    }
  };
</script>
