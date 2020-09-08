<style lang="scss" scoped>
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
    <div v-if="!detail || detail.signFlag === null" class="empty-info">暂无反馈信息</div>
    <div v-else>
      <h3 class="title">
        {{detail.signFlag ? '已签收': '未签收'}}
      </h3>
      <div v-show="isShowPushBtn" class="mb-10" style="display: inline-block">
        <perm :label="perm">
          <el-button size="mini" type="primary" @click="uploadData">签收并推送数据</el-button>
        </perm>
      </div>
      <div v-show="!isShowPushBtn" class="mb-10 ml-10">
        <perm label="upload-data-operate-again" style="display: inline-block">
          <el-button size="mini" type="primary" @click="uploadData">重新推送数据</el-button>
        </perm>
      </div>
      <div class="ml-10" style="display: inline-block">
        <perm :label="perm">
          <el-button :loading="loadingExcel" size="mini" type="success" @click="exportDataExcel">
            {{loadingExcel ? '正在导出' :'导出国家协同平台XML'}}
          </el-button>
        </perm>
      </div>
      <el-table v-show="detail.list.length" ref="orderDetail" :data="detail.list" :header-row-class-name="'headerClass'"
                border class="clearfix">
        <el-table-column :sortable="true" label="状态" prop="successType" width="100">
          <span slot-scope="{row}">
            {{row.successType === 'true' ? '成功': row.successType === 'false' ? '失败' : row.successType}}
          </span>
        </el-table-column>
        <el-table-column label="请求时间" prop="requestTime" width="180">
          <span slot-scope="{row}">{{row.requestTime | time}}</span>
        </el-table-column>
        <el-table-column :sortable="true" label="接口平台类型" prop="interfacePlatformType" width="150"></el-table-column>
        <el-table-column :sortable="true" label="业务类型" prop="businessType" width="150"></el-table-column>

        <el-table-column label="请求地址" min-width="200" prop="requestAddress">
        </el-table-column>
        <el-table-column :sortable="true" label="请求内容" prop="requestContent" width="200">
          <div slot-scope="scope" style="max-height: 150px;overflow-y: auto">
            {{scope.row.requestContent}}
          </div>
        </el-table-column>
        <el-table-column :sortable="true" label="请求内容解密" prop="requestDecryptionContent" width="200">
          <div slot-scope="scope" style="max-height: 150px;overflow-y: auto">
            {{scope.row.requestDecryptionContent}}
          </div>
        </el-table-column>
        <el-table-column :sortable="true" label="响应时间" prop="responseTime" width="180">
          <span slot-scope="{row}">{{row.responseTime | time}}</span>
        </el-table-column>
        <el-table-column :sortable="true" label="响应内容" prop="returnContent" width="200">
          <div slot-scope="scope" style="max-height: 150px;overflow-y: auto">
            {{scope.row.returnContent}}
          </div>
        </el-table-column>
        <el-table-column :sortable="true" label="HTTP状态码" prop="returnResult" width="200">
        </el-table-column>
        <el-table-column :sortable="true" label="触发人" prop="requestPerson" width="180">
        </el-table-column>
        <el-table-column :sortable="true" label="流水号" prop="serialNumber" width="120"></el-table-column>
      </el-table>
      <div v-show="detail.list.length" class="text-center">
        <el-pagination :current-page="pager.currentPage" :page-size="pager.pageSize"
                       :page-sizes="[10,20,50,100]"
                       :total="pager.count" layout="sizes, prev, pager, next, jumper"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange">
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
