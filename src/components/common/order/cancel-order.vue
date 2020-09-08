<style lang="scss">
.cancel-reason {
  display: flex;
  align-items: center;
  margin-top: 10px;
  padding-right: 10px;
  margin-bottom: 10px;

  .el-select {
    width: 100%;
  }
}
</style>
<template>
  <div>
    <div v-show="isShow" class="comment-box">
      <oms-row :span="3" class="cancel-reason" label="取消订单原因">
        <el-select ref="cancelList" v-model="form.reason" clearable placeholder="请选择取消订单原因" type="text">
          <el-option v-for="item in cancelOrderReasons" :key="item.key" :label="item.label"
                     :value="item.label"></el-option>
        </el-select>
      </oms-row>
      <div class="comment-box-submit">
        <el-button :disabled="doing" type="primary" @click="cancel">提交取消订单原因</el-button>
        <el-button :disabled="doing" type="primary" @click="isShow = false">取消</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import {erpOrder} from '@/resources';

export default {
  name: 'CancelOrder',
  props: {
    orderId: ''
  },
  data() {
    return {
      isShow: false,
      form: {
        reason: ''
      },
      doing: false
    };
  },
  watch: {
    orderId() {
      this.isShow = false;
      this.form.reason = '';
    },
    isShow(val) {
      if (val) {
        this.$nextTick(() => {
          this.$el.scrollIntoView();
        });
      }
    }
  },
  computed: {
    cancelOrderReasons: function () {
      return this.$getDict('cancelOrderReason');
    }
  },
  methods: {
    cancel() {
      if (!this.form.reason) {
        this.$notify({
          duration: 2000,
          message: '请选择取消订单原因',
          type: 'warning'
        });
        return;
      }
      this.$confirm('是否取消订单', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doing = true;
        erpOrder.cancel(this.orderId, this.form).then(() => {
          this.$notify.success({
            message: '取消订单成功'
          });
          this.doing = false;
          this.form.reason = '';
          this.isShow = false;
          this.$emit('close');
          this.$emit('refreshOrder');
        }).catch(error => {
          this.doing = false;
          this.$notify.error({
            message: error.response && error.response.data && error.response.data.msg || '取消订单失败'
          });
        });
      });
    }
  }
};
</script>
