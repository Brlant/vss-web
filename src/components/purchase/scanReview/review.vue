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

.code-table-warp {
  margin: 20px 0;
}
</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-right content-padding">
        <h3>扫码复核</h3>
        <el-form ref="orderAddForm" :model="form" label-width="100px" onsubmit="return false"
                 style="padding-right: 20px" @submit.prevent="onSubmit">
          <el-form-item label="追溯码">
            <el-input v-model="form.codeStr" :rows="5" class="input-width" placeholder="可以录入多个追溯码，追溯码之间可以通过逗号分隔、空格分隔、换行分隔"
                      type="textarea"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :disabled="doing" type="primary" @click="onSubmit">提交追溯码信息</el-button>
            <el-button :disabled="doing" type="success" @click="passReview">通过复核</el-button>
<!--            <el-button type="primary"  plain @click="batchRemove">批量移除追溯码</el-button>-->
          </el-form-item>
        </el-form>
        <div v-show="codeInfoList && codeInfoList.length" class="code-table-warp">
          <h3>已录入追溯码信息</h3>
          <el-table :data="codeInfoList">
            <el-table-column label="追溯码" prop="code">
              <template slot-scope="scope">
                <span>{{scope.row.code}}</span>
                <el-tag v-if="!scope.row.errorFlag" type="success">正常</el-tag>
                <el-tag v-else type="danger">错误</el-tag>
                <span v-if="scope.row.errorFlag">（错误信息: {{scope.row.exceptionResultTitle}}）</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" prop="orderNo" width="140">
              <el-button slot-scope="scope" size="mini" type="danger" @click="deleteItem(scope.row)">删除</el-button>
            </el-table-column>
          </el-table>
        </div>
      </div>
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
        codeStr: ''
      },
      codeInfoList: [],
      doing: false
    };
  },
  watch: {
    show(val) {
      this.form.codeStr = '';
      this.codeInfoList = [];
      if (!val) return;
      this.queryCodeList();
    }
  },
  methods: {
    onSubmit() {
      if (this.doing) return;
      let codeList = this.form.codeStr.split(/[\n,\s，]/g).filter(f => f);
      if (!codeList.length) return this.$notify.info('请输入追溯码');
      this.doing = true;
      this.$http.post(`/erp-order/${this.orderId}/review`, codeList).then(res => {
        this.form.codeStr = '';
        this.doing = false;
        this.queryCodeList();
      }).catch(error => {
        this.doing = false;
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '提交失败'
        });
      });
    },
    queryCodeList() {
      this.$http.get(`/erp-order/out/${this.orderId}/code`).then(res => {
        res.data.errorCodeList.forEach(i => i.errorFlag = true);
        this.codeInfoList = res.data.packageDtoList.concat(res.data.errorCodeList);
      });
    },
    passReview() {
      if (this.doing) return;
      this.doing = true;
      this.$http.post(`/erp-order/${this.orderId}/review/complete`).then(res => {
        this.$emit('refresh');
        this.$emit('right-close');
        this.doing = false;
      }).catch(error => {
        this.doing = false;
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '复核失败'
        });
      });
    },
    /**
     * 批量移除追溯码
     * **/
    batchRemove(){
      let codeList = this.form.codeStr.split(/[\n,\s，]/g).filter(f => f);
      if(codeList.length){
        this.$confirm("确认要全部清空?", "提示", {type: "warning"})
          .then(async () => {
            this.form.codeStr = ''
          })
      }else {
        this.$notify.info({
          title: '提示',
          message: '暂无追溯码数据',
          duration: '2000',
          onClose: function () {

          }
        });
      }
    },
    deleteItem(item) {
      this.$http.delete(`/review-code/${item.logId}`).then(res => {
        this.queryCodeList();
      });
    }
  }
};
</script>
