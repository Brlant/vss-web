<style>
  .print-dialog {
    position: fixed;
    top: 90px;
    left: 180px;
    right: 0;
    bottom: 0;
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
        if (!prints.length) return {};
        if (this.$route.meta.moduleId !== 'report') return {};
        let ary = this.$route.path.split('/');
        prints.forEach(item => {
          if (item.moduleId === ary[ary.length - 1]) {
            obj = item;
          }
        });
        return obj;
      }
    }
  };
</script>
