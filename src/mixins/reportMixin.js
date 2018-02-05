export default {
  data () {
    return {
      fixedHeight: 0
    };
  },
  methods: {
    setFixedHeight () {
      setTimeout(() => {this.fixedHeight = Math.abs(this.fixedHeight - 1);}, 100);
    }
  }
};

