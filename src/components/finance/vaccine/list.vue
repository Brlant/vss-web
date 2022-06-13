<style lang="scss" scoped>

</style>
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
            <el-col :span="8">
              <oms-form-row :span="5" label="订单号">
                <el-input v-model="filters.orderNo"></el-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="5" label="疫苗">
                <el-select v-model="filters.orgGoodsId" :clearable="true" :remote-method="getGoodsList" filterable placeholder="请输入名称搜索疫苗"
                           popper-class="good-selects" remote>
                  <el-option v-for="item in goodses" :key="item.orgGoodsDto.id" :label="item.orgGoodsDto.name"
                             :value="item.orgGoodsDto.id">
                    <div style="overflow: hidden">
                      <span class="pull-left">{{item.orgGoodsDto.name}}</span>
                    </div>
                    <div style="overflow: hidden">
                      <span class="select-other-info pull-left"><span
                        v-show="item.orgGoodsDto.goodsNo">货主货品编号:</span>{{item.orgGoodsDto.goodsNo}}
                      </span>
                      <span class="select-other-info pull-left"><span
                        v-show="item.orgGoodsDto.salesFirmName">供货单位:</span>{{ item.orgGoodsDto.salesFirmName }}
                      </span>
                      <span v-if="item.orgGoodsDto.goodsDto" class="select-other-info pull-left">
                          <span v-show="item.orgGoodsDto.goodsDto.factoryName">生产单位:</span>{{ item.orgGoodsDto.goodsDto.factoryName }}
                </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="5" label="供货单位">
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
            <el-col :span="10">
              <oms-form-row :span="5" label="入库时间">
                <el-col :span="24">
                  <el-date-picker
                    v-model="aryTime"
                    :default-time="['00:00:00', '23:59:59']"
                    placeholder="请选择"
                    type="datetimerange">
                  </el-date-picker>
                </el-col>
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
          <el-col :span="4">疫苗</el-col>
          <el-col :span="4">采购订单号</el-col>
          <el-col :span="4">疫苗厂商</el-col>
          <el-col :span="3">采购数量</el-col>
          <el-col :span="3">到货数量</el-col>
          <el-col :span="3">到货时间</el-col>
          <el-col :span="3">入库时间</el-col>
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
              <el-col :span="4" class="R pt10">
                {{ item.goodsName }}
              </el-col>
              <el-col :span="4" class="R pt10">
                {{ item.orderNo }}
              </el-col>
              <el-col :span="4" class="R pt10">
                {{ item.factoryName }}
              </el-col>
              <el-col :span="3" class="R pt10">
                {{ item.purchaseCount }}
              </el-col>
              <el-col :span="3" class="R pt10">
                {{ item.receiptCount }}
              </el-col>
              <el-col :span="3" class="R pt10">
                {{ item.arriveTime | date }}
              </el-col>
              <el-col :span="3">
                {{item.createTime | time}}
              </el-col>
            </el-row>
          </div>
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
import {BaseInfo, Vaccine, vaccineBills} from '@/resources';

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
      goodses: []
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
      vaccineBills.query(params).then(res => {
        this.bills = res.data.list || [];
        this.pager.count = res.data.count;
        this.loadingData = false;
      });
    },
    filterFactory(query) { // 查询厂商
      let orgId = this.$store.state.user.userCompanyAddress;
      let params = {
        keyWord: query,
        relation: '1'
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
      this.filters.arriveStartTime = this.$formatAryTime(this.aryTime, 0, 'YYYY-MM-DD HH:mm:ss');
      this.filters.arriveEndTime = this.$formatAryTime(this.aryTime, 1, 'YYYY-MM-DD HH:mm:ss');
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
