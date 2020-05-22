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
  .record-table{
   .el-input__inner{
      padding: 0px !important;
    }
  }
</style>
<template>
  <div class="order-page">
    <div class="container">

      <div :class="{up:!showSearch}" class="opera-btn-group">
        <div class="opera-icon">
          <perm class="switching-icon" label="cerp-stock-status-adjust-insert">
             <span @click.prevent="add" class="pull-right cursor-span" style="margin-left: 10px">
            <a @click.stop.prevent="add" class="btn-circle" href="#">
                        <i class="el-icon-t-plus"></i>
             </a>添加
          </span>
          </perm>

          <span @click="showSearch = !showSearch" class="pull-left switching-icon">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
        </div>

      </div>
      <el-table
        :data="materials" class="header-list store border-black record-table"
        border
        style="width: 100%">
        <el-table-column
          prop="goodsName"
          align="center"
          label="货主疫苗名称" width="300px">
          <template slot-scope="scope">
            <el-select :clearable="true" :remote-method="filterOrgGoods" @change="orgGoodsChangeTest" filterable
                       placeholder="请输入名称或编号搜索货主疫苗" popper-class="good-selects"
                       style="width: 100%"
                       remote v-model="scope.row.goodsName">
              <el-option :key="org.id" :label="org.goodsName" :value="org.id"
                         v-for="org in orgGoods">
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
          </template>
        </el-table-column>
        <el-table-column
          prop="batchNumber"
          align="center" label="批号">
          <template slot-scope="scope">
            <el-select :remoteMethod="filterBatchNumber" clearable filterable placeholder="请输入批号名称搜索批号"
                       remote v-model="scope.row.batchNumber">
              <el-option :key="item.id" :label="item.batchNumber" :value="item.id"
                         v-for="item in batchNumberList">
                {{ item.batchNumber }}
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" label="业务库存">
          <el-table-column
            align="center"
            label="合格" prop="batchNumber">
            <template slot-scope="scope">
              <el-input v-model="scope.row.availableCount"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="不合格" prop="batchNumber">
            <template slot-scope="scope">
              <el-input v-model="scope.row.unqualifiedBizCount"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="人份剂次" prop="batchNumber">
            <template slot-scope="scope">
              <el-input v-model="scope.row.qualifiedBizServings"></el-input>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="实物库存">
          <el-table-column
            align="center"
            label="合格" prop="batchNumber">
            <template slot-scope="scope">
              <el-input v-model="scope.row.batchNumber"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="不合格" prop="batchNumber">
            <template slot-scope="scope">
              <el-input v-model="scope.row.batchNumber"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="人份剂次" prop="batchNumber">
            <template slot-scope="scope">
              <el-input v-model="scope.row.batchNumber"></el-input>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="90">
          <template slot-scope="scope">
            <el-button type="text" size="small" style="padding: 0" @click="addTable">增加</el-button>
            <el-button type="text" size="small" style="padding: 0" @click="eddTable(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--     动态表格例子-->
      <div class="text-center" v-show="pager.count>pager.pageSize && !loadingData">
        <el-pagination
          :current-page="pager.currentPage"
          :pageSize="pager.pageSize" :total="pager.count" @current-change="getMaPage"
          layout="total,prev, pager, next, jumper">
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
        testList: [{
          erpStockId: '',
          goodsName: '',
          batchNumber: ''
        }],
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
      //动态表格的方法
      addTable() {
        this.materials.push({
          erpStockId: '',
          goodsName: '',
          batchNumber: ''
        });
      },
      eddTable(scope) {
        this.materials.splice(scope.$index, 1);
      },
      orgGoodsChangeTest(val) {
        this.filters.batchNumberId = '';
        this.batchNumberList = [];
        this.filterBatchNumberTest();
      },
      filterBatchNumberTest(query) {
        this.$http.get('/batch-number/pager', {
          params: {keyWord: query, goodsId: 5381}
        }).then(res => {
          this.batchNumberList = res.data.list;
        });
      },
      //************
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
