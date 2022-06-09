<style lang="scss" scoped>
.opera-btn-group {
  margin: 10px 0;
}
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
        <el-form class="advanced-query-form">
          <el-row>
            <el-col :span="9">
              <oms-form-row :span="4" label="货主疫苗">
                <el-select v-model="searchCondition.orgGoodsId" :clearable="true" :remote-method="searchProduct" filterable
                           placeholder="请输入名称或编号搜索货主疫苗" popper-class="good-selects" remote
                           @click.native="searchProduct('')">
                  <el-option v-for="item in goodesList" :key="item.orgGoodsDto.id"
                             :label="item.orgGoodsDto.name"
                             :value="item.orgGoodsDto.id">
                    <div style="overflow: hidden">
                      <span class="pull-left">{{item.orgGoodsDto.name}}<el-tag v-show="!item.orgGoodsDto.status" style="float: none"
                                                                               type="danger">停用</el-tag></span>
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
            <el-col :span="6">
              <oms-form-row :span="6" label="完成时间">
                <el-col :span="24">
                  <el-date-picker
                    v-model="dateyear"
                    format="yyyy"
                    placeholder="请选择年份"
                    type="year">
                  </el-date-picker>
                </el-col>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="3" label="">
                <el-button :disabled="isLoading" type="primary" @click="Search">查询</el-button>
                <perm label="each-year-vaccine-manager-export">
                  <el-button :disabled="isLoading" :plain="true" style="margin-left: 10px" type="success"
                             @click="exportFile">导出Excel
                  </el-button>
                </perm>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table :data="reportList" border class="header-list">
        <el-table-column align="center" label="领苗单位" prop="transactOrgName" width="340"></el-table-column>
        <el-table-column :sortable="true" align="center" label="总计领苗数量" prop="eachCount" width="120"></el-table-column>
        <el-table-column align="center" label="1月份" prop="jan"></el-table-column>
        <el-table-column align="center" label="2月份" prop="feb"></el-table-column>
        <el-table-column align="center" label="3月份" prop="mar"></el-table-column>
        <el-table-column align="center" label="4月份" prop="apr"></el-table-column>
        <el-table-column align="center" label="5月份" prop="may"></el-table-column>
        <el-table-column align="center" label="6月份" prop="jun"></el-table-column>
        <el-table-column align="center" label="7月份" prop="jul"></el-table-column>
        <el-table-column align="center" label="8月份" prop="aug"></el-table-column>
        <el-table-column align="center" label="9月份" prop="sep"></el-table-column>
        <el-table-column align="center" label="10月份" prop="oct"></el-table-column>
        <el-table-column align="center" label="11月份" prop="nov"></el-table-column>
        <el-table-column align="center" label="12月份" prop="dec"></el-table-column>
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
          message: error.response && error.response.data && error.response.data.msg || '导出失败'
        });
      });
    },
    searchProduct(keyWord) {
      let params = Object.assign({}, {
        keyWord: keyWord
      });
      Vaccine.query(params).then(res => {
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
