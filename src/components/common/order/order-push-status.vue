<template>
  <sapn>
    <el-tag v-if="status === '1'" type="success">推送完成</el-tag>
    <span v-else-if="status === '2'" class="text-danger">
      {{msg ? JSON.parse(msg).msg : '推送失败'}}
    </span>
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
