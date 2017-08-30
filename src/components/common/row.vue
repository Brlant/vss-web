<style lang="less" scoped>
  .col-label {
    color: #777;

  }

  .row-black {
    .col-label {
      color: #333;
    }
  }
</style>
<template>
  <el-row :class="rowClass">
    <el-col :span="span" class="text-right col-label"><span style="padding-right:10px;" v-show="label">{{label}}:</span>
    </el-col>
    <el-col :span="24-span">
      <slot></slot>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: 'omsRow',
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
        default: 'oms-row'
      }
    }
  };
</script>
