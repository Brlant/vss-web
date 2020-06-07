<style lang="scss" scoped>
  $leftWidth: 0;
  .content-part {
    .content-left {
      width: $leftWidth;
    }

    .content-right {
      > h3 {
        left: $leftWidth;
      }

      left: $leftWidth;
    }
  }

  .ui-right {
    height: 300px;
    overflow: auto;
    background: #eee;
    border-radius: 4px;
    padding-top: 4px;

    .show-item {
      padding: 3px 10px;
    }
  }

  .part-top {
    margin: 10px;

    .title {
      margin: 10px 0;
    }
  }

  .correct-color {
    color: #3DBE2E;
  }

  .error-color {
    color: #e00000;
  }

  .el-form {
    .el-col {
      padding-right: 20px;
    }
  }

  .ui-left {
    &.error {
      height: 200px;
    }

    &.normal {
      height: 200px;
    }
  }

  .scan-btn {
    margin: 4px 0;
    width: 140px;
  }
</style>

<template>
  <div class="content-part">
    <!--<div class="content-left">-->
    <!--<h2 class="right-title" style="padding: 0">扫码复核</h2>-->
    <!--<ul>-->
    <!--<li class="text-center" style="margin-top:40px;position:absolute;bottom:30px;left:0;right:0;">-->
    <!--<el-button type="primary" size="mini" @click="submit" :disable="doing">复核追溯码</el-button>-->
    <!--</li>-->
    <!--</ul>-->
    <!--</div>-->
    <div class="content-right min-gutter">
      <h3>扫码复核</h3>
      <el-row>
        <el-input type="textarea" v-model="form.number" class="input-width" :rows="20"></el-input>
      </el-row>
      <el-row class="mt-10">
        <el-button type="primary" @click="submit" :disable="doing" :loading="doing">{{!doing ? '复核追溯码' : '正在复核'}}
        </el-button>
      </el-row>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      orderId: String,
      show: Boolean
    },
    data() {
      return {
        form: {
          number: ''
        },
        leftNumberList: [],
        leftErrorList: [],
        loadingData: false,
        doing: false
      };
    },
    watch: {
      show() {
        this.form.number = '';
      }
    },
    methods: {
      resetParam() {
        this.leftNumberList = [];
        this.leftErrorList = [];
        this.form.number = '';
      },
      submit() {
        let obj = {
          orderId: this.orderId,
          codeList: []
        };
        obj.codeList = this.form.number.split(/[\n,\s，]/g).filter(i => i);
        if (this.doing) return;
        this.doing = true;
        this.$http.post('/erp-breakage/review', obj).then(res => {
          this.$notify.success({
            message: '复核通过'
          });
          this.doing = false;
          this.form.number = '';
          this.$emit('close');
          this.$emit('change');
        }).catch(error => {
          this.doing = false;
          this.$notify.error({
            message: error.response && error.response.data && error.response.data.msg || '复核不通过'
          });
        });
      },
      reviewPass() {
        if (this.doing) return;
        this.doing = true;
        this.$http.put(`/erp-order/${this.orderId}/out/complete`).then(res => {
          this.$notify.success({
            message: '出库完成'
          });
          this.doing = false;
          this.$emit('refreshOrder');
          this.$emit('close');
        }).catch(error => {
          this.doing = false;
          this.$notify.error({
            message: error.response && error.response.data && error.response.data.msg || '出库失败'
          });
        });
      },
      reviewErrorCode() {
        this.doing = true;
        this.$http.put(`/erp-order/${this.orderId}/review/error`).then(res => {
          this.$notify.success({
            message: '复核错误追溯码已完成'
          });
          this.doing = false;
        }).catch(error => {
          this.doing = false;
          this.$notify.error({
            message: error.response && error.response.data && error.response.data.msg || '复核错误追溯码失败'
          });
        });
      },
      removeNumberItem(item) {
        this.$http.delete(`/erp-order/code/${item.logId}`).then(res => {
          this.leftNumberList = this.leftNumberList.filter(f => f.logId !== item.logId);
          this.leftErrorList = this.leftErrorList.filter(f => f.logId !== item.logId);
        });
      }
    }
  };
</script>
