export default {
  methods: {
    beforeCloseConfirm (str = '订单信息未保存,是否关闭') {
      this.$confirm(str, '', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.resetRightBox();
      });
    },
    checkHasOrderNotAdded (product) {
      if (product.orgGoodsId) {
        this.$notify({
          duration: 2000,
          message: '存在货品未加入货品列表，请加入',
          type: 'warning'
        });
        return false;
      }
      return true;
    }
  }
};
