<style lang="less" scoped="">
  .c-photo-list {
    display: flex;
    flex-wrap: wrap;
    img {
      display: block;
      margin: 5px;
      width: 150px;
      height: 150px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      cursor: pointer;
    }
  }

  .el-row {
    margin-bottom: 15px;
  }
</style>
<template>
  <div>
    <h2 class="clearfix">客户证照</h2>
    <oms-row label="名称" :span="6">
      {{formItem.name}}
    </oms-row>
    <oms-row label="开始日期" :span="6">
      {{formItem.validStartTime | date}}
    </oms-row>
    <oms-row label="截止日期" :span="6">
      {{formItem.validEndTime | date}}
    </oms-row>
    <div class="c-photo-list">
      <img :src="photo.attachmentStoragePath" @click.stop="showImg(photo)"
           v-for="(photo,key) in formItem.photos">
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      formItem: {}
    },
    methods: {
      showImg: function (file) {
        this.$store.commit('changeAttachment', file.attachmentId);
      }
    }
  };
</script>
