export default {
  data() {
    return {
      isClickForm: false
    };
  },
  methods: {
    mousedownAdd() {
      this.isClickForm = true;
    },
    resetIsClickForm() {
      this.isClickForm = false;
    },
    setAddProduct() {
      if (this.isClickForm) {
        this.addProduct();
      }
    },
    /**
     * 得到组合货品的数量，最小单位的整数倍
     * @param amount 数量
     * @param proportion 比例
     * @param smallPacking 最小包装数量
     * @returns {number}
     */
    getCurrentAccessoryGoodsAmount(amount, proportion, smallPacking) {
      if (!smallPacking) return proportion * amount;
      let newAmount = proportion * amount;
      let index = 1;
      let fullAmount = smallPacking * index;
      while (fullAmount < newAmount) {
        index++;
        fullAmount = smallPacking * index;
      }
      return fullAmount;
    }
  }
};
