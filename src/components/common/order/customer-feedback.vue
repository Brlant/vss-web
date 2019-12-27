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
      <div class="qp-box" v-for="item in detail.list">
        <h3>
          {{ item.calltime }}
          <el-tag v-if="item.result === 0 || item.result === '00'" type="success">正常</el-tag>
          <el-tag v-else type="danger">异常</el-tag>
        </h3>
        <div>
          {{item.jsonData}}
        </div>
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
        loadingExcel: false
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
      query() {
        if (!this.orderId) return;
        this.loading = true;
        this.$http.get(`upload-data/order/${this.orderId}`).then(res => {
          let list = [];
          res.data.list && res.data.list.forEach(i => {
            if (i.json) {
              let item = JSON.parse(i.json);
              item.jsonData = i.json;
              list.push(item);
            }
          });
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
            message: error.response && error.response.data && error.response.data.msg || '导出失败'
          });
        });
      }
    }
  };
</script>
