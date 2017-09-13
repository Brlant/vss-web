<style lang="less" scoped="">
  .row-black {
    color: #666
  }

  .basic-info {
    position: absolute;
    top: 56px;
    left: 0;
    bottom: 0;
    width: 100%;
    z-index: 2;
    line-height: 26px;
    background: #eef2f3;
    > h3 {
      border-bottom: 1px solid #eee;
      border-right: 1px solid #eef2f3;
      background: #fff;
      margin: 0;
      padding: 10px 20px;
      .btn-close {
        i {
          font-size: 20px
        }
        cursor: pointer;
        transition: 0.1s all ease-in-out;
        transform: rotate(145deg);
        &:hover {
          transform: rotate(45deg);
        }
      }
    }
    .basic-info-part {
      padding: 5px 10px;
      margin: 0 15px;
      &.bp-group {
        margin-top: 20px;
        border-radius: 5px;
        border: solid #ccc 1px;
        cursor: pointer;
        &.active {
          background: #fff
        }
      }
    }
  }
</style>
<template>
  <div class="basic-info" v-show="show" :style="'z-index:'+(showClose?2:1)">
    <h3 v-show="showClose"><span class="pull-right btn-close" @click="close"><i
      class="iconfont icon-plus"></i> </span>收货详情</h3>
    <div class="basic-info-part">
      <el-row class="title">【货品信息】</el-row>
      <oms-row label="货品" :span="spanNum" class="row-black">{{ info.name }}</oms-row>
      <oms-row label="数量" :span="spanNum" class="row-black">{{ info.aggregateQuantity }}</oms-row>
      <oms-row label="批号" :span="spanNum" class="row-black">{{ info.batchNumber }}</oms-row>
      <oms-row label="包装数量" :span="spanNum" class="row-black">
        {{ info.packageCount }}
        <dict :dict-group="'shipmentPackingUnit'" :dict-key="info.packageUint"></dict>
      </oms-row>
      <oms-row label="散件数量" :span="spanNum" class="row-black">{{ info.basicPackingCount }}</oms-row>
    </div>

    <div class="basic-info-part bp-group" :class="{'active':active===0}" @click="changeStoreType(0)"
         v-show="info.packageUint">
      <el-row class="title">【整装信息】</el-row>
      <oms-row label="尺寸" :span="spanNum" class="row-black">长{{ info.length }}x宽{{ info.width }}x高{{ info.height }} m
      </oms-row>
      <oms-row label="体积" :span="spanNum" class="row-black">{{ info.volume }} m<sup>3</sup></oms-row>
      <div>
        【已选库位】
      </div>
      <oms-row :label="store.name" :span="spanNum" class="row-black" v-for="store in info.aslist" :key="store.id">
        {{store.num}}
      </oms-row>
    </div>

    <div class="basic-info-part bp-group" :class="{'active':active===1}" @click="changeStoreType(1)"
         v-show="info.basicPackingCount">
      <el-row class="title">【散装信息】</el-row>
      <oms-row label="尺寸" :span="spanNum" class="row-black">长{{ info.partLength }}x宽{{ info.partWidth
        }}x高{{ info.partHeight }} cm
      </oms-row>
      <oms-row label="体积" :span="spanNum" class="row-black">{{ info.partVolume }} cm<sup>3</sup></oms-row>
      <div>
        【已选库位】
      </div>
      <oms-row :label="store.name" :span="spanNum" class="row-black" v-for="store in info.bslist" :key="store.id">
        {{store.num}}
      </oms-row>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      info: Object,
      show: Boolean,
      showClose: Boolean
    },
    data() {
      return {
        spanNum: 8,
        order: {},
        active: 0
      };
    },
    mounted() {

    },
    watch: {
      info(val) {
        this.active = val.packageUint ? 0 : 1;
      }
    },
    methods: {
      changeStoreType: function (type) {
        this.active = type;
        this.$emit('change-type', type);
      },
      close: function () {
        this.$emit('close');
      }
    }
  };
</script>
