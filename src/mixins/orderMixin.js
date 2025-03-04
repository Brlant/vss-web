export default {
  data() {
    return {
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() < this.$moment().subtract(1, 'days');
        }
      },
      selectedList: [],
      checkAll: false
    };
  },
  computed: {
    isShowGoodsList() {
      return this.$store.state.isShowGoodsList;
    },
    isShowCheckBox() {
      return this.filters.state === '6' || this.filters.state === '1';
    },
    vaccineTypeList() {
      return this.$store.state.vaccineType;
    }
  },
  watch: {
    isShowGoodsList() {
      if (this.getOrderList) {
        this.getOrderList(1);
      }
    }
  },
  methods: {
    initCheck(list) {
      list.forEach(i => {
        i.checked = false;
      });
    },
    checkAllOrder(val) {
      this.orderList.forEach(i => {
        i.checked = val;
      });
    },
    batchAuditOrder() {
      let list = this.orderList.filter(f => f.checked).map(m => m.id);
      if (!list.length) {
        return this.$notify.info('请选择订单');
      }
      let obj = {
        orderIdList: list
      };
      this.$store.commit('initPrint', {isPrinting: true, moduleId: this.$route.path, text: '审单中...'});
      this.$http.put('/erp-order/batch/check', obj).then(res => {
        this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path});
        this.$notify.success('审单完成');
        this.getOrderList(1);
        this.checkAll = false;
      }).catch((e) => {
        let data = e.response.data;
        this.$notify.success(data && data.msg || '审单失败');
        this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path});
      });
    },
    beforeCloseConfirm(str = '订单信息未保存,是否关闭') {
      this.$confirm(str, '', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.resetRightBox();
      }).catch(() => {
      });
    },
    transportationAddressChange(val) {
      // 清空物流商
      this.form.logisticsProvider = '';
      this.form.logisticsProviderName = '';
      if (!val) return;
      let item = this[this.form.type === '0' ? 'cdcWarehouses' : 'LogisticsCenterAddressList'].find(f => f.id === val);
      if (!item) return;
      this.form.logisticsProviderName = item.warehouseSourceFirmName;
      this.form.logisticsProvider = item.warehouseSourceFirm;
    },
    checkHasOrderNotAdded(product, str = '订单') {
      if (product.orgGoodsId) {
        this.$notify({
          duration: 2000,
          message: `存在疫苗未加入${str}，请加入`,
          type: 'warning'
        });
        return false;
      }
      return true;
    },
    handleRepetitiveOrgGoods(isHasBatchNumberInfo) {
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
                product.batchNumber = bl.no;
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
    },
    /**
     * 出库， 添加订单，合并同货主疫苗，同批号的订单疫苗
     * @param list
     * @returns {*}
     */
    mergeSameOrgGoodsIdAndBatchNumberWhenOut(list) {
      let a1 = new Set();
      list.forEach(i => {
        let ary1 = list.filter(f => f.orgGoodsId === i.orgGoodsId && f.batchNumberId === i.batchNumberId);
        if (ary1.length > 1) {
          a1.add(ary1[0].orgGoodsId + ',' + ary1[0].batchNumberId);
        }
      });
      [...a1].forEach(i => {
        let s1 = i.split(',');
        let a2 = list.filter(f => f.orgGoodsId === s1[0] && f.batchNumberId === s1[1]);
        let amount = 0;
        a2.forEach(r => (amount = amount + r.amount));
        a2[0].amount = amount;
        list = list.filter(f => !(f.orgGoodsId === s1[0] && f.batchNumberId === s1[1]));
        list.push(a2[0]);
      });
      return list;
    },
    /**
     * 出库，添加订单，合并同货主疫苗的订单疫苗
     * @param list
     * @returns {*}
     */
    mergeSameOrgGoodsWhenIn(list) {
      let a1 = new Set();
      list.forEach(i => {
        let ary1 = list.filter(f => f.orgGoodsId === i.orgGoodsId);
        if (ary1.length > 1) {
          a1.add(ary1[0].orgGoodsId);
        }
      });
      [...a1].forEach(i => {
        let a2 = list.filter(f => f.orgGoodsId === i);
        let amount = 0;
        a2.forEach(r => (amount = amount + r.amount));
        a2[0].amount = amount;
        list = list.filter(f => f.orgGoodsId !== i);
        list.push(a2[0]);
      });
      return list;
    },
    /**
     * 校验批准文号, 30天内为近效期
     * @param date
     * @returns {*}
     */
    checkGoodsRegistrationValid(date) {
      if (!date) return false;
      let today = this.$moment(this.$moment().format('YYYY-MM-DD')).valueOf();
      date = this.$moment(date).valueOf();
      if (date - today < 0) {
        return this.$notify.error({
          message: '货品批准文号已过期'
        });
      }
      if (this.$moment(today).add(29, 'd') >= date) {
        return this.$notify.warning({
          message: '货品批准文号近效期'
        });
      }
    }
  }
};
