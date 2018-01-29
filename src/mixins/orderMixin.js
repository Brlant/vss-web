export default {
  methods: {
    beforeCloseConfirm () {
      this.$confirm('订单信息未保存,是否关闭', '', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.resetRightBox();
      });
    }
  }
};
