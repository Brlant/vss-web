<template>
  <div class="order-page">
    <div class="container">
      <div class="order-list-status container">
        <div v-for="(item,key) in inventoryType" :class="{'active':key===activeStatus}"
             class="status-item" @click="checkStatus(item, key)">
          <div :class="['b_color_'+key]" class="status-bg"></div>
          <div><i v-if="key===activeStatus" class="el-icon-caret-right"></i>{{ item.title }}
            <span class="status-num">{{ item.num }}</span>
          </div>
        </div>
        <div class="btn-group-right opera-btn">
          <perm label="erp-stock-inventory-export">
             <span @click.stop.prevent="exportExcel">
              <a class="btn-circle ml-15" href="#">
                <i class="el-icon-t-export"></i>
              </a>导出Excel
            </span>
          </perm>
          <span @click.stop.prevent="$router.back()">
            <a class="btn-circle ml-15" href="#">
              <i class="el-icon-back"></i>
            </a>返回
          </span>
        </div>
      </div>
      <div class="order-list clearfix" style="margin-top: 20px">
        <el-row class="order-list-header">
          <el-col :span="7">疫苗</el-col>
          <el-col :span="5">批号</el-col>
          <el-col :span="4">数量</el-col>
          <el-col :span="4">盘点数量</el-col>
          <el-col :span="1">状态</el-col>
          <el-col :span="3">操作</el-col>
        </el-row>
        <el-row v-if="loadingData">
          <oms-loading :loading="loadingData"></oms-loading>
        </el-row>
        <el-row v-else-if="!inventories.length">
          <div class="empty-info">暂无信息</div>
        </el-row>
        <div v-else class="order-list-body flex-list-dom">
          <div v-for="item in inventories"
               :class="['status-'+ filterListColor(item.status),{'active':currentOrderId===item.id}]"
               class="order-list-item"
               @click.prevent="currentOrderId = item.id">
            <el-row>
              <el-col :span="7">{{ item.orgGoodsName }}</el-col>
              <el-col :span="5">{{ item.batchNumber }}</el-col>
              <el-col :span="4">
                {{ item.inventoryCount }}
                <dict :dict-group="'measurementUnit'" :dict-key="item.goodsUnit"></dict>
                <!--({{item.packageCount}}<dict :dict-group="'measurementUnit'" :dict-key="item.measurementUnit"></dict>-->
                <!--/<dict :dict-group="'shipmentPackingUnit'" :dict-key="item.unit"></dict>)-->
              </el-col>
              <el-col :span="4">
                <el-input v-show="isShow()" v-model.number="item.actualCount"
                          :disabled="item.status===3||item.status===4" @blur="onSubmit(item)"
                          @change="changeCount(item)">
                  <template slot="append">
                    <dict :dict-group="'measurementUnit'" :dict-key="item.goodsUnit"></dict>
                  </template>
                </el-input>
                <span v-show="!isShow()">{{ item.actualCount }}</span>
              </el-col>
              <el-col :span="1" style="padding-top: 5px">
                <el-tag v-show="item.status === 0" type="warning">待操作</el-tag>
                <el-tag v-show="item.status === 1" type="success">正常</el-tag>
                <el-tag v-show="item.status === 2" type="danger">异常</el-tag>
                <el-tag v-show="item.status === 3" type="success">已盘盈</el-tag>
                <el-tag v-show="item.status === 4" type="danger">已盘亏</el-tag>
              </el-col>
              <el-col :span="3">
<!--                <perm label="erp-stock-inventory-check">-->
<!--                  <el-button v-show="item.status === 2" :disabled="item.checking" type="default"-->
<!--                             @click.stop="check(item)">-->
<!--                    {{ item.actualCount > item.inventoryCount ? '盘盈' : '盘亏' }}-->
<!--                  </el-button>-->
<!--                </perm>-->
<!--                <perm label="erp-stock-inventory-check">-->
                  <el-button v-show="item.status === 2" :disabled="item.checking" type="default"
                             @click.stop="check(item)">
                    {{ item.actualCount > item.inventoryCount ? '盘盈' : '盘亏' }}
                  </el-button>
<!--                </perm>-->
              </el-col>
            </el-row>
            <div class="order-list-item-bg"></div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="inventories.length && !loadingData" class="text-center">
      <el-pagination :current-page="pager.currentPage" :page-size="20"
                     :page-sizes="[10,20,50,100]"
                     :total="pager.count" layout="total, sizes, prev, pager, next, jumper"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import {Inventory} from '@/resources';
