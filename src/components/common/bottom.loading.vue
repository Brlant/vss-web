<style lang="less">
  .loading-indicator-box {
    margin: 10px auto;
    width: 70px;
    text-align: center;
    z-index: 9999;
    height: 20px;
    padding: 0;
  }

  .loading-indicator-box > .loader-dot {
    -webkit-animation: bouncedelay 1.4s infinite ease-in-out;
    animation: bouncedelay 1.4s infinite ease-in-out;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    background-color: #A6A6A6;
    display: inline-block;
    border-radius: 100%;
    margin: 0 2px;
    width: 16px;
    height: 16px;
  }

  .loading-indicator-box > .loader-dot:nth-child(2) {
    -webkit-animation-delay: .2s;
    animation-delay: .2s
  }

  .loading-indicator-box > .loader-dot:nth-child(3) {
    -webkit-animation-delay: .4s;
    animation-delay: .4s
  }
</style>
<template>
  <div class="loading-indicator-box" v-show="bottomLoading">
    <span class="loader-dot"></span>
    <span class="loader-dot"></span>
    <span class="loader-dot"></span>
  </div>
</template>
<script>
  export default {
    name: 'BottomLoading',
    computed: {
      bottomLoading () {
        return this.$store.state.bottomLoading;
      }
    }
  };
</script>
