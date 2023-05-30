<style lang="scss" scoped>
    .parties{
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
<template>
    <card-box v-show="orderList.length" title="未签收订单">
      <el-row :gutter="15"  class="list-item"  type="flex">
        <el-col :span="6" >订单号/货主</el-col>
        <el-col :span="4" >业务类型</el-col>
        <el-col :span="6" >来源订单号/供货单位</el-col>
        <el-col :span="4" >时间</el-col>
        <el-col :span="4" >状态</el-col>
      </el-row>
      <div v-if="!orderList.length" class="no-info">
        暂无未签收订单
      </div>
      <el-row v-for="(item, index) in orderList" v-if="orderList.length" :key="item.id" :gutter="15" class="list-item"
              type="flex" >
        <el-col :span="6">
          <div>{{item.orderNo}}</div>
          <div>{{item.orgName}}</div>
        </el-col>
        <el-col :span="4">
            <dict :dict-key="item.bizType" dict-group="bizInType"></dict>
        </el-col>
        <el-col :span="6">
          <div>{{item.thirdPartyNumber}}</div>
          <div>{{item.transactOrgName}}</div>
        </el-col>
        <el-col :span="4">
          {{ item.createTime | date}}
        </el-col>
        <el-col :span="4">
            {{formastState(item.state)}}
        </el-col>
      </el-row>
    </card-box>
  </template>
  <script>
  import {erpOrder} from '@/resources';
  
  export default {
    data: function () {
      return {
        orderList: []
      };
    },
    mounted() {
      this.getOrderList();
    },
    watch: {
      level() {
        this.getOrderList();
      }
    },
    methods: {
      getOrderList: function () {
        let param = Object.assign({}, this.filters, {
            "bizType": "1-0", //单据业务类型【采购入库】
            // "stateList": ["6","7","10"]
        });
        erpOrder.queryNotSignedOrder(param).then(res => {
          this.orderList = res.data;
        });
      },
      formastState(val){
        if(val == 6){
            return '待审单'
        }else if(val == 7){
            return '执行中'
        }else if(val == 10){
            return '待到货'
        }
      }
    }
  };
  </script>
  