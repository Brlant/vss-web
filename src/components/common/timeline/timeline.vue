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
      padding: 0 0 5px 0;
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
        width: 6px;
        height: 6px;
        left: 3px;
        top: 0;
        background-color: #fff;
        border-radius: 50%;
        border: 1px solid transparent;
        position: absolute;
        &-grey {
          border-color: @border-color-split;
          color: @border-color-split;
        }
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
        min-width: 13px;
        min-height: 13px;
        margin-top: 4px;
        text-align: center;
        line-height: 1;
        border-radius: 50%;
        font-size: @font-size-base;
        position: absolute;
        left: 0;
        transform: translateY(-50%);
        .date-info {
          padding-top: 8px;
          font-size: 12px;
          span {
            display: block;
            font-size: 12px;
            transform: scale(0.6);
            font-style: italic;
          }
        }
        i {
          font-size: 10px;
          font-style: normal;
          line-height: 30px;
          &.iconfont {
            font-size: 20px;
          }
        }
      }

      &-content {
        padding: 1px 1px 10px 34px;
        font-size: @font-size-small;
        position: relative;
        top: -8px;
        h3 {
          padding: 0;
          margin: 0;
        }
        p {
          padding: 0;
          margin: 10px 0 0;
        }
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
