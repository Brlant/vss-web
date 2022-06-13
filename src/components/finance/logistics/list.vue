<template>
  <div class="order-page">
    <div class="container">
      <div :class="{up:!showSearch}" class="opera-btn-group">
        <div class="opera-icon">
          <span class="pull-left switching-icon" @click="showSearch = !showSearch">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
        </div>
        <el-form v-show="showSearch" class="advanced-query-form clearfix" onsubmit="return false"
                 style="padding-top: 10px">
          <el-row>
            <!--<el-col :span="8">-->
            <!--<oms-form-row label="订单号" :span="6">-->
            <!--<el-input v-model="filters.orderNo"></el-input>-->
            <!--</oms-form-row>-->
            <!--</el-col>-->
            <!--<el-col :span="8">-->
            <!--<oms-form-row label="疾控疫苗" :span="6">-->
            <!--<el-select filterable remote placeholder="请输入名称搜索疾控疫苗" :remote-method="getGoodsList" :clearable="true"-->
            <!--v-model="filters.orgGoodsId" popper-class="good-selects">-->
            <!--<el-option :value="item.orgGoodsDto.id" :key="item.orgGoodsDto.id" :label="item.orgGoodsDto.name"-->
            <!--v-for="item in goodses">-->
            <!--<div style="overflow: hidden">-->
            <!--<span class="pull-left">{{item.orgGoodsDto.name}}</span>-->
            <!--</div>-->
            <!--<div style="overflow: hidden">-->
            <!--<span class="select-other-info pull-left"><span-->
            <!--v-show="item.orgGoodsDto.goodsNo">货主货品编号</span>  {{item.orgGoodsDto.goodsNo}}-->
            <!--</span>-->
            <!--<span class="select-other-info pull-left"><span-->
            <!--v-show="item.orgGoodsDto.salesFirmName">供货单位</span>  {{ item.orgGoodsDto.salesFirmName }}-->
            <!--</span>-->
            <!--</div>-->
            <!--</el-option>-->
            <!--</el-select>-->
            <!--</oms-form-row>-->
            <!--</el-col>-->
            <el-col :span="8">
              <oms-form-row :span="5" label="物流厂商">
                <el-select v-model="filters.factoryId" :clearable="true" :remote-method="filterFactory" filterable
                           placeholder="请输入名称搜索厂商"
                           popperClass="good-selects"
                           remote @click.native="filterFactory('')">
                  <el-option v-for="org in factories" :key="org.id" :label="org.name" :value="org.id">
                    <div style="overflow: hidden">
                      <span class="pull-left" style="clear: right">{{org.name}}</span>
                    </div>
                    <div style="overflow: hidden">
                      <span class="select-other-info pull-left">
                        <span>系统代码:</span>{{org.manufacturerCode}}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="6" label="出入库时间">
                <el-date-picker
                  v-model="aryTime"
                  format="yyyy-MM-dd"
                  placeholder="请选择" type="daterange">
                </el-date-picker>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <el-row style="text-align: left;padding-left: 20px">
                <el-button native-type="submit" type="primary" @click="searchInOrder">查询</el-button>
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
              </el-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="order-list clearfix " style="margin-top: 10px">
        <el-row class="order-list-header">
          <!--<el-col :span="4">疫苗</el-col>-->
          <!--<el-col :span="2">疫苗类型</el-col>-->
          <el-col :span="6">采购（退）订单</el-col>
          <el-col :span="6">物流厂商</el-col>
          <el-col :span="4">数量</el-col>
          <el-col :span="4">物流费用</el-col>
          <el-col :span="4">出入库时间</el-col>
        </el-row>
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-else-if="bills.length == 0">
          <el-col :span="24">
            <div class="empty-info">
              暂无信息
            </div>
          </el-col>
        </el-row>
        <div v-else class="order-list-body flex-list-dom">
          <div v-for="item in bills" :key="" class="order-list-item order-list-item-bg">
            <el-row>
              <!--<el-col :span="4" class="R pt10">-->
              <!--{{ item.goodsName }}-->
              <!--</el-col>-->
              <!--<el-col :span="2" class="R pt10">-->
              <!--<dict :dict-group="'vaccineSign'" :dict-key="item.vaccineType"></dict>-->
              <!--</el-col>-->
              <el-col :span="6" class="R pt10">
                {{ item.orderNo }}
              </el-col>
              <el-col :span="6" class="R pt10">
                {{ item.factoryName }}
              </el-col>
              <el-col :span="4" class="R pt10">
                {{ item.receiptCount }}
              </el-col>
              <el-col :span="4" class="R pt10 ">
                <span v-show="item.price">￥</span>{{ item.price | formatMoney}}
              </el-col>
              <el-col :span="4" class="R pt10 ">
                {{ item.arriveTime | date }}
              </el-col>
            </el-row>
          </div>
          <el-row v-show="bills.length" class="order-list-item order-list-item-bg">
            <el-col :span="6">合计</el-col>
            <el-col :span="6"></el-col>
            <el-col :span="4" style="padding-left: 5px">{{ totalBill.count }}</el-col>
            <el-col :span="4" style="padding-left: 5px">￥{{ totalBill.money | formatMoney }}</el-col>
            <el-col :span="4"></el-col>
          </el-row>
        </div>
      </div>
      <div v-show="pager.count>pager.pageSize && !loadingData" class="text-center">
        <el-pagination
          :current-page="pager.currentPage"
          :pageSize="pager.pageSize" :total="pager.count" layout="prev, pager, next"
          @current-change="queryBillPage">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import {BaseInfo, http, Vaccine} from '@/resources';

