<style lang="scss" scoped="">

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

  /*.order-list-item {*/
  /*cursor: pointer;*/
  /*}*/
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
          <div><i class="el-icon-caret-right" v-if="key==activeStatus"></i>{{item.title}}<span class="status-num">{{item.num}}</span>
          </div>
        </div>
      </div>
      <div class="order-list clearfix ">
        <el-row class="order-list-header">
          <el-col :span="8">创建人</el-col>
          <el-col :span="4">创建时间</el-col>
          <el-col :span="4">状态</el-col>
          <el-col :span="6">操作</el-col>
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
        <div v-else="" class="order-list-body flex-list-dom">
          <div class="order-list-item" v-for="item in allocationList"
               :class="['status-'+filterListColor(item.status),{'active':currentItemId==item.id}]">
            <el-row>
              <el-col :span="8" class="R pt">
                <span>{{ item.createName }}</span>
              </el-col>
              <el-col :span="4" class="pt">
                <span>{{ item.createTime | minute}}</span>
              </el-col>
              <el-col :span="4" class="pt">
                <span>{{ item.status === 0 ? '未完成' : '已完成' }}</span>
              </el-col>
              <el-col :span="6" class="opera-btn">
                <div v-show="item.status === 0">
                  <div>
                    <!--<span @click.prevent="purchase(item)">-->
                    <!--<a href="#" class="btn-circle" @click.prevent=""><i-->
                    <!--class="el-icon-t-link"></i></a>-->
                    <!--规划采购-->
                    <!--</span>-->
                    <perm label="submit-purchansing-plan">
                      <span @click.prevent="showDetail(item)">
                        <a href="#" class="btn-circle" @click.prevent=""><i
                          class="el-icon-t-wave"></i></a>
                        编辑采购汇总
                      </span>
                    </perm>
                  </div>
                </div>
                <div v-show="item.status === 1">
                  <div>
                   <span @click.prevent="showDetail(item)">
                    <a href="#" class="btn-circle" @click.prevent=""><i
                      class="el-icon-t-wave"></i></a>
                    查看详情
                    </span>
                  </div>
                </div>
              </el-col>
            </el-row>
            <div class="order-list-item-bg"></div>
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
  import {demandAssignment, procurementCollect} from '@/resources';
  import utils from '@/tools/utils';

  export default {

    data() {
      return {
        loadingData: false,
        allocationList: [],
        showRight: false,
        showDetailPart: false,
        waveType: utils.purchaseAllotmentType,
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 15
        },
        filters: {
          status: 0
        },
        activeStatus: 0,
        currentItemId: '',
        currentItem: {}
      };
    },
    mounted() {
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
      queryAllocationList(pageNo) { // 得到需求分配列表
        this.allocationList = [];
        this.pager.currentPage = pageNo;
        this.loadingData = true;
        let params = Object.assign({}, this.filters);
        procurementCollect.query(params).then(res => {
          this.allocationList = res.data.list;
          this.pager.count = res.data.count;
          this.loadingData = false;
        });
        this.queryStatusNum(params);
      },
      queryStatusNum: function (params) {
        procurementCollect.queryStateNum(params).then(res => {
          let data = res.data;
          this.waveType[0].num = this.obtionStatusNum(data['unfinished']);
          this.waveType[1].num = this.obtionStatusNum(data['complete']);
        });
      },
      obtionStatusNum: function (num) {
        if (typeof num !== 'number') {
          return 0;
        }
        return num;
      },
      resetRightBox() {
        this.showRight = false;
      },
      showPart(item) {
        this.currentItem = item;
        this.showRight = true;
      },
      change(item, count) {
        this.allocationList.forEach(i => {
          if (i.orgGoodsId === item.orgGoodsId) {
            i.resultAmount = i.inventoryQuantity - count;
          }
        });
      },
      showDetail(item) {
        this.$router.push({path: '/purchase/allocation/task', query: {id: item.id}});
      },
      purchase(item) {
        this.$router.push({path: '/purchase/allocation/task', query: {id: item.id, type: 'purchase'}});
      },
      changeStatus: function (item, key) {// 订单分类改变
        this.activeStatus = key;
        this.filters.status = item.status;
      },
      filterListColor: function (index) {// 过滤左边列表边角颜色
        let status = -1;
        for (let key in this.waveType) {
          if (this.waveType[key].status === index) {
            status = key;
          }
        }
        return status;
      },
      submit() {
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
            message: error.response && error.response.data && error.response.data.msg || '提交分配方案失败'
          });
        });
      }
    }

  };
</script>
