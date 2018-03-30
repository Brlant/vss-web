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
    },
    handleRepetitiveOrgGoods (isHasBatchNumberInfo) {
      if (this.product.orgGoodsId !== this.editItemProduct.orgGoodsId) return;
      this.product.orgGoodsName = this.editItemProduct.orgGoodsName;
      let totalAmount = 0;
      // 判断时候需要批号信息
      if (!isHasBatchNumberInfo) {
        this.batchNumbers.forEach(b => {
          if (b.orgGoodsId === this.product.orgGoodsId) {
            b.lots.forEach(bl => {
              if (bl.isChecked) {
                let product = JSON.parse(JSON.stringify(this.product));
                product.batchNumberId = bl.id;
                product.no = bl.no;
                product.amount = bl.productCount;
                product.measurementUnit = this.editItemProduct.measurementUnit;
                this.form.detailDtoList.push(product);
                totalAmount += bl.productCount;
              }
            });
          }
        });
      } else {
        this.product.measurementUnit = this.editItemProduct.measurementUnit;
        this.form.detailDtoList.push(JSON.parse(JSON.stringify(this.product)));
      }
    }
  }
};
