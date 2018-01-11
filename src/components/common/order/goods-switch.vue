<style lang="less">
  .goods-switch {
    margin-right: 20px;
  }
</style>
<template>
 <div class="goods-switch" >
   <span>
        <el-switch v-model="isShowGoodsList" @change="change" active-text="明细" inactive-text="精简"></el-switch>
   </span>
 </div>
</template>
<script>
    export default {
      name: 'goodsSwitch',
      data () {
        return {
          isShowGoodsList: false
        };
      },
      mounted () {
        let isShowGoodsList = JSON.parse(window.localStorage.getItem('isShowGoodsList'));
        if (isShowGoodsList !== null) {
          this.isShowGoodsList = isShowGoodsList;
          this.$store.commit('initIsShowGoodsList', isShowGoodsList);
        }
      },
      methods: {
        change (val) {
          window.localStorage.setItem('isShowGoodsList', JSON.stringify(val));
          this.$store.commit('initIsShowGoodsList', val);
        }
      }
    };
</script>
