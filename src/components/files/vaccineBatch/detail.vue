<style lang="less" scoped="">
  .content-part {
    .content-right {
      > h3 {
        left: 0;
      }
      left: 0;
      padding-left: 100px;
      padding-right: 100px;
    }
  }

  .tr-bg {
    background: #eeeeee;
  }

  .qp-box {
    margin-bottom: 40px;
    padding: 20px;
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
    <div class="content-part">
      <div class="content-right content-padding">
        <h3>批号关联文件</h3>
        <div v-if="loadingData">
          <oms-loading :loading="loadingData"></oms-loading>
        </div>
        <div v-else="">
          <div class="qp-box">
            <el-row>
              <h2>
                药检报告
              </h2>
              <div>
                <div class="base-pic-list">
                  <div v-for=" attachment in drugControlReportList" class="base-pic-item">
                    <div @click="watchDrugControlReport(attachment)">
                      <img :src="attachment.attachmentStoragePath+'?image&action=resize:w_180,h_180,m_2'">
                    </div>
                  </div>
                </div>
                <attachment-lists :attachmentIdList="drugControlReportIdList" :objectId="id"
                                  :objectType="'drugControlReport'"
                                  :permission="'show'"></attachment-lists>
              </div>
            </el-row>
          </div>
          <div class="qp-box">
            <el-row>
              <h2>
                批签发
              </h2>
              <div>
                <div class="base-pic-list">
                  <div v-for=" attachment in batchReleaseList" class="base-pic-item">
                    <div @click="watchBatchRelease(attachment)">
                      <img :src="attachment.attachmentStoragePath+'?image&action=resize:w_180,h_180,m_2'">
                    </div>
                  </div>
                </div>
                <attachment-lists :attachmentIdList="batchReleaseIdList" :objectId="id"
                                  :objectType="'batchRelease'"
                                  :permission="'show'"></attachment-lists>
              </div>
            </el-row>
          </div>
          <div class="qp-box">
            <el-row>
              <h2>
                进口注册证
              </h2>
              <div>
                <div class="base-pic-list">
                  <div v-for=" attachment in importCertificateList" class="base-pic-item">
                    <div @click="watchImportCertificate(attachment)">
                      <img :src="attachment.attachmentStoragePath+'?image&action=resize:w_180,h_180,m_2'">
                    </div>
                  </div>
                </div>
                <attachment-lists :attachmentIdList="importCertificateIdList" :objectId="id"
                                  :objectType="'importCertificate'"
                                  :permission="'show'"></attachment-lists>
              </div>
            </el-row>
          </div>
          <div class="qp-box">
            <el-row>
              <h2>
                通关单
              </h2>
              <div>
                <div class="base-pic-list">
                  <div v-for=" attachment in customsPassList" class="base-pic-item">
                    <div @click="watchCustomsPass(attachment)">
                      <img :src="attachment.attachmentStoragePath+'?image&action=resize:w_180,h_180,m_2'">
                    </div>
                  </div>
                </div>
                <attachment-lists :attachmentIdList="customsPassIdList" :objectId="id"
                                  :objectType="'customsPass'"
                                  :permission="'show'"></attachment-lists>
              </div>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {http, OmsAttachment} from '../../../resources';
  import attachmentLists from '../../common/attachmentList.vue';

  export default {
    components: {
      attachmentLists
    },
    props: ['id'],
    data () {
      return {
        loadingData: true,
        batchNumber: {},
        fileMap: [],
        drugControlReportIdList: {},
        batchReleaseIdList: {},
        importCertificateIdList: {},
        customsPassIdList: {},
        drugControlReportList: {},
        batchReleaseList: {},
        importCertificateList: {},
        customsPassList: {}
      };
    },
    watch: {
      id(val) {
        this.queryStoreDetails();
        this.getDrugControlReportList(val, 'drugControlReport');
        this.getBatchReleaseList(val, 'batchRelease');
        this.getImportCertificateList(val, 'importCertificate');
        this.getCustomsPassList(val, 'customsPass');
      }
    },
    methods: {
      getDrugControlReportList: function (objectId, objectType) {
        if (!objectId) return;
        OmsAttachment.queryOneAttachmentList(objectId, objectType).then(res => {
          this.drugControlReportList = res.data;
        });
      },
      getBatchReleaseList: function (objectId, objectType) {
        if (!objectId) return;
        OmsAttachment.queryOneAttachmentList(objectId, objectType).then(res => {
          this.batchReleaseList = res.data;
        });
      },
      getImportCertificateList: function (objectId, objectType) {
        if (!objectId) return;
        OmsAttachment.queryOneAttachmentList(objectId, objectType).then(res => {
          this.importCertificateList = res.data;
        });
      },
      getCustomsPassList: function (objectId, objectType) {
        if (!objectId) return;
        OmsAttachment.queryOneAttachmentList(objectId, objectType).then(res => {
          this.customsPassList = res.data;
        });
      },
      watchDrugControlReport(item) {
        if (item) {
          this.$store.commit('changeAttachment', {
            currentId: item.attachmentId,
            attachmentList: this.drugControlReportList
          });
        }
      },
      watchBatchRelease(item) {
        if (item) {
          this.$store.commit('changeAttachment', {
            currentId: item.attachmentId,
            attachmentList: this.batchReleaseList
          });
        }
      },
      watchImportCertificate(item) {
        if (item) {
          this.$store.commit('changeAttachment', {
            currentId: item.attachmentId,
            attachmentList: this.importCertificateList
          });
        }
      },
      watchCustomsPass(item) {
        if (item) {
          this.$store.commit('changeAttachment', {
            currentId: item.attachmentId,
            attachmentList: this.customsPassList
          });
        }
      },
      queryStoreDetails () {
        this.loadingData = true;
        http.get(`/batch-number/${this.id}`).then(res => {
          this.batchNumber = res.data;
          this.fileMap = res.data.map;
//          // 处理idList
//          if (res.data) {
//            this.fileMap.drugControlReports.forEach(val => {
//              console.log(val.id);
//              this.drugControlReportIdList.push(val.id);
//            });
//            this.fileMap.batchReleases.forEach(val => {
//              this.batchReleaseIdList.push(val.id);
//            });
//            this.fileMap.importCertificates.forEach(val => {
//              this.importCertificateIdList.push(val.id);
//            });
//            this.fileMap.customsPass.forEach(val => {
//              this.customsPassIdList.push(val.id);
//            });
//          }
          this.loadingData = false;
        });
      }
    }
  };
</script>
