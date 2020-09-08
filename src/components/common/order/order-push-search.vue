<template>
  <oms-form-row :span="6" label="推送状态查询">
    <el-radio-group v-model="newValue" size="small" @change="val => $emit('input', val)">
      <el-radio-button label="0">推送中</el-radio-button>
      <el-radio-button label="1">成功</el-radio-button>
      <el-radio-button label="2">失败</el-radio-button>
    </el-radio-group>
  </oms-form-row>
</template>
<script>
export default {
  name: 'orderPushSearch',
  props: {
    value: String
  },
  data() {
    return {
      newValue: this.value
    };
  },
  watch: {
    value(val) {
      this.newValue = val;
    }
  }
};
</script>
