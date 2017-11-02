<style lang="less" scoped="">
  @import "../assets/mixins.less";
  @card-box-border-color: #eee;
  .card-box {
    border: 1px solid @card-box-border-color;
    margin-bottom: 20px;
    .card-box-header {
      padding: 15px 20px;
      border-bottom: 1px solid @card-box-border-color;
      background: @card-box-border-color*1.05;
    }
    .card-box-body {
      padding: 5px 20px;
      background: #fff;
      .el-row {
        border-bottom: 1px solid @card-box-border-color;
        padding-top: 8px;
        padding-bottom: 6px;
        &:last-child {
          border-bottom: 0;
        }
      }
    }
  }

  .home-btn-banner {

    .home-btn-wrap {
      width: 100%;
      padding: 25px 0;
      font-size: 2.5em;
      i {
        font-size: 1em;
        margin-right:10px;

      }
    }
  }
</style>

<template>
  <div class="container">
    <div class="card-box">
      <div class="card-box-header">采购订单异常</div>
      <div class="card-box-body">
        <el-row v-for="(o, index) in 5" :key="o" type="flex" :gutter="15">
          <el-col :span="4">
            2017-05-12
          </el-col>
          <el-col :span="4">
            PO31012823001
          </el-col>
          <el-col :span="8">
            长春百克生物股份有限公司
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="card-box">
      <div class="card-box-header">接种点要货需求</div>
      <div class="card-box-body">
        <el-row v-for="(o, index) in 5" :key="o" type="flex" :gutter="15">
          <el-col :span="4">
            2017-05-12
          </el-col>
          <el-col :span="4">
            PO31012823001
          </el-col>
          <el-col :span="8">
            长春百克生物股份有限公司
          </el-col>
        </el-row>
      </div>
    </div>

    <el-row type="flex" :gutter="25" class="home-btn-banner">
      <el-col :span="8">
        <el-button class="home-btn-wrap" type="info">
          <i class="iconfont icon-picking"></i>
          快速拣货
        </el-button>
      </el-col>
      <el-col :span="8">
        <el-button class="home-btn-wrap" type="warning">
          <i class="iconfont icon-picking"></i>
          快速拣货
        </el-button>
      </el-col>
      <el-col :span="8">
        <el-button class="home-btn-wrap" type="success">
          <i class="iconfont icon-picking"></i>
          快速拣货
        </el-button>
      </el-col>
    </el-row>
  </div>

</template>
<script>
  import ElButton from '../../node_modules/element-ui/packages/button/src/button.vue';

  export default {
    components: {ElButton},
    data: function () {
      return {};
    },
    mounted() {

    },
    method: {}
  };

</script>

