<style scoped lang="scss">
  .title {
    font-size: 24px;
    margin: 10px 0;

    .el-tag {
      font-size: 24px;
      line-height: 26px;
      height: 26px;
    }
  }

  .qp-box {
    margin-bottom: 20px;
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 5px;
  }

  .ml-10 {
    margin-left: 10px;
  }
</style>
<template>
  <div v-loading="loading">
    <div class="empty-info" v-if="!detail || detail.signFlag === null">暂无反馈信息</div>
    <div v-else>
      <h3 class="title">
        {{detail.signFlag ? '已签收': '未签收'}}
      </h3>
      <div v-show="isShowPushBtn" class="mb-10" style="display: inline-block">
        <perm :label="perm">
          <el-button type="primary" size="mini" @click="uploadData">推送数据</el-button>
        </perm>
      </div>
      <div v-show="!isShowPushBtn" class="mb-10 ml-10">
        <perm label="upload-data-operate-again" style="display: inline-block">
          <el-button type="primary" size="mini" @click="uploadData">重新推送数据</el-button>
        </perm>
      </div>
      <div class="mb-10 ml-10" style="display: inline-block">
        <perm :label="perm">
          <el-button type="primary" size="mini" @click="uploadWDData">推送给市疾控</el-button>
        </perm>
      </div>
      <div class="ml-10" style="display: inline-block">
        <perm :label="perm">
          <el-button type="success" size="mini" @click="exportDataExcel" :loading="loadingExcel">
            {{loadingExcel ? '正在导出' :'导出国家协同平台XML'}}
          </el-button>
        </perm>
      </div>
      <el-table :data="detail.list" border class="clearfix" :header-row-class-name="'headerClass'"
                ref="orderDetail" v-show="detail.list.length">
        <el-table-column prop="successType" label="状态" :sortable="true" width="100">
          <span slot-scope="{row}">
            {{row.successType === 'true' ? '成功': row.successType === 'false' ? '失败' : row.successType}}
          </span>
        </el-table-column>
        <el-table-column prop="requestTime" label="请求时间" width="180">
          <span slot-scope="{row}">{{row.requestTime | time}}</span>
        </el-table-column>
        <el-table-column prop="interfacePlatformType" label="接口平台类型" :sortable="true" width="150"></el-table-column>
        <el-table-column prop="businessType" label="业务类型" :sortable="true" width="150"></el-table-column>

        <el-table-column prop="requestAddress" label="请求地址" min-width="200">
        </el-table-column>
        <el-table-column prop="requestContent" label="请求内容" :sortable="true" width="200">
          <div slot-scope="scope" style="max-height: 150px;overflow-y: auto">
            {{scope.row.requestContent}}
          </div>
        </el-table-column>
        <el-table-column prop="requestDecryptionContent" label="请求内容解密" :sortable="true" width="200">
          <div slot-scope="scope" style="max-height: 150px;overflow-y: auto">
            {{scope.row.requestDecryptionContent}}
          </div>
        </el-table-column>
        <el-table-column prop="responseTime" label="响应时间" :sortable="true" width="180">
          <span slot-scope="{row}">{{row.responseTime | time}}</span>
        </el-table-column>
        <el-table-column prop="returnContent" label="响应内容" :sortable="true" width="200">
          <div slot-scope="scope" style="max-height: 150px;overflow-y: auto">
            {{scope.row.returnContent}}
          </div>
        </el-table-column>
        <el-table-column prop="returnResult" label="HTTP状态码" :sortable="true" width="200">
        </el-table-column>
        <el-table-column prop="requestPerson" label="触发人" :sortable="true" width="180">
        </el-table-column>
        <el-table-column prop="serialNumber" label="流水号" :sortable="true" width="120"></el-table-column>
      </el-table>
      <div class="text-center" v-show="detail.list.length">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="pager.currentPage"
                       :page-sizes="[10,20,50,100]" :page-size="pager.pageSize"
                       layout="sizes, prev, pager, next, jumper"
                       :total="pager.count">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import utils from '@/tools/utils';

  export default {
    name: 'customerFeedback',
    props: {
      orderId: String,
      index: Number,
      perm: {
        type: String,
        default: 'sales-order-upload-data-operate'
      },
      currentOrder: Object
    },
    data() {
      return {
        detail: null,
        loading: false,
        loadingExcel: false,
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 10
        }
      };
    },
    computed: {
      isShowPushBtn() {
        // 推送数据条件： 反馈信息不存在 或者最新反馈信息推送异常
        return !this.detail.list.length || this.detail.list[0].result !== 0 || this.detail.list[0].result !== '00';
      }
    },
    watch: {
      index(val) {
        this.detail = null;
        if (val !== 12) return;
        this.query();
      }
    },
    methods: {
      handleSizeChange(val) {
        this.pager.pageSize = val;
        window.localStorage.setItem('currentPageSize', val);
        this.query(1);
      },
      handleCurrentChange(val) {
        this.query(val);
      },
      query(pageNo) {
        if (!this.orderId) return;
        this.pager.currentPage = pageNo;
        this.loading = true;
        let params = {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
        };
        this.$http.get(`upload-data/order/${this.orderId}/log`, {params}).then(res => {
          let list = [];
          if (res.data.pageResponse) {
            list = res.data.pageResponse.list || [];
            this.pager.count = res.data.pageResponse.count;
          }
          this.detail = {
            list,
            signFlag: res.data.signFlag
          };
          this.loading = false;
        });
      },
      uploadData() {
        if (this.loading) return;
        this.loading = true;
        this.$http.get(`/pov-upload/${this.orderId}`).then(() => {
          this.query();
        }).catch(e => {
          this.loading = false;
          this.$notify.error({
            message: e.response && e.response.data.msg || '无法推送数据'
          });
        });
      },
      uploadWDData() {
        if (this.loading) return;
        this.loading = true;
        this.$http.get(`/pov-upload/${this.orderId}/new`).then(() => {
          this.query();
        }).catch(e => {
          this.loading = false;
          this.$notify.error({
            message: e.response && e.response.data.msg || '无法推送数据'
          });
        });
      },
      exportDataExcel() {
        this.loadingExcel = true;
        let params = {orderId: this.orderId};
        this.$http.get('erp-order/xtpt/export', {params}).then(res => {
          this.loadingExcel = false;
          utils.downloadXml.call(this, res.data.path, `${this.currentOrder.orderNo}_国家协同平台.xml`);
        }).catch(error => {
          this.loadingExcel = false;
          this.$notify.error({
            message: error.response && error.response && error.response.data && error.response.data.msg || '导出失败'
          });
        });
      }
    }
  };
</script>