import utils from '@/tools/utils';

export default {
  data() {
    return {
      activeStatus: '0', // 当前状态
      loadingData: false,
      showWavePart: false, // 是否显示批次信息
      showSearch: false,
      inventories: [],
      currentOrderId: '',
      isCheckAll: false,
      inventoryType: utils.inventoryType,
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10
      },
      filters: {
        status: 0
      }
    };
  },
  mounted() {
    this.getOrders(1);
  },
  watch: {
    filters: {
      handler: function () {
        this.getOrders(1);
      },
      deep: true
    }
  },
  methods: {
    check(item) {
      if (!item) {
        return;
      }
      this.$confirm(`确定进行${item.action}作业`, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        item.checking = true;
        this.$http.post('/erp-order/inventory/create-order', {stockInventoryDetailId: item.id}).then(res => {
          this.$notify.success({
            message: item.action+"作业成功"
          });
          item.checking = false;
          item.status = item.action === '盘盈' ? 3 : 4;
        }).catch(error => {
          item.checking=false;
          this.$notify.error({
            message: error.response && error.response.data && error.response.data.msg || item.action+'作业失败'
          });
        });
      });
    },
    changeCount(item) {
      if (item.actualCount > item.inventoryCount) {
        item.action = '盘盈';
      }
      if (item.actualCount < item.inventoryCount) {
        item.action = '盘亏';
      }
    },
    checkStatus(item, key) {
      this.activeStatus = key;
      this.filters.status = item.status;
    },
    exportExcel() {
      this.$store.commit('initPrint', {isPrinting: true, moduleId: this.$route.path});
      this.$http.get(`/erp-inventory/${this.$route.query.id}/detail/export`).then(res => {
        utils.download(res.data.path, '库存盘点详情');
        this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path});
      }).catch(error => {
        this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path});
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '导出失败'
        });
      });
    },
    getOrders(pageNo) { // 查询盘点作业列表
      let id = this.$route.query.id;
      if (!id) return;
      this.pager.currentPage = pageNo;
      let params = Object.assign({}, {
        pageNo: pageNo,
        pageSize: this.pager.pageSize
      }, this.filters);
      this.loadingData = true;
      this.inventories=[];
      Inventory.queryDetail(id, params).then(res => {
        this.loadingData = false;
        res.data.list.forEach(v => {
          this.inventories.push(Object.assign({}, v, {action: '', checking: false}))
        });
        this.inventories.forEach(v => {
          this.changeCount(v);
        })
        this.pager.count = res.data.count;
      });
      this.queryStatusNum();
    },
    queryStatusNum() {
      let id = this.$route.query.id;
      let params = Object.assign({}, this.filters);
      Inventory.queryStatusNum(id, params).then(res => {
        this.inventoryType[0].num = res.data['all'];
        this.inventoryType[1].num = res.data['no-operation'];
        this.inventoryType[2].num = res.data['normal'];
        this.inventoryType[3].num = res.data['exception'];
        this.inventoryType[4].num = res.data['inventorySurplus'];
        this.inventoryType[5].num = res.data['dishDeficientOutbound'];
      });
    },
    filterListColor: function (index) {// 过滤左边列表边角颜色
      let status = -1;
      for (let key in this.inventoryType) {
        if (this.inventoryType[key].status === index) {
          status = key;
        }
      }
      return status;
    },
    isShow() {
      return this.$store.state.permissions.indexOf('erp-stock-inventory-operate') !== -1;
    },
    setStatus(item) {
      let s = item.actualCount - item.inventoryCount;
      item.status = s === 0 ? 1 : 2;
    },
    onSubmit(item) {
      if (item.actualCount === null || item.actualCount === '') return;
      let obj = {
        id: item.id,
        actualCount: item.actualCount
      };
      Inventory.editDetailCount(item.id, obj).then(() => {
        this.$notify.success({
          title: '完成盘点',
          message: `批号为${item.batchNumber}的疫苗实盘数量为${item.actualCount}`
        });
        this.setStatus(item);
      }).catch(error => {
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '盘点失败'
        });
      });
    },
    handleSizeChange(val) {
      this.pager.pageSize = val;
      window.localStorage.setItem('currentPageSize', val);
      this.getOrders(1);
    },
    handleCurrentChange(val) {
      this.getOrders(val);
    }
  }
};
</script>
