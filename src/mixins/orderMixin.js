export default {
  computed: {

    isShowGoodsList () {
      return this.$store.state.isShowGoodsList;
    }
  },
  watch: {
    isShowGoodsList () {
      if (this.getOrderList) {
        this.getOrderList(1);
      }
    }
  },
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
    checkHasOrderNotAdded (product, str = '订单') {
      if (product.orgGoodsId) {
        this.$notify({
          duration: 2000,
          message: `存在货品未加入${str}，请加入`,
          type: 'warning'
        });
        return false;
      }
      return true;
    }
  }
};
