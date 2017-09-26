<style lang="less">
  // Color
  @import "../../../assets/mixins";

  @timeline-prefix-cls: ~"@{css-prefix}timeline";
  @timeline-color: @border-color-split;
  .@{timeline-prefix-cls} {
    list-style: none;
    margin: 0;
    padding: 0;

    &-item {
      margin: 0 !important;
      padding: 0 0 12px 0;
      list-style: none;
      position: relative;

      &-tail {
        height: 100%;
        border-left: 1px solid @timeline-color;
        position: absolute;
        left: 6px;
        top: 0;
      }

      &-pending &-tail {
        display: none;
      }

      &-head {
        width: 13px;
        height: 13px;
        background-color: #fff;
        border-radius: 50%;
        border: 1px solid transparent;
        position: absolute;

        &-blue {
          border-color: @primary-color;
          color: @primary-color;
        }
        &-red {
          border-color: @error-color;
          color: @error-color;
        }
        &-green {
          border-color: @success-color;
          color: @success-color;
        }
      }

      &-head-custom {
        width: 30px;
        height: 30px;
        margin-top: 10px;
        text-align: center;
        line-height: 1;
        border-radius: 50%;
        font-size: @font-size-base;
        position: absolute;
        left: -9px;
        transform: translateY(-50%);
        i.iconfont {
          font-size: 20px;
          line-height: 30px;
        }
      }

      &-content {
        padding: 1px 1px 10px 34px;
        font-size: @font-size-small;
        position: relative;
        top: -3px;
      }

      &:last-child {
        .@{timeline-prefix-cls}-item-tail {
          display: none;
        }
      }
    }

    &&-pending &-item:nth-last-of-type(2) {

      .@{timeline-prefix-cls}-item-tail {
        border-left: 1px dotted @timeline-color;
      }
      .@{timeline-prefix-cls}-item-content {
        min-height: 48px;
      }
    }
  }

</style>
<template>
  <ul :class="classes">
    <slot></slot>
  </ul>
</template>
<script>
  const prefixCls = 'tiny-timeline';

  export default {
    name: 'Timeline',
    props: {
      pending: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      classes() {
        return [
          `${prefixCls}`,
          {
            [`${prefixCls}-pending`]: this.pending
          }
        ];
      }
    }
  };
</script>
