<style lang="less" scoped="">
  .oms-loading {
    text-align: center;

    padding: 1em 0;
  }

  .oms-loading > i {
    -webkit-animation: bouncedelay 1.4s infinite ease-in-out;
    animation: bouncedelay 1.4s infinite ease-in-out;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    background-color: #A6A6A6;
    display: inline-block;
    border-radius: 100%;
    margin: 0 2px;
    height: 18px;
    width: 18px
  }

  .oms-loading > i:nth-child(2) {
    -webkit-animation-delay: .2s;
    animation-delay: .2s
  }

  .oms-loading > i:nth-child(3) {
    -webkit-animation-delay: .4s;
    animation-delay: .4s
  }

  .loading-rotation {
    z-index: 800;
  }
</style>
<template>
  <!--<div class="oms-loading" v-show="loading"><i></i><i></i><i></i></div>-->
  <div v-loading="loading" class="loading-rotation" :style="'height:'+height">
  </div>
</template>

<script>
  export default {
    name: 'omsLoading',
    props: {
      height: {
        type: String,
        default: '200px'
      },
      loading: {
        type: Boolean,
        default: false
      }
    }
  };
</script>
