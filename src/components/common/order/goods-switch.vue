<style lang="less">
  .goods-switch {
    margin-right: 20px;
    overflow: hidden;
    display: flex;
    justify-content: center;
  }
</style>
<template>
 <div class="goods-switch" >
   <span class="title">显示明细:</span>
   <span>
        <el-switch v-model="isShowGoodsList" @change="change" active-text="是" inactive-text="否"></el-switch>
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
