<style lang="less">
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
    <div class="comment-box" v-show="isShow">
      <oms-row label="取消订单原因" :span="3" class="cancel-reason">
        <el-select ref="cancelList" type="text" v-model="form.reason" clearable placeholder="请选择取消订单原因">
          <el-option :value="item.label" :key="item.key" :label="item.label"
                     v-for="item in cancelOrderReasons"></el-option>
        </el-select>
      </oms-row>
      <div class="comment-box-submit">
        <el-button type="primary" @click="cancel" :disabled="doing">提交取消订单原因</el-button>
        <el-button type="primary" @click="isShow = false" :disabled="doing">取消</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import { erpOrder } from '@/resources';

  export default {
    name: 'CancelOrder',
    props: {
      orderId: ''
    },
    data () {
      return {
        isShow: false,
        form: {
          reason: ''
        },
        doing: false
      };
    },
    watch: {
      orderId () {
        this.isShow = false;
        this.form.reason = '';
      }
    },
    computed: {
      cancelOrderReasons: function () {
        return this.$store.state.dict['cancelOrderReason'];
      }
    },
    methods: {
      cancel () {
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
              message: error.response.data && error.response.data.msg || '取消订单失败'
            });
          });
        });
      }
    }
  };
</script>
