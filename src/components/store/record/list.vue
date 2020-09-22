<style lang="scss" scoped="">
@import "../../../assets/mixins";

.btn-color {
  a:hover {
    color: $activeColor;
  }
}

.d-table > div.d-table-right {
  padding: 10px 20px;
}

.container {
  padding-left: 10px;
  padding-right: 10px;
}
</style>
<template>
  <div class="order-page">
    <div class="container">

      <div :class="{up:!showSearch}" class="opera-btn-group">
        <div class="opera-icon">
          <perm class="switching-icon" label="cerp-stock-status-adjust-insert">
             <span class="pull-right cursor-span" style="margin-left: 10px" @click.prevent="add">
            <a class="btn-circle" href="#" @click.stop.prevent="add">
                        <i class="el-icon-t-plus"></i>
             </a>添加
          </span>
          </perm>

          <span class="pull-left switching-icon" @click="showSearch = !showSearch">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
        </div>
        <el-form class="advanced-query-form clearfix" onsubmit="return false">
          <el-col :span="8">
            <oms-form-row :span="5" label="货主疫苗">
              <el-select v-model="filters.orgGoodsId" :clearable="true" :remote-method="filterOrgGoods" filterable
                         placeholder="请输入名称或编号搜索货主疫苗" popper-class="good-selects"
                         remote @change="orgGoodsChange">
                <el-option v-for="org in orgGoods" :key="org.id" :label="org.goodsName"
                           :value="org.id">
                  <div style="overflow: hidden">
                    <span class="pull-left">{{org.goodsName}}</span>
                  </div>
                  <div style="overflow: hidden">
                      <span class="select-other-info pull-left"><span
                        v-show="org.goodsNo">货主货品编号:</span>{{org.goodsNo}}
                      </span>
                    <span class="select-other-info pull-left"><span
                      v-show="org.saleFirmName">供货单位:</span>{{ org.saleFirmName }}
                      </span>
                  </div>
                </el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="6">
            <oms-form-row :span="4" label="批号">
              <el-select v-model="filters.batchNumberId" :remoteMethod="filterBatchNumber" clearable filterable
                         placeholder="请输入批号名称搜索批号" remote>
                <el-option v-for="item in batchNumberList" :key="item.id" :label="item.batchNumber"
                           :value="item.id">
                  {{ item.batchNumber }}
                </el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="10">
            <oms-form-row :span="5" label="创建时间">
              <el-col :span="24">
                <el-date-picker
                  v-model="expectedTime"
                  placeholder="请选择"
                  type="daterange">
                </el-date-picker>
              </el-col>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row :span="5" label="">
              <el-button native-type="submit" type="primary" @click="searchInOrder">查询</el-button>
              <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
            </oms-form-row>
          </el-col>
          <!--<el-col :span="12">-->
          <!--<oms-form-row label="仓库" :span="3">-->
          <!--<el-select v-model="filters.warehouseId" filterable clearable-->
          <!--@change="warehouseChange"-->
          <!--placeholder="请选择仓库">-->
          <!--<el-option v-for="item in warehouses" :value="item.id" :key="item.id"-->
          <!--:label="item.name">-->
          <!--</el-option>-->
          <!--</el-select>-->
          <!--</oms-form-row>-->
          <!--</el-col>-->

        </el-form>
      </div>

      <div class="order-list clearfix " style="margin-top: 10px">
        <el-row class="order-list-header">
          <el-col :span="5">货主疫苗名称</el-col>
          <el-col :span="3">批号</el-col>
          <el-col :span="2">原状态</el-col>
          <el-col :span="3">新状态</el-col>
          <el-col :span="2">数量</el-col>
          <el-col :span="3">调整理由</el-col>
          <el-col :span="2">创建人</el-col>
          <el-col :span="4">创建时间</el-col>
        </el-row>
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-else-if="materials.length == 0">
          <el-col :span="24">
            <div class="empty-info">
              暂无信息
            </div>
          </el-col>
        </el-row>
        <div v-else="" class="order-list-body flex-list-dom">
          <div v-for="item in materials" :class="[{'active':currentId==item.id}]"
               class="order-list-item order-list-item-bg">
            <el-row>
              <el-col :span="5">{{ item.goodsName }}</el-col>
              <el-col :span="3">{{ item.batchNumber }}</el-col>
              <el-col :span="2">{{ adjustTypeList[item.oldStatus] }}</el-col>
              <el-col :span="3">{{ adjustTypeList[item.newStatus] }}</el-col>
              <el-col :span="2" class="R">{{ item.count }}{{item.measurementUnit}}</el-col>
              <el-col :span="3">{{ item.reason}}</el-col>
              <el-col :span="2" class="R">{{ item.createdName }}</el-col>
              <el-col :span="4">{{ item.createTime | time}}</el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div v-show="pager.count>pager.pageSize && !loadingData" class="text-center">
        <el-pagination
          :current-page="pager.currentPage"
          :pageSize="pager.pageSize" :total="pager.count" layout="total,prev, pager, next, jumper"
          @current-change="getMaPage">
        </el-pagination>
      </div>
    </div>
    <page-right :css="{'width':'1000px','padding':0}" :show="showPart"
                @right-close="resetRightBox">
      <form-part :formItem="form" @close="resetRightBox" @refresh="refresh"></form-part>
    </page-right>
  </div>
