<style lang="less" scoped="">
  .oms-form-row {
    .col-label {
      padding-top: 7px;
      > .red {
        color: #f00
      }
    }
    &.el-row {
      margin-bottom: 10px;
    }
  }
</style>
<template>
  <el-row class="oms-form-row">
    <el-col :span="span" class="text-right col-label"><span v-show="isRequire" class="red"
                                                            style="margin-right: 3px">*</span><span
      style="padding-right:5px;" v-show="label">{{label}}</span>
    </el-col>
    <el-col :span="24-span">
      <slot></slot>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: 'omsFormRow',
    props: {
      label: {
        type: String,
        required: true,
        default: ''
      },
      span: {
        type: Number,
        default: 10
      },
      rowClass: {
        type: String,
        default: ''
      },
      isRequire: {
        type: Boolean,
        default: false
      }
    }
  };
</script>
