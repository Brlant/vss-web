<style lang="less" scoped="">
  .advanced-query-form {
    .el-select {
      display: block;
      position: relative;
    }
    .el-date-editor.el-input {
      width: 100%;
    }
    padding-top: 20px;
  }

  .R {
    word-wrap: break-word;
    word-break: break-all;
  }

  .pt {
    padding-top: 8px;
  }

  .good-selects {
    .el-select-dropdown__item {
      font-size: 14px;
      padding: 8px 10px;
      position: relative;
      white-space: normal;
      overflow: hidden;
      text-overflow: ellipsis;
      color: rgb(72, 94, 106);
      height: auto;
      width: 300px;
      line-height: 1.5;
      box-sizing: border-box;
      cursor: pointer;
    }
  }

  .align-word {
    letter-spacing: 1em;
    margin-right: -1em;
  }

  .color-blue {
    color: #00ff00;
  }

  .color-red {
    color: red;
  }

  .order-list-item {
    cursor: pointer;
  }
</style>
<template>
  <div class="order-page">
    <div class="container">
      <div class="order-list-status container" style="margin-bottom:20px">
        <div class="status-item"
             :class="{'active':key==activeStatus,'exceptionPosition':key == 11}"
             v-for="(item,key) in waveType"
             @click="changeStatus(item,key)">
          <div class="status-bg" :class="['b_color_'+key]"></div>
          <div>{{item.title}}<span class="status-num">{{item.num}}</span></div>
        </div>
      </div>
      <div class="order-list clearfix ">
        <el-row class="order-list-header" :gutter="10">
          <el-col :span="8">创建人</el-col>
          <el-col :span="8">创建时间</el-col>
          <el-col :span="4">状态</el-col>
        </el-row>
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-else-if="allocationList.length == 0">
          <el-col :span="24">
            <div class="empty-info">
              暂无信息
            </div>
          </el-col>
        </el-row>
        <div v-else="" class="order-list-body">
          <div class="order-list-item order-list-item-bg" v-for="item in allocationList"
               :class="[{'active':currentItemId==item.id}]" @click="showDetail(item)">
            <el-row>
              <el-col :span="8" class="R pt">
                <span>{{ item.createName }}</span>
              </el-col>
              <el-col :span="8" class="pt">
                <span>{{ item.createTime | date}}</span>
              </el-col>
              <el-col :span="4" class="pt">
                <span>{{ item.status === 0 ? '未完成' : '已完成' }}</span>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div class="text-center" v-show="pager.count>pager.pageSize && !loadingData">
        <el-pagination
          layout="prev, pager, next"
          :total="pager.count" :pageSize="pager.pageSize" @current-change="queryAllocationList"
          :current-page="pager.currentPage">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import { demandAssignment } from '@/resources';
  import utils from '@/tools/utils';

  export default {

    data () {
      return {
        loadingData: false,
        allocationList: [],
        showRight: false,
        showDetailPart: false,
        waveType: utils.waveType,
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 15
        },
        filters: {
          status: ''
        },
        activeStatus: 0,
        currentItemId: '',
        currentItem: {}
      };
    },
    mounted () {
      this.queryAllocationList();
    },
    watch: {
      filters: {
        handler: function () {
          this.queryAllocationList(1);
        },
        deep: true
      }
    },
    methods: {
      queryAllocationList (pageNo) { // 得到需求分配列表
        this.allocationList = [];
        this.pager.currentPage = pageNo;
        this.loadingData = false;
        let params = Object.assign({}, this.filters);
        demandAssignment.query(params).then(res => {
          this.allocationList = res.data.list;
          this.pager.count = res.data.count;
          this.loadingData = false;
        });
      },
      resetRightBox () {
        this.showRight = false;
      },
      showPart (item) {
        this.currentItem = item;
        this.showRight = true;
      },
      change (item, count) {
        this.allocationList.forEach(i => {
          if (i.orgGoodsId === item.orgGoodsId) {
            i.resultAmount = i.inventoryQuantity - count;
          }
        });
      },
      showDetail (item) {
        this.$router.push({path: '/purchase/pov/allocation', query: {id: item.id, status: 1}});
      },
      changeStatus: function (item, key) {// 订单分类改变
        this.activeStatus = key;
        this.filters.status = item.status;
      },
      submit () {
        let isNotNormal = this.allocationList.some(s => s.resultAmount < 0);
        if (isNotNormal) {
          this.$notify.info({
            message: '库存不足，请重新分配'
          });
          return;
        }
        demandAssignment.createOrder(this.$route.query.id).then(() => {
          this.$notify.success({
            message: '提交分配方案成功'
          });
        }).catch(error => {
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '提交分配方案失败'
          });
        });
      }
    }

  };
</script>
