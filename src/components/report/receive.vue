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
              <oms-form-row label="货主货品" :span="4">
                <el-select v-model="searchCondition.orgGoodsId" filterable remote placeholder="请输入名称搜索货主货品"
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
                          v-show="item.orgGoodsDto.goodsNo">货品编号:</span>{{item.orgGoodsDto.goodsNo}}
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
              <oms-form-row label="下单时间" :span="6">
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
                <el-button :plain="true" type="success" @click="exportFile" :disabled="isLoading">导出Excel</el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import utils from '@/tools/utils';
  import { BaseInfo, erpOrder, Vaccine } from '@/resources';

  export default {
    name: 'receive',
    data() {
      return {
        isLoading: false,
        goodesList: [],
        dateyear: '',
        showSearch: true,
        searchCondition: {
          type: 1,
          year: '',
          state: 4,
          bizType: '2-0',
          isShowDetail: false,
          orderNo: '',
          logisticsProviderId: '',
          createStartTime: '',
          createEndTime: '',
          transportationMeansId: '',
          transactOrgId: '',
          orgGoodsId: '',
          orgAreaCode: '',
          thirdPartyNumber: '',
          expectedStartTime: '',
          expectedEndTime: ''
        }
      };
    },
    methods: {
      exportFile: function () {// 导出Excel
        if (!this.searchCondition.orgGoodsId) {
          return this.$notify.info({
            message: '请选择货主货品'
          });
        }
        if (!this.dateyear) {
          return this.$notify.info({
            message: '请选择下单时间'
          });
        }
        this.searchCondition.year = this.formatTime(this.dateyear);
        let params = Object.assign(this.searchCondition);
        this.isLoading = true;
        this.$store.commit('initPrint', {isPrinting: true, moduleId: '/report/receive'});
        this.$http.get('/erp-order/export', {params}).then(res => {
          if (res.data) {
            utils.download(res.data, '疾病预防控制中心各单位领苗一览表');
          } ;
          this.isLoading = false;
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
