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
</style>
<template>
  <div class="order-page">
    <div class="container">
      <div class="mb-15" style="overflow: hidden">
        <perm label="demand-assignment-create">
          <el-button class="pull-right" type="primary" @click="submit">提交分配方案</el-button>
        </perm>
      </div>
      <div class="order-list clearfix ">
        <el-row class="order-list-header" :gutter="10">
          <el-col :span="5">疫苗</el-col>
          <el-col :span="3">需求数</el-col>
          <el-col :span="3">库存数</el-col>
          <el-col :span="4">库存差额</el-col>
          <el-col :span="4">调配后剩余库存</el-col>
          <el-col :span="2">状态</el-col>
          <el-col :span="3">操作</el-col>
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
               :class="[{'active':currentItemId==item.id}]">
            <el-row>
              <el-col :span="5" class="R pt">
                <span>{{ item.goodsName }}</span>
              </el-col>
              <el-col :span="3" class="pt">
                <span>{{ item.requiredQuantity }}</span>
              </el-col>
              <el-col :span="3" class="pt">
                <span>{{ item.inventoryQuantity }}</span>
              </el-col>
              <el-col :span="4" class="pt">
                <span>{{ item.balanceAmount }}</span>
              </el-col>
              <el-col :span="4" class="pt">
                <span>{{ item.resultAmount }}</span>
              </el-col>
              <el-col :span="2" class="pt">
                <span v-show="item.resultAmount>-1 ">
                  <i class="iconfont icon-correct color-blue"></i>
                  正常
                </span>
                <span v-show="item.resultAmount<0 ">
                  <i class="iconfont icon-warning color-red"></i>
                  库存不足
                </span>
              </el-col>
              <el-col :span="3">
                <span>
                    <a href="#" class="btn-circle" @click.prevent="showPart(item)"><i
                      class="iconfont icon-detail"></i></a>
                  手动分配
                </span>
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

    <page-right :show="showRight" @right-close="resetRightBox" :css="{'width':'1100px','padding':0}">
      <allot-form :currentItem="currentItem" @change="change" @close="resetRightBox"></allot-form>
    </page-right>
  </div>
</template>
<script>
  import { demandAssignment } from '@/resources';
  import allotForm from './form.vue';

  export default {
    components: {
      allotForm
    },
    data () {
      return {
        loadingData: false,
        allocationList: [],
        showRight: false,
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 15
        },
        currentItemId: '',
        currentItem: {}
      };
    },
    mounted () {
      this.queryAllocationList();
    },
    methods: {
      queryAllocationList (pageNo) { // 得到需求分配列表
        this.allocationList = [];
        if (!this.$route.query.id) return;
        this.pager.currentPage = pageNo;
        this.loadingData = false;
        demandAssignment.queryDetailList(this.$route.query.id).then(res => {
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
