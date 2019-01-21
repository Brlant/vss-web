<template>
  <span>
     <el-tag v-show="curStatus === 2" type="warning">近效期</el-tag>
     <el-tag v-show="curStatus === 3" type="danger">已过期</el-tag>
  </span>
</template>
<script>
  export default {
    name: 'goodsStatusTag',
    props: {
      item: Object,
      form: Object,
      status: String
    },
    computed: {
      curStatus() {
        if (this.status) return this.status;
        if (!this.form || !this.item) return '';
        // 下单时间
        let startTime = this.form.createTime || Date.now();
        // 有效期
        let expiryDate = this.item.expiryDate || this.item.expirationDate;
        if (this.$moment(startTime) > this.$moment(expiryDate)) {
          return 3; // 已过期
        }
        // 如果有近效期标志, 使用它，没有根据时间校验
        if (typeof this.item.inEffectiveFlag === 'boolean') {
          if (this.item.inEffectiveFlag) {
            return 2; // 近效期
          }
        } else {
          let a = this.$moment(startTime);
          let b = this.$moment(expiryDate);
          let days = b.diff(a, 'days');
          if (days <= 90) {
            return 2;
          }
        }
        return 1; // 正常
      }
    }
  };
</script>