</template>
<script>
import formPart from './form.vue';
import {Address, http} from '@/resources';

export default {
  components: {formPart},
  data() {
    return {
      loadingData: false,
      showSearch: false,
      showPart: false,
      materials: [],
      filters: {
        batchNumberId: '',
        orgGoodsId: '',
        warehouseId: '',
        startTime: '',
        endTime: ''
      },
      expectedTime: '',
      batchNumberList: [],
      warehouses: [],
      orgGoods: [],
      form: {},
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: 15
      },
      currentId: '',
      adjustTypeList: ['可用库存', '锁定库存', '实际不合格库存']
    };
  },
  mounted() {
    this.getMaPage(1);
  },
  methods: {
    resetRightBox: function () {
      this.showPart = false;
    },
    getMaPage(pageNo) { // 得到波次列表
      this.pager.currentPage = pageNo;
      let params = Object.assign({
        pageNo: pageNo,
        pageSize: this.pager.pageSize
      }, this.filters);
      this.loadingData = true;
      this.$http.get('/erp-stock/stock-log/pager', {params}).then(res => {
        this.materials = res.data.list;
        this.pager.count = res.data.count;
        this.loadingData = false;
      });
    },
    refresh() {
      this.getMaPage(1);
      this.showPart = false;
    },
    searchInOrder: function () {// 搜索
      this.filters.startTime = this.$formatAryTime(this.expectedTime, 0);
      this.filters.endTime = this.$formatAryTime(this.expectedTime, 1);
      if (this.filters.startTime && this.filters.startTime === this.filters.endTime) {
        this.filters.endTime = this.filters.endTime.split(' ')[0] + ' 23:59:59';
      }
      this.getMaPage(1);
    },
    formatTime(date) {
      return date ? this.$moment(date).format('YYYY-MM-DD') + ' 00:00:00' : '';
    },
    resetSearchForm: function () {// 重置表单
      this.filters = {
        batchNumberId: '',
        orgGoodsId: '',
        warehouseId: '',
        startTime: '',
        endTime: ''
      };
      this.expectedTime = '';
      this.getMaPage(1);
    },
    filterOrgGoods(query) {
      let orgId = this.$store.state.user.userCompanyAddress;
      let params = Object.assign({}, {
        deleteFlag: false,
        orgId: orgId,
        keyWord: query
      });
      http.get('/erp-stock/goods', {params}).then(res => {
        this.orgGoods = res.data.list;
      });
    },
    orgGoodsChange(val) {
      this.filters.batchNumberId = '';
      this.batchNumberList = [];
      this.filterBatchNumber();
    },
    filterBatchNumber(query) {
      if (!this.filters.orgGoodsId) return;
      let goodsId = '';
      this.orgGoods.forEach(i => {
        if (i.id === this.filters.orgGoodsId) {
          goodsId = i.goodsId;
        }
      });
      if (!goodsId) return;
      this.$http.get('/batch-number/pager', {
        params: {
          keyWord: query,
          goodsId
        }
      }).then(res => {
        this.batchNumberList = res.data.list;
      });
    },
    queryOrgWarehouse() {
      let param = Object.assign({}, {
        deleteFlag: false,
        auditedStatus: '1'
      });
      Address.queryAddress(param).then(res => {
        this.warehouses = res.data;
      });
    },
    add() {
      this.form = {};
      this.showPart = true;
    }
  }
};
</script>
