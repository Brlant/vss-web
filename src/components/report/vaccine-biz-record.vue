<template>
  <div class="order-page">
    <div class="container">
      <div :class="{up:!showSearch}" class="opera-btn-group">
        <div class="opera-icon">
          <span @click="showSearch = !showSearch" class="pull-left switching-icon">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
        </div>
        <el-form class="advanced-query-form">
          <el-row>
            <el-col :span="8">
              <oms-form-row :span="5" label="货主疫苗">
                <el-select :clearable="true" :remote-method="filterOrgGoods" @click.native.once="filterOrgGoods('')"
                           filterable
                           @change="goodsChange"
                           placeholder="请输入名称搜索货主疫苗"
                           popper-class="good-selects" remote
                           v-model="searchWord.goodsId">
                  <el-option :key="item.orgGoodsDto.id" :label="item.orgGoodsDto.name"
                             :value="item.orgGoodsDto.goodsId"
                             v-for="item in orgGoods">
                    <div style="overflow: hidden">
                      <span class="pull-left">{{item.orgGoodsDto.name}}<el-tag style="float: none" type="danger"
                                                                               v-show="!item.orgGoodsDto.status">停用</el-tag></span>
                    </div>
                    <div style="overflow: hidden">
                      <span class="select-other-info pull-left"><span
                        v-show="item.orgGoodsDto.goodsNo">货主货品编号:</span>{{item.orgGoodsDto.goodsNo}}
                      </span>
                      <span class="select-other-info pull-left"><span
                        v-show="item.orgGoodsDto.salesFirmName">供应商:</span>{{ item.orgGoodsDto.salesFirmName }}
                      </span>
                      <span class="select-other-info pull-left" v-if="item.orgGoodsDto.goodsDto">
                        <span v-show="item.orgGoodsDto.goodsDto.factoryName">生产单位:</span>{{ item.orgGoodsDto.goodsDto.factoryName }}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="6" label="批号">
                <el-select :remoteMethod="filterBatchNumber" @click.native.once="filterBatchNumber('')" clearable
                           filterable
                           placeholder="请输入批号名称搜索批号" remote
                           v-model="searchWord.batchNumberId">
                  <el-option :key="item.id" :label="item.batchNumber" :value="item.id"
                             v-for="item in batchNumberList"></el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="5" label="业务日期">
                <el-col :span="24">
                  <el-date-picker
                    format="yyyy-MM-dd"
                    placeholder="请选择"
                    type="daterange" v-model="bizDateAry">
                  </el-date-picker>
                </el-col>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="5" label="">
                <el-button :disabled="loadingData" @click="search" type="primary">
                  查询
                </el-button>
                <perm label="vaccine-biz-record-export">
                  <el-button :disabled="isLoading" :plain="true" @click="exportFile" style="margin-left: 10px"
                             type="success">
                    {{isLoading? '正在导出': '导出Word'}}
                  </el-button>
                </perm>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table :data="reportList" :header-row-class-name="'headerClass'" :maxHeight="getHeight" border
                class="header-list"
                ref="reportTable" v-loading="loadingData">
        <el-table-column :sortable="true" label="日期" min-width="100" prop="date" width="120px"></el-table-column>
        <el-table-column align="center" label="出入库类型" prop="type" width="130"></el-table-column>
        <el-table-column label="来源/去向单位" prop="source"></el-table-column>
        <el-table-column label="入库数" prop="inNumber" width="70px"></el-table-column>
        <el-table-column label="出库数" prop="outNumber" width="70px"></el-table-column>
        <el-table-column label="库存数" prop="inventory" width="70px"></el-table-column>
        <el-table-column align="center" label="对方单位经手人" prop="otherHead" width="200px"></el-table-column>
        <el-table-column align="center" label="本单位经手人" prop="selfHead" width="200px"></el-table-column>
        <el-table-column label="备注" prop="note" width="100px"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import {Vaccine} from '@/resources';
  import utils from '@/tools/utils';
  import ReportMixin from '@/mixins/reportMixin';

  export default {
    name: 'quality-acceptance-record',
    mixins: [ReportMixin],
    data() {
      return {
        loadingData: false,
        reportList: [],
        showSearch: true,
        time: '',
        searchWord: {
          batchNumberId: '',
          orgGoodsId: '',
          goodsId: '',
          startTime: '',
          endTime: ''
        },
        isLoading: false,
        bizDateAry: [],
        orgGoods: [],
        batchNumberList: []
      };
    },
    computed: {
      getHeight: function () {
        return parseInt(this.$store.state.bodyHeight, 10) - 70 + this.fixedHeight;
      }
    },
    methods: {
      exportFile: function () {
        if (!this.searchWord.goodsId) {
          this.$notify.info({
            message: '请选择货主疫苗'
          });
          return;
        }
        if (!this.searchWord.batchNumberId) {
          this.$notify.info({
            message: '请选择货品批号'
          });
          return;
        }
        this.isLoading = true;
        this.searchWord.startTime = this.$formatAryTime(this.bizDateAry, 0);
        this.searchWord.endTime = this.$formatAryTime(this.bizDateAry, 1);
        let params = Object.assign({}, this.searchWord);
        this.$store.commit('initPrint', {isPrinting: true, moduleId: '/report/repertory'});
        this.$http.get('/vaccine-biz-record/export', {params}).then(res => {
          if (res.data.url) {
            utils.download(res.data.url, '疫苗出入库记录表');
          } else {
            this.$notify({
              title: '导出错误',
              type: 'info',
              message: '该条件下没有相关数据'
            });
          }
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/repertory'});
        }).catch(error => {
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/repertory'});
          this.$notify.error({
            message: error.data && error.data.msg || '导出失败'
          });
        });
      },
      search: function () {// 搜索
        if (!this.searchWord.goodsId) {
          this.$notify.info({
            message: '请选择货主疫苗'
          });
          return;
        }
        if (!this.searchWord.batchNumberId) {
          this.$notify.info({
            message: '请选择货品批号'
          });
          return;
        }
        this.loadingData = true;
        this.searchWord.startTime = this.$formatAryTime(this.bizDateAry, 0);
        this.searchWord.endTime = this.$formatAryTime(this.bizDateAry, 1);
        let params = Object.assign({}, this.searchWord);
        this.$http.get('/vaccine-biz-record/query', {params}).then(res => {
          this.reportList = res.data;
          if (this.reportList.length === 0) {
            this.$notify({
              title: '提示',
              type: 'info',
              message: '没有查询到相关数据'
            });
          }
          this.loadingData = false;
          this.setFixedHeight();
        }).catch(error => {
          this.loadingData = false;
          this.reportList = [];
          this.$notify.error({
            message: error.data && error.data.msg || '查询失败'
          });
        });
      },
      resetSearchForm: function () {
        this.searchWord = {
          batchNumberId: '',
          orgGoodsId: '',
          startTime: '',
          endTime: ''
        };
        this.bizDateAry = '';
      },
      filterBatchNumber(query) {
        if (!this.searchWord.goodsId) return;
        this.$http.get('/batch-number/pager', {
          params: {
            keyWord: query,
            goodsId: this.searchWord.goodsId
          }
        }).then(res => {
          this.batchNumberList = res.data.list;
        });
      },
      goodsChange() {
        this.searchWord.batchNumberId = '';
        this.batchNumberList = [];
        this.filterBatchNumber('');
      },
      filterOrgGoods(query) {
        let params = Object.assign({}, {
          keyWord: query
        });
        Vaccine.query(params).then(res => {
          this.orgGoods = res.data.list;
        });
      },
      formatTime: function (date) {
        return date ? this.$moment(date).format('YYYY-MM-DD') : '';
      }
    }
  };
</script>

<style scoped>

</style>
