<style lang="less" scoped="">
  .batch-number-upload {
    margin-left: 10px;
    border-right: 2px solid #eee;
  }

  .tr-bg {
    background: #eeeeee;
  }

  .qp-box {
    margin-bottom: 40px;
    padding: 20px;
    margin-left: 40px;
    box-shadow: 4px 4px 2px 0 #ddd;
  }

  .base-pic-list {
    padding-top: 10px;
    display: flex;
    flex-wrap: wrap;
    .base-pic-item {
      border: 1px solid #eee;
      position: relative;
      cursor: pointer;
      width: 180px;
      margin: 5px;
      padding: 10px;
      font-size: 12px;
      img {
        width: 180px;
        height: 180px;
        display: block;
        background: #ccc;

      }
    }
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
        <div v-show="isShow(item)">
          <el-row>
            <el-col :span="12">
              <div class="qp-box">
                <el-row>
                  <h2>
                    药检报告
                  </h2>
                  <div>
                    <div class="base-pic-list" v-if="item.attachmentMap.drugControlReports.length>0">
                      <div class="base-pic-item">
                        <div @click="watchPhoto(item.attachmentMap.drugControlReports[0])">
                          <img
                            :src="item.attachmentMap.drugControlReports[0].attachmentStoragePath+'?image&action=resize:w_180,h_180,m_2'">
                        </div>
                      </div>
                    </div>
                    <attachment-lists :attachmentIdList="drugControlReportIdList" :objectId="item.batchNumberId"
                                      :objectType="'drugControlReport'"
                                      :permission="'show'"></attachment-lists>
                  </div>
                </el-row>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="qp-box">
                <el-row>
                  <h2>
                    批签发
                  </h2>
                  <div>
                    <div class="base-pic-list" v-if="item.attachmentMap.batchReleases.length>0">
                      <div class="base-pic-item">
                        <div @click="watchPhoto(item.attachmentMap.batchReleases[0])">
                          <img
                            :src="item.attachmentMap.batchReleases[0].attachmentStoragePath+'?image&action=resize:w_180,h_180,m_2'">
                        </div>
                      </div>
                    </div>
                    <attachment-lists :attachmentIdList="batchReleaseIdList" :objectId="item.batchNumberId"
                                      :objectType="'batchRelease'"
                                      :permission="'show'"></attachment-lists>
                  </div>
                </el-row>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div class="qp-box">
                <el-row>
                  <h2>
                    进口注册证
                  </h2>
                  <div>
                    <div class="base-pic-list" v-if="item.attachmentMap.importCertificates.length>0">
                      <div class="base-pic-item">
                        <div @click="watchPhoto(item.attachmentMap.importCertificates[0])">
                          <img
                            :src="item.attachmentMap.importCertificates[0].attachmentStoragePath+'?image&action=resize:w_180,h_180,m_2'">
                        </div>
                      </div>
                    </div>
                    <attachment-lists :attachmentIdList="importCertificateIdList" :objectId="item.batchNumberId"
                                      :objectType="'importCertificate'"
                                      :permission="'show'"></attachment-lists>
                  </div>
                </el-row>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="qp-box">
                <el-row>
                  <h2>
                    通关单
                  </h2>
                  <div>
                    <div class="base-pic-list" v-if="item.attachmentMap.customsPass.length>0">
                      <div class="base-pic-item">
                        <div @click="watchPhoto(item.attachmentMap.customsPass[0])">
                          <img
                            :src="item.attachmentMap.customsPass[0].attachmentStoragePath+'?image&action=resize:w_180,h_180,m_2'">
                        </div>
                      </div>
                    </div>
                    <attachment-lists :attachmentIdList="customsPassIdList" :objectId="item.batchNumberId"
                                      :objectType="'customsPass'"
                                      :permission="'show'"></attachment-lists>
                  </div>
                </el-row>
              </div>
            </el-col>
          </el-row>
          <!--<attachment-show label="药检报告" :orderAttachment="item.attachmentMap.drugControlReports"-->
          <!--:currentOrder="currentOrder"-->
          <!--objectType="" :objectId="item.batchNumberId"-->
          <!--:attachmentRight="attachmentRight"-->
          <!--:isShowUpload="false" @refreshAttachment="queryBatchNumbers"></attachment-show>-->

          <!--<attachment-show label="批签发" :orderAttachment="item.attachmentMap.batchReleases" :currentOrder="currentOrder"-->
          <!--objectType="" :objectId="item.batchNumberId"-->
          <!--:attachmentRight="attachmentRight"-->
          <!--:isShowUpload="false" @refreshAttachment="queryBatchNumbers"></attachment-show>-->

          <!--<attachment-show label="进口注册证" :orderAttachment="item.attachmentMap.importCertificates"-->
          <!--:currentOrder="currentOrder"-->
          <!--objectType="" :objectId="item.batchNumberId"-->
          <!--:attachmentRight="attachmentRight"-->
          <!--:isShowUpload="false" @refreshAttachment="queryBatchNumbers"></attachment-show>-->

          <!--<attachment-show label="通关单" :orderAttachment="item.attachmentMap.customsPass" :currentOrder="currentOrder"-->
          <!--objectType="" :objectId="item.batchNumberId"-->
          <!--:attachmentRight="attachmentRight"-->
          <!--:isShowUpload="false" @refreshAttachment="queryBatchNumbers"></attachment-show>-->
        </div>
        <div v-show="!isShow(item)">
          暂无附件信息
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { http } from '@/resources';
  import attachmentShow from './attachmentShow.vue';
  import attachmentLists from './../../../common/attachmentList.vue';

  export default {
    components: {
      attachmentShow, attachmentLists
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
        drugControlReportIdList: {},
        batchReleaseIdList: {},
        importCertificateIdList: {},
        customsPassIdList: {},
        loadingData: true,
        batchNumbers: [],
        attachmentRight: {// 附件管理权限
          watch: 'batch-number-manager',
          download: 'batch-number-download',
          upload: '',
          remove: 'batch-number-upload'
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
      watchPhoto(item) {
        if (item.length > 0) {
          this.$store.commit('changeAttachment', {
            currentId: item[0].attachmentId,
            attachmentList: item
          });
        }
      },
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
//        if (!this.drugControlReport.id) {
//          this.$notify.info({
//            duration: 2000,
//            message: '请上传药检报告'
//          });
//          return;
//        }
//        if (!this.batchReleases.id) {
//          this.$notify.info({
//            duration: 2000,
//            message: '请上传批签发文件'
//          });
//          return;
//        }
//        if (!this.importCertificates.id) {
//          this.$notify.info({
//            duration: 2000,
//            message: '请上传进口注册证'
//          });
//          return;
//        }
//        if (!this.customsPass.id) {
//          this.$notify.info({
//            duration: 2000,
//            message: '请上传通关单'
//          });
//          return;
//        }
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
