<template>
  <span>
    <el-tag v-if="status === '1'" type="success">推送完成</el-tag>
    <el-tag v-else-if="status === '2'" type="danger">
     <el-tooltip class="item" effect="dark" :content="msg" placement="right">
       <span class="font-gray">推送失败</span>
     </el-tooltip>
    </el-tag>
    <el-tag v-else-if="status === '0'">推送中</el-tag>
  </span>
</template>
<script>
  export default {
    name: 'orderPushStatus',
    props: {
      status: {
        type: String
      },
      msg: {
        type: String,
      }
    }
  };
</script>
