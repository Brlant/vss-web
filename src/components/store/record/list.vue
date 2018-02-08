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

      <div class="opera-btn-group" :class="{up:!showSearch}">
        <div class="opera-icon">
          <span class="">
            <i class="el-icon-t-search"></i> 筛选查询
          </span>
          <perm label="cerp-stock-status-adjust-insert">
             <span class="pull-right cursor-span" style="margin-left: 10px" @click.prevent="add">
            <a href="#" class="btn-circle" @click.stop.prevent="add">
                        <i class="el-icon-t-plus"></i>
             </a>
          </span>
          </perm>

          <span class="pull-right switching-icon" @click="showSearch = !showSearch">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
        </div>
        <el-form class="advanced-query-form clearfix" onsubmit="return false">
          <el-col :span="8">
            <oms-form-row label="货主货品" :span="5">
              <el-select filterable remote placeholder="请输入名称搜索货主货品" :remote-method="filterOrgGoods"
                         :clearable="true"
                         v-model="filters.orgGoodsId" popper-class="good-selects">
                <el-option :value="org.id" :key="org.id" :label="org.goodsName"
                           v-for="org in orgGoods">
                  <div style="overflow: hidden">
                    <span class="pull-left">{{org.goodsName}}</span>
                  </div>
                  <div style="overflow: hidden">
                      <span class="select-other-info pull-left"><span
                        v-show="org.goodsNo">货品编号:</span>{{org.goodsNo}}
                      </span>
                    <span class="select-other-info pull-left"><span
                      v-show="org.saleFirmName">供货厂商:</span>{{ org.saleFirmName }}
                      </span>
                  </div>
                </el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="6">
            <oms-form-row label="批号" :span="3">
              <el-select v-model="filters.batchNumberId" filterable clearable remote
                         :remoteMethod="filterBatchNumber" placeholder="请输入批号名称搜索批号">
                <el-option v-for="item in batchNumberList" :value="item.id" :key="item.id"
                           :label="item.batchNumber">
                  {{ item.batchNumber }}
                </el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="10">
            <oms-form-row label="创建时间" :span="5">
              <el-col :span="24">
                <el-date-picker
                  v-model="expectedTime"
                  type="datetimerange"
                  placeholder="请选择">
                </el-date-picker>
              </el-col>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row label="" :span="5">
              <el-button type="primary" native-type="submit" @click="searchInOrder">查询</el-button>
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
          <el-col :span="2">原状态</el-col>
          <el-col :span="3">新状态</el-col>
          <el-col :span="2">数量</el-col>
          <el-col :span="4">货主货品名称</el-col>
          <el-col :span="3">批号</el-col>
          <el-col :span="3">创建人</el-col>
          <el-col :span="4">创建时间</el-col>
          <el-col :span="3">调整理由</el-col>
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
          <div class="order-list-item order-list-item-bg" v-for="item in materials"
               :class="[{'active':currentId==item.id}]">
            <el-row>
              <el-col :span="2">{{ adjustTypeList[item.oldStatus] }}</el-col>
              <el-col :span="3">{{ adjustTypeList[item.newStatus] }}</el-col>
              <el-col :span="2" class="R">{{ item.count }}</el-col>
              <el-col :span="4">{{ item.goodsName }}</el-col>
              <el-col :span="3">{{ item.batchNumber }}</el-col>
              <el-col :span="3" class="R">{{ item.createdName }}</el-col>
              <el-col :span="4">{{ item.createTime | time}}</el-col>
              <el-col :span="3">{{ item.reason}}</el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div class="text-center" v-show="pager.count>pager.pageSize && !loadingData">
        <el-pagination
          layout="total,prev, pager, next, jumper"
          :total="pager.count" :pageSize="pager.pageSize" @current-change="getMaPage"
          :current-page="pager.currentPage">
        </el-pagination>
      </div>
    </div>
    <page-right :show="showPart" @right-close="resetRightBox"
                :css="{'width':'1000px','padding':0}">
      <form-part :formItem="form" @close="resetRightBox" @refresh="refresh"></form-part>
    </page-right>
  </div>
</template>
<script>
  import formPart from './form.vue';
  import { Address, BaseInfo, erpStock, http } from '@/resources';

  export default {
    components: {formPart},
    data () {
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
    mounted () {
      this.getMaPage(1);
    },
    methods: {
      resetRightBox: function () {
        this.showPart = false;
      },
      getMaPage (pageNo) { // 得到波次列表
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
      refresh () {
        this.getMaPage(1);
        this.showPart = false;
      },
      searchInOrder: function () {// 搜索
        this.filters.startTime = this.formatTime(this.expectedTime[0]);
        this.filters.endTime = this.formatTime(this.expectedTime[1]);
        this.getMaPage(1);
      },
      formatTime (date) {
        return date ? this.$moment(date).format('YYYY-MM-DD HH:MM:ss') : '';
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
      filterOrgGoods (query) {
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
      orgGoodsChange (val) {
        this.filters.batchNumberId = '';
        this.batchNumberList = [];
        this.filterBatchNumber();
      },
      filterBatchNumber (query) {
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
      queryOrgWarehouse () {
        let param = Object.assign({}, {
          deleteFlag: false,
          auditedStatus: '1'
        });
        Address.queryAddress(param).then(res => {
          this.warehouses = res.data;
        });
      },
      add () {
        this.form = {};
        this.showPart = true;
      }
    }
  };
</script>
