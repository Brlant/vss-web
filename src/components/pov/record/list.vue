<template>
  <div class="order-page">
    <div class="container">
      <div class="opera-btn-group" :class="{up:!showSearch}">
        <div class="opera-icon">
          <span class="pull-left switching-icon" @click="showSearch = !showSearch">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
        </div>
        <el-form v-show="showSearch" class="advanced-query-form clearfix" style="padding-top: 10px"
                 onsubmit="return false">
          <el-row>
            <el-col :span="8">
              <oms-form-row label="接种时间" :span="6">
                <el-col :span="24">
                  <el-date-picker
                    v-model="actualTime"
                    type="daterange"
                    placeholder="请选择" format="yyyy-MM-dd">
                  </el-date-picker>
                </el-col>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="疫苗主档" :span="6">
                <el-select filterable remote placeholder="请输入名称或编号搜索疫苗主档" :remote-method="searchProduct"
                           :clearable="true"
                           v-model="searchCondition.vaccineId" popper-class="good-selects"
                           @click.native.once="searchProduct('')">
                  <el-option :value="org.id" :key="org.id" :label="org.name"
                             v-for="org in orgList">
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
              <oms-form-row label="追溯码" :span="6">
                <el-col :span="24">
                  <el-input v-model="searchCondition.actualCode" placeholder="请输入追溯码"></el-input>
                </el-col>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="8" label="筛选未知追溯码">
                <el-col :span="8">
                  <el-checkbox @change="checkChange" v-model="searchCondition.checked"></el-checkbox>
                </el-col>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="" :span="3">
                <el-button type="primary" native-type="submit" @click="searchInOrder">查询</el-button>
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
                <perm label="injection-task-export">
                  <el-button :disabled="isLoading" :plain="true" @click="exportFile" style="margin-left: 10px"
                             type="success">
                    导出Excel
                  </el-button>
                </perm>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="order-list clearfix " style="margin-top: 10px">
        <el-row class="order-list-header">
          <el-col :span="4">接种时间/登记编号</el-col>
          <el-col :span="9">接种疫苗</el-col>
          <el-col :span="3">批号</el-col>
          <el-col :span="6">追溯码</el-col>
          <el-col :span="2">来源</el-col>
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
          <div class="order-list-item order-list-item-bg" v-for="item in CDCs" :key="">
            <el-row>
              <el-col :span="4" class="R pt10">
                {{ item.actualTime | minute}}
                <div>
                  <el-tooltip class="item" effect="dark" content="登记编号" placement="right">
                    <span class="font-gray">{{ item.inoculatorNumber }}</span>
                  </el-tooltip>
                </div>
              </el-col>
              <el-col :span="9" class="R pt10">
                <div>
                  {{ item.goodsName }}
                </div>
                <div>
                  <el-tooltip class="item" effect="dark" content="规格" placement="right">
                    <span class="font-gray">{{ item.specification }}</span>
                  </el-tooltip>
                </div>
                <div>
                  <el-tooltip class="item" effect="dark" content="生产单位" placement="right">
                    <span class="font-gray">{{item.origin}}</span>
                  </el-tooltip>
                </div>
              </el-col>
              <el-col :span="3" class="R pt10">
                {{ item.batchNumber }}
              </el-col>
              <el-col :span="6" class="R pt10">
                {{ item.actualCode}}
              </el-col>
              <el-col :span="2">
                {{item.sourceSystem }}
                <el-tag type="warning" v-show="item.traceCodeId==='NULL'">未知追溯码</el-tag>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div class="text-center" v-show="pager.count>pager.pageSize && !loadingData">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :total="pager.count" :page-sizes="[pager.pageSize,30,50,100]" @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pager.currentPage">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import utils from '@/tools/utils';

  export default {
    data() {
      return {
        loadingData: true,
        showSearch: true,
        isLoading: false,
        CDCs: [],
        filters: {
          actualStartTime: '',
          actualEndTime: '',
          vaccineId: '',
          actualCode: '',
          traceCodeId: '',
          checked: false
        },
        searchCondition: {
          actualStartTime: '',
          actualEndTime: '',
          vaccineId: '',
          actualCode: '',
          traceCodeId: '',
          checked: false
        },
        actualTime: '',
        orgList: [], // 货主列表,
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 15
        },
        doing: false
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
      checkChange(val) {
        if (val) {
          this.searchCondition.traceCodeId = 'NULL';
        } else {
          this.searchCondition.traceCodeId = '';
        }
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
        this.$http.get('/injection-task/injection-task-query', {params}).then(res => {
          this.CDCs = res.data.list;
          this.pager.count = res.data.count;
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
          actualCode: '',
          traceCodeId: '',
          checked: false
        };
        this.actualTime = '';
        Object.assign(this.searchCondition, temp);
        Object.assign(this.filters, temp);
      },
      exportFile: function () {// 导出表单
        this.searchCondition.actualStartTime = this.$formatAryTime(this.actualTime, 0);
        this.searchCondition.actualEndTime = this.$formatAryTime(this.actualTime, 1);
        let params = Object.assign({}, this.searchCondition);
        this.isLoading = true;
        this.$store.commit('initPrint', {isPrinting: true, moduleId: '/pov'});
        this.$http.get('/injection-task/export', {params}).then(res => {
          utils.download(res.data.path, '疫苗注射记录表');
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/pov'});
        }).catch(error => {
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/pov'});
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '导出失败'
          });
        });
      },
      formatTime: function (date) {
        return date ? this.$moment(date).format('YYYY-MM-DD') : '';
      }
    }
  };
</script>
