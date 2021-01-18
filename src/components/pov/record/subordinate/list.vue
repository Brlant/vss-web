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
              <oms-form-row :span="6" label="接种时间">
                <el-col :span="24">
                  <el-date-picker
                    v-model="actualTime"
                    format="yyyy-MM-dd"
                    placeholder="请选择" type="daterange">
                  </el-date-picker>
                </el-col>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="6" label="疫苗主档">
                <el-select v-model="searchCondition.vaccineId" :clearable="true" :remote-method="searchProduct" filterable
                           placeholder="请输入名称或编号搜索疫苗主档"
                           popper-class="good-selects" remote
                           @click.native.once="searchProduct('')">
                  <el-option v-for="org in orgList" :key="org.id" :label="org.name"
                             :value="org.id">
                    <div style="overflow: hidden">
                      <span class="pull-left">
                        {{org.name}}
                      </span>
                    </div>
                    <div style="overflow: hidden">
                      <span class="select-other-info pull-left">
                        <span v-show="org.specifications">规格:</span>{{org.specifications}}
                      </span>
                      <span class="select-other-info pull-left">
                        <span v-show="org.code">货品编号:</span>{{org.code}}
                      </span>
                      <span class="select-other-info pull-left"><span
                        v-show="org.factoryName">生产单位:</span>{{ org.factoryName }}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="5" label="批号">
                <el-input v-model="searchCondition.batchNumber" placeholder="请输入批号"></el-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="7" label="接种单位名称">
                <el-select v-model="searchCondition.povId" :clearable="true" :loading="selectLoading"
                           :remote-method="filterProvide" filterable placeholder="请输入接种单位名称查询"
                           popperClass="good-selects" remote
                           @click.native.once="filterProvide('')">
                  <el-option v-for="org in provideList" :key="org.id" :label="org.name"
                             :value="org.id">
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
              <oms-form-row :span="6" label="追溯码">
                <el-col :span="24">
                  <el-input v-model="searchCondition.actualCode" placeholder="请输入追溯码"></el-input>
                </el-col>
              </oms-form-row>
            </el-col>
            <el-col :span="5">
              <oms-form-row :span="3" label="">
                <el-button native-type="submit" type="primary" @click="searchInOrder">查询</el-button>
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="order-list clearfix " style="margin-top: 10px">
        <el-row class="order-list-header">
          <el-col :span="4">接种时间/登记编号</el-col>
          <el-col :span="6">接种疫苗</el-col>
          <el-col :span="5">接种单位名称</el-col>
          <el-col :span="4">批号</el-col>
          <el-col :span="4">追溯码</el-col>
          <el-col :span="1">来源</el-col>
        </el-row>
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-else-if="CDCs.length == 0">
          <el-col :span="24">
            <div class="empty-info">
              暂无信息
            </div>
          </el-col>
        </el-row>
        <div v-else="" class="order-list-body flex-list-dom">
          <div v-for="item in CDCs" :key="" class="order-list-item order-list-item-bg">
            <el-row>
              <el-col :span="4" class="R pt10">
                {{ item.actualTime | minute}}
                <div>
                  <el-tooltip class="item" content="登记编号" effect="dark" placement="right">
                    <span class="font-gray">{{ item.inoculatorNumber }}</span>
                  </el-tooltip>
                </div>
              </el-col>
              <el-col :span="6" class="R pt10">
                <div>
                  {{ item.goodsName }}
                </div>
                <div>
                  <el-tooltip class="item" content="规格" effect="dark" placement="right">
                    <span class="font-gray">{{ item.specification }}</span>
                  </el-tooltip>
                </div>
                <div>
                  <el-tooltip class="item" content="生产单位" effect="dark" placement="right">
                    <span class="font-gray">{{item.origin}}</span>
                  </el-tooltip>
                </div>
              </el-col>
              <el-col :span="5" class="R pt10">
                {{ item.povName }}
              </el-col>
              <el-col :span="4" class="R pt10">
                {{ item.batchNumber }}
              </el-col>
              <el-col :span="4" class="R pt10">
                {{ item.actualCode}}
              </el-col>
              <el-col :span="1">
                {{item.sourceSystem}}
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div v-show="pager.count>pager.pageSize && !loadingData" class="text-center">
        <el-pagination
          :current-page="pager.currentPage"
          :page-sizes="[pager.pageSize,30,50,100]" :total="pager.count" layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import {BaseInfo} from '@/resources';

export default {
  data() {
    return {
      loadingData: true,
      showSearch: true,
      CDCs: [],
      filters: {
        actualStartTime: '',
        actualEndTime: '',
        vaccineId: '',
        povId: '',
        actualCode: '',
        batchNumber: ''
      },
      searchCondition: {
        actualStartTime: '',
        actualEndTime: '',
        vaccineId: '',
        povId: '',
        actualCode: '',
        batchNumber: ''
      },
      actualTime: '',
      orgList: [], // 货主列表,
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: 15
      },
      doing: false,
      selectLoading: false,
      provideList: []
    };
  },
  mounted() {
    this.getRecordPage(1);
  },
  watch: {
    filters: {
      handler: function () {
        this.getRecordPage(1);
      },
      deep: true
    }
  },
  methods: {
    filterProvide: function (query) {
      let orgId = this.$store.state.user.userCompanyAddress;
      let params = {
        keyWord: query,
        subjectOrgId: orgId
      };
      this.selectLoading = true;
      BaseInfo.queryOrgByVossAuth(orgId, params).then(res => {
        this.provideList = res.data;
        this.selectLoading = false;
      }).catch(() => {
        this.selectLoading = false;
      });
    },
    handleSizeChange(val) {
      this.pager.pageSize = val;
      this.getRecordPage(1);
    },
    handleCurrentChange(val) {
      this.getRecordPage(val);
    },
    getRecordPage(pageNo) { // 得到波次列表
      this.pager.currentPage = pageNo;
      let params = Object.assign({
        pageNo: pageNo,
        pageSize: this.pager.pageSize
      }, this.filters);
      this.loadingData = true;
      this.$http.get('/injection-task/subordinate', {params}).then(res => {
        this.CDCs = res.data.list;
        if (res.data.list.length) {
          this.pager.count = this.pager.currentPage * this.pager.pageSize + (res.data.list.length < this.pager.pageSize ? 0: 1);
        }
        this.loadingData = false;
      });
    },
    searchProduct(query) {
      let params = Object.assign({}, {
        deleteFlag: false,
        keyWord: query
      });
      this.$http.get('/goods/main-info-pager', {params}).then(res => {
        this.orgList = res.data.list;
      });
    },
    searchInOrder: function () {// 搜索
      this.searchCondition.actualStartTime = this.$formatAryTime(this.actualTime, 0);
      this.searchCondition.actualEndTime = this.$formatAryTime(this.actualTime, 1);
      Object.assign(this.filters, this.searchCondition);
    },
    resetSearchForm: function () {// 重置表单
      let temp = {
        actualStartTime: '',
        actualEndTime: '',
        vaccineId: '',
        povId: '',
        actualCode: '',
        batchNumber: ''
      };
      this.actualTime = '';
      Object.assign(this.searchCondition, temp);
      Object.assign(this.filters, temp);
    },
    formatTime: function (date) {
      return date ? this.$moment(date).format('YYYY-MM-DD') : '';
    }
  }
};
</script>