export default {
  data() {
    return {
      loadingData: true,
      showSearch: false,
      bills: [],
      filters: {
        orderNo: '',
        factoryId: '',
        orgGoodsId: '',
        arriveStartTime: '',
        arriveEndTime: ''
      },
      aryTime: '',
      factories: [], // 货主列表,
      orgId: '',
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: 15
      },
      goodses: [],
      totalBill: {}
    };
  },
  mounted() {
    this.queryBillPage(1);
  },
  methods: {
    queryBillPage(pageNo) {
      this.pager.currentPage = pageNo;
      let params = {};
      this.loadingData = true;
      params = Object.assign({}, this.filters, {
        pageNo: pageNo,
        pageSize: this.pager.pageSize
      });
      http.get('/factory-reconciliation/providers', {params}).then(res => {
        this.bills = res.data.list || [];
        this.pager.count = res.data.count;
        this.loadingData = false;
      });
      this.queryTotal(params);
    },
    queryTotal(params) {
      this.totalBill = {};
      http.get('/factory-reconciliation/providers/statistics/', {params}).then(res => {
        this.totalBill = res.data;
      });
    },
    filterFactory(query) { // 查询厂商
      let orgId = this.$store.state.user.userCompanyAddress;
      let params = {
        keyWord: query,
        relation: '3'
      };
      BaseInfo.queryOrgByValidReation(orgId, params).then(res => {
        this.factories = res.data;
      });
    },
    getGoodsList: function (query) {
      let params = Object.assign({}, {
        keyWord: query,
        deleteFlag: false
      });
      Vaccine.query(params).then(res => {
        this.goodses = res.data.list;
      });
    },
    searchInOrder: function () {// 搜索
      this.filters.arriveStartTime = this.$formatAryTime(this.aryTime, 0);
      this.filters.arriveEndTime = this.$formatAryTime(this.aryTime, 1);
      this.queryBillPage(1);
    },
    resetSearchForm: function () {// 重置表单
      this.aryTime = '';
      Object.assign(this.filters, {
        orderNo: '',
        factoryId: '',
        orgGoodsId: '',
        arriveStartTime: '',
        arriveEndTime: ''
      });
      this.queryBillPage(1);
    },
    formatTime(date) {
      return date ? this.$moment(date).format('YYYY-MM-DD') : '';
    }
  }
};
</script>
