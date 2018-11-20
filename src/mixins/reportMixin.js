export default {
  data() {
    return {
      fixedHeight: 0
    };
  },
  mounted() {
    let showSearch = JSON.parse(window.localStorage.getItem(this.$route.path));
    if (typeof showSearch === 'boolean') {
      this.showSearch = showSearch;
    }
  },
  watch: {
    showSearch(val) {
      window.localStorage.setItem(this.$route.path, val);
    }
  },
  methods: {
    setFixedHeight() {
      setTimeout(() => {
        this.fixedHeight = Math.abs(this.fixedHeight - 1);
      }, 100);
    }
  }
};

