<style lang="scss" scoped>
  .error-card {
    position: absolute;
    width: 500px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
</style>
<template>
  <el-card class="main-card-box error-card">
    <el-alert
      title="404 走丢了"
      type="warning"
      description="页面找不到"
      :closable="false"
      show-icon>
    </el-alert>
  </el-card>
</template>
<script>
  export default {
    name: 'error-404'
  };
</script>
