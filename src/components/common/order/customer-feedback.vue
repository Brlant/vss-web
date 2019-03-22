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
</style>
<template>
  <div v-loading="loading">
    <div class="empty-info" v-if="!detail || detail.signFlag === null">暂无反馈信息</div>
    <div v-else>
      <h3 class="title">
        {{detail.signFlag ? '已签收': '未签收'}}
      </h3>
      <div v-show="isShowPushBtn">
        <perm :label="perm">
          <el-button type="primary" size="mini" @click="uploadData">推送数据</el-button>
        </perm>
      </div>
      <div class="qp-box" v-for="item in detail.list">
        <h3>
          {{ item.calltime }}
          <el-tag v-if="item.result === 0" type="success">正常</el-tag>
          <el-tag v-else type="danger">异常</el-tag>
        </h3>
        <div>
          {{item.msg}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      orderId: String,
      index: Number,
      perm: String
    },
    data() {
      return {
        detail: null,
        loading: false
      };
    },
    computed: {
      isShowPushBtn() {
        // 推送数据条件： 反馈信息不存在 或者最新反馈信息推送异常
        return !this.detail.list.length || this.detail.list[0].result !== 0;
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
              list.push(JSON.parse(i.json));
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
        this.$http.get(`/pov-order/${this.orderId}`).then(() => {
          this.query();
        }).catch(e => {
          this.loading = false;
          this.$notify.error({
            message: e.response && e.response.data.msg || '无法推送数据'
          });
        });
      }
    }
  };
</script>
