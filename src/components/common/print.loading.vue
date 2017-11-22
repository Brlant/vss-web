<style scoped="">
  .print-dialog {
    position: fixed;
    top: 90px;
    left: 180px;
    right: 0;
    bottom: 0;
    z-index: 10000;
  }
</style>
<template>
  <div class="print-dialog" v-if="print.isPrinting" v-loading="print.isPrinting"
       :element-loading-text="print.text"></div>
</template>
<script>
  export default {
    computed: {
      print () {
        let obj = {};
        let prints = this.$store.state.prints;
        prints.forEach(item => {
          if (item.moduleId === this.$route.path) {
            obj = item;
          }
        });
        return obj;
      }
    }
  };
</script>
