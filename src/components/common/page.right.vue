<style lang="less" scoped="">
  @import "../../assets/mixins.less";

  .page-right-part {
    width: 550px;
    padding: 30px;
    z-index: 3000;
    &.pr-animation {
      transition: 0.2s transform ease-in-out;
      transform: translateX(100%);
    }
    &.pr-no-animation {
      display: none;
    }
    &.on {
      &.pr-animation {
        transform: translateX(0);
      }
      &.pr-no-animation {
        display: block;
        transform: translateX(0);
      }
    }
  }

  .right-close-icon {
    z-index: 99999;
    width: 30px;
    height: 30px;
    line-height: 30px;
    position: absolute;
    right: 30px;
    top: 15px;
    cursor: pointer;
    i {
      font-size: 30px;
    }
    &:hover {
      color: @activeColor
    }
  }
</style>
<template>
  <div class="page-right-wrap">
    <div class="page-right-part" :class="[{'on':show},partClass]" :style="style">
      <div class="right-close-icon" @click="close"><i class="iconfont icon-remove"></i></div>
      <slot @right-close="close"></slot>
    </div>
    <div class="page-right-part-bg" @click="close" v-show="show"></div>
  </div>
</template>

<script>
  import utils from '../../tools/utils';

  export default {
    name: 'pageRight',

    props: {
      show: {
        type: Boolean,
        default: false
      },
      css: {
        type: Object
      },
      partClass: {
        type: String,
        default: 'pr-animation'
      }
    },
    watch: {
      show: function (val) {
        if (val) {
          utils.addClass(document.getElementsByTagName('body')[0], 'overflow-hidden');
        } else {
          utils.removeClass(document.getElementsByTagName('body')[0], 'overflow-hidden');
        }
      }
    },
    computed: {
      style: function () {
        let defaultObj = {
          width: '550px',
          padding: '30px'
        };
        let cssArr = [];
        let obj = {};
        obj = Object.assign({}, defaultObj, this.css);
        for (let i in obj) {
          cssArr.push(i + ':' + obj[i]);
        }
        return cssArr.join(';');
      }
    },
    methods: {
      close: function () {
        this.$emit('right-close');
      }
    }
  };
</script>
