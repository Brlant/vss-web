<template>
  <sapn>
    <el-tag v-if="status === '1'" type="success">推送完成</el-tag>
    <el-tag v-else-if="status === '0'" type="danger">失败</el-tag>
    <el-tag v-else>推送中</el-tag>
  </sapn>
</template>
<script>
  export default {
    name: 'orderPushStatus',
    props: {
      status: {
        type: String,
        required: true
      }
    }
  };
</script>
