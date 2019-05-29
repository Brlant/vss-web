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
    }
  }
};
