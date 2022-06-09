<style scoped>
.print-dialog {
  position: fixed;
  top: 90px;
  left: 200px;
  right: 0;
  bottom: 0;
  z-index: 10000;
}
</style>
<template>
  <div v-if="print.isPrinting" v-loading="print.isPrinting"
       :element-loading-text="print.text"
       :style="{top: typeof print.top === 'string' ? print.top : '90px',left: typeof print.left === 'string' ? print.left :'200px'}"
       class="print-dialog"></div>
</template>
<script>
export default {
  computed: {
    print() {
      let obj = {};
      let prints = this.$store.state.prints;
      prints.forEach(item => {
        if (item.moduleId === this.$route.path || item.moduleId === window.location.hash.substring(1)) {
          obj = item;
        }
      });
      return obj;
    }
  }
};
</script>
