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
  import {http} from '../../../resources';
  import attachmentLists from '../../common/attachmentList.vue';

  export default {
    components: {
      attachmentLists
    },
    props: ['id'],
    data() {
      return {
        loadingData: true,
        batchNumber: {},
        fileMap: [],
        drugControlReportIdList: {},
        batchReleaseIdList: {},
        importCertificateIdList: {},
        customsPassIdList: {}
      };
    },
    watch: {
      id() {
        this.queryStoreDetails();
      }
    },
    methods: {
      queryStoreDetails() {
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
