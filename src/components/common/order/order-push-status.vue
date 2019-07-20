<template>
  <sapn>
    <el-tag v-if="status === '1'" type="success">推送完成</el-tag>
    <el-tag v-else-if="status === '2'" type="danger">推送失败</el-tag>
    <el-tag v-else-if="status === '0'">推送中</el-tag>
  </sapn>
</template>
<script>
  export default {
    name: 'orderPushStatus',
    props: {
      status: {
        type: String,
        required: true
      },
      msg: {
        type: String,
      }
    }
  };
</script>
