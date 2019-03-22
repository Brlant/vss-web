<style lang="scss" scoped="">
  .opera-btn-group {
    margin: 10px 0;
  }
</style>
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
        <el-form class="advanced-query-form">
          <el-row>
            <el-col :span="9">
              <oms-form-row label="货主疫苗" :span="4">
                <el-select v-model="searchCondition.orgGoodsId" filterable remote placeholder="请输入名称或编号搜索货主疫苗"
                           :remote-method="searchProduct" @click.native="searchProduct('')" :clearable="true"
                           popper-class="good-selects">
                  <el-option v-for="item in goodesList" :key="item.orgGoodsDto.id"
                             :label="item.orgGoodsDto.name"
                             :value="item.orgGoodsDto.id">
                    <div style="overflow: hidden">
                      <span class="pull-left">{{item.orgGoodsDto.name}}</span>
                    </div>
                    <div style="overflow: hidden">
                        <span class="select-other-info pull-left"><span
                          v-show="item.orgGoodsDto.goodsNo">疫苗编号:</span>{{item.orgGoodsDto.goodsNo}}
                        </span>
                      <span class="select-other-info pull-left"><span
                        v-show="item.orgGoodsDto.salesFirmName">供货厂商:</span>{{ item.orgGoodsDto.salesFirmName }}
                        </span>
                      <span class="select-other-info pull-left" v-if="item.orgGoodsDto.goodsDto">
                          <span v-show="item.orgGoodsDto.goodsDto.factoryName">生产厂商:</span>{{ item.orgGoodsDto.goodsDto.factoryName }}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="6">
              <oms-form-row label="完成时间" :span="6">
                <el-col :span="24">
                  <el-date-picker
                    v-model="dateyear"
                    type="year"
                    format="yyyy"
                    placeholder="请选择年份">
                  </el-date-picker>
                </el-col>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="" :span="3">
                <el-button type="primary" @click="Search" :disabled="isLoading">查询</el-button>
                <perm label="each-year-vaccine-manager-export">
                  <el-button :plain="true" type="success" @click="exportFile" :disabled="isLoading">导出Excel</el-button>
                </perm>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table :data="reportList" border class="header-list">
        <el-table-column prop="transactOrgName" label="领苗单位" width="340" align="center"></el-table-column>
        <el-table-column prop="eachCount" label="总计领苗数量" width="120" :sortable="true" align="center"></el-table-column>
        <el-table-column prop="jan" label="1月份" width="80" align="center"></el-table-column>
        <el-table-column prop="feb" label="2月份" width="80" align="center"></el-table-column>
        <el-table-column prop="mar" label="3月份" width="80" align="center"></el-table-column>
        <el-table-column prop="apr" label="4月份" width="80" align="center"></el-table-column>
        <el-table-column prop="may" label="5月份" width="80" align="center"></el-table-column>
        <el-table-column prop="jun" label="6月份" width="80" align="center"></el-table-column>
        <el-table-column prop="jul" label="7月份" width="80" align="center"></el-table-column>
        <el-table-column prop="aug" label="8月份" width="80" align="center"></el-table-column>
        <el-table-column prop="sep" label="9月份" width="80" align="center"></el-table-column>
        <el-table-column prop="oct" label="10月份" width="80" align="center"></el-table-column>
        <el-table-column prop="nov" label="11月份" width="80" align="center"></el-table-column>
        <el-table-column prop="dec" label="12月份" width="80" align="center"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import utils from '@/tools/utils';
  import {Vaccine} from '@/resources';

  export default {
    name: 'receive',
    data() {
      return {
        heardName: '',
        loadingData: false,
        reportList: [],
        isLoading: false,
        goodesList: [],
        dateyear: '',
        showSearch: true,
        searchCondition: {
          year: '',
          orgGoodsId: ''
        }
      };
    },
    methods: {
      Search: function () {// 搜索
        if (!this.searchCondition.orgGoodsId) {
          return this.$notify.info({
            message: '请选择货主疫苗'
          });
        }
        if (!this.dateyear) {
          return this.$notify.info({
            message: '请选择完成时间'
          });
        }
        this.searchCondition.year = this.formatTime(this.dateyear);
        let params = Object.assign(this.searchCondition);
        this.loadingData = true;
        this.$http.get('erp-order/query-export', {params}).then(res => {
          if (!res.data.list) {
            this.$notify.success({
              message: '没有相应数据'
            });
          }
          this.reportList = res.data.list;
          this.loadingData = false;
        });
      },
      exportFile: function () {// 导出Excel
        if (!this.searchCondition.orgGoodsId) {
          return this.$notify.info({
            message: '请选择货主疫苗'
          });
        }
        if (!this.dateyear) {
          return this.$notify.info({
            message: '请选择完成时间'
          });
        }
        this.searchCondition.year = this.formatTime(this.dateyear);
        let params = Object.assign(this.searchCondition);
        this.isLoading = true;
        this.$store.commit('initPrint', {isPrinting: true, moduleId: '/report/receive'});
        this.$http.get('/erp-order/export', {params}).then(res => {
          if (res.data) {
            utils.download(res.data, '疾病预防控制中心各单位领苗一览表');
          }
          this.isLoading = false;
          this.dateyear = '';
          this.searchCondition.year = '';
          this.searchCondition.orgGoodsId = '';
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/receive'});
        }).catch(error => {
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/report/receive'});
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '导出失败'
          });
        });
      },
      searchProduct(keyWord) {
        let params = Object.assign({}, {
          keyWord: keyWord,
          orgId: this.$store.state.user['userCompanyAddress']
        });
        let level = this.$store.state.orgLevel;
        let api = level === 1 ? 'queryFirstVaccine' : 'querySecondVaccine';
        Vaccine[api](params).then(res => {
          this.goodesList = res.data.list;
        });
      },
      formatTime: function (date) {
        return date ? this.$moment(date).format('YYYY') : '';
      }
    }
  };
</script>

<style scoped>

</style>
