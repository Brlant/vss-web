<style lang="scss">
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

  .record-table {
    .el-input__inner {
      padding: 0px !important;
    }
  }
</style>
<template>
  <div class="order-page">
    <div class="container">

      <div :class="{up:!showSearch}" class="opera-btn-group">
        <el-form class="advanced-query-form clearfix" onsubmit="return false">
          <el-col :span="12">
            <oms-form-row :span="8" label="请选择库存所在位置">
              <el-select clearable filterable placeholder="请选择仓库" v-model="warehouseId">
                <el-option :key="item.id" :label="item.name" :value="item.id"
                           v-for="item in warehouses">
                </el-option>
              </el-select>
            </oms-form-row>
          </el-col>

        </el-form>
      </div>
      <el-table
        :data="materials" class="header-list store border-black record-table"
        border
        style="width: 100%" v-show="!this.showFlag">
        <el-table-column
          prop="goodsName"
          align="center"
          label="货主疫苗名称" min-width="35%">
          <template slot-scope="scope">
            <el-select :clearable="true" :remote-method="filterOrgGoods"
                       @change="orgGoodsChange(scope.row)"
                       @click.native="filterOrgGoods('')" filterable
                       placeholder="请输入名称或编号搜索货主疫苗" popper-class="good-selects"
                       style="width: 100%"
                       remote v-model="scope.row.orgGoodsId">
              <el-option :key="item.orgGoodsDto.id" :label="item.orgGoodsDto.name"
                         :value="item.orgGoodsDto.id"
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
                    v-show="item.orgGoodsDto.salesFirmName">供货单位:</span>{{ item.orgGoodsDto.salesFirmName }}
                        </span>
                  <span class="select-other-info pull-left" v-if="item.orgGoodsDto.goodsDto">
                          <span v-show="item.orgGoodsDto.goodsDto.factoryName">生产单位:</span>{{ item.orgGoodsDto.goodsDto.factoryName }}
                    </span>
                </div>
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="batchNumber"
          align="center" label="批号" min-width="10%">
          <template slot-scope="scope">
            <el-select :remoteMethod="(query)=>filterBatchNumber(query,scope.row)"
                       @change="setBatchNumber(scope.row)" clearable filterable
                       placeholder="请输入批号名称搜索批号"
                       remote style="width: 100%" v-model="scope.row.batchNumberId">
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
            label="合格" prop="availableCount" width="80px">
            <template slot-scope="scope">
              <el-input @change="setQualifiedBizServings(scope.row)" @input="checkNumber(scope.row,'availableCount')"

                        type="number" v-model="scope.row.availableCount"/>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="不合格" prop="unqualifiedBizCount" width="80px">
            <template slot-scope="scope">
              <el-input @change="setUnqualifiedCount(scope.row)" @input="checkNumber(scope.row,'unqualifiedBizCount')"
                        type="number"
                        v-model="scope.row.unqualifiedBizCount"/>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="人份剂次" prop="qualifiedBizServings" width="80px">
            <template slot-scope="scope">
              <el-input @input="checkNumber(scope.row,'qualifiedBizServings')"
                        type="number"
                        v-model="scope.row.qualifiedBizServings"/>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="实物库存" width="80px">
          <el-table-column
            align="center"
            label="合格" prop="qualifiedCount" width="80px">
            <template slot-scope="scope">
              <el-input @input="checkNumber(scope.row,'qualifiedCount')"
                        type="number"
                        v-model="scope.row.qualifiedCount"/>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="不合格" prop="unqualifiedCount" width="80px">
            <template slot-scope="scope">
              <el-input @input="checkNumber(scope.row,'unqualifiedCount')"
                        type="number"
                        v-model="scope.row.unqualifiedCount"/>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="人份剂次" prop="qualifiedActualServings" width="80px">
            <template slot-scope="scope">
              <el-input @input="checkNumber(scope.row,'qualifiedActualServings')"
                        type="number"
                        v-model="scope.row.qualifiedActualServings"/>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          width="90">
          <template slot-scope="scope">
            <el-button type="text" size="small" style="padding: 0" @click="addTable">增加</el-button>
            <el-button type="text" size="small" style="padding: 0" @click="eddTable(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--     动态表格例子-->
      <previewDialog :formItem="materials" ref="previewDialog"></previewDialog>
      <div class="text-center" v-show="pager.count>pager.pageSize && !loadingData">
        <el-pagination
          :current-page="pager.currentPage"
          :pageSize="pager.pageSize" :total="pager.count" @current-change="getMaPage"
          layout="total,prev, pager, next, jumper">
        </el-pagination>
      </div>
      <el-row style="text-align: center;padding:10px 0">
        <el-button @click="showPreviewDialog" v-show="!this.showFlag">预览</el-button>
        <el-button @click="reset" v-show="this.showFlag">返回</el-button>
        <el-button @click="save" v-show="this.showFlag">保存</el-button>
      </el-row>
    </div>
    <page-right :css="{'width':'1000px','padding':0}" :show="showPart"
                @right-close="resetRightBox">
      <form-part :formItem="form" @close="resetRightBox" @refresh="refresh"></form-part>
    </page-right>
  </div>
</template>
<script>
  import formPart from './form.vue';
  import {Address, Vaccine} from '@/resources';
  import previewDialog from './previewDialog';

  export default {
    components: {formPart, previewDialog},
    data() {
      return {
        testList: [{
          erpStockId: '',
          goodsName: '',
          batchNumber: ''
        }],
        warehouseId: '',
        loadingData: false,
        showSearch: true,
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
        showFlag: false
      };
    },
    mounted() {
      this.initTable();
      this.queryOrgWarehouse();
    },
    methods: {
      reset() {
        this.showFlag = false;
        this.$refs.previewDialog.dialogVisible = false;
      },
      showPreviewDialog() {
        if (!this.warehouseId) {
          return this.$notify.info('请选择仓库');
        }
        for (let i = 0; i < this.materials.length; i++) {
          let val = this.materials[i];
          if (!val.orgGoodsId || !val.batchNumberId || !val.availableCount || !val.unqualifiedBizCount ||
            !val.qualifiedBizServings || !val.qualifiedCount || !val.unqualifiedCount || !val.qualifiedActualServings) {
            return this.$notify.info('请输入完整数据');
          }
        }
        this.$refs.previewDialog.dialogVisible = !this.$refs.previewDialog.dialogVisible;
        this.showFlag = true;
      },
      setQualifiedBizServings(item) {
        if (!item.qualifiedBizServings && item.availableCount) {
          this.orgGoods.forEach(i => {
            if (i.orgGoodsDto.id === item.orgGoodsId) {
              item.qualifiedBizServings = item.availableCount * i.orgGoodsDto.goodsDto.propertyMap.personPortion;
              if (!item.qualifiedActualServings) {
                item.qualifiedActualServings = item.qualifiedBizServings;
              }
            }
          });
        }
        if (!item.qualifiedCount && item.availableCount) {
          item.qualifiedCount = item.availableCount;
        }
      },
      setUnqualifiedCount(item) {
        if (!item.unqualifiedCount && item.unqualifiedBizCount) {
          item.unqualifiedCount = item.unqualifiedBizCount;
        }
      },
      checkNumber(item, itemName) {
        if (!item.orgGoodsId) {
          item[itemName] = '';
          return this.$notify.info('请先选择货主疫苗');
        }
        if (!item.batchNumberId) {
          item[itemName] = '';
          return this.$notify.info('请先选择批号');
        }
        if (item[itemName] && item[itemName] < 0) {
          item[itemName] = 0;
        }
      },
      //动态表格的方法
      addTable() {
        this.materials.push({
          orgGoodsId: '',
          batchNumberId: '',
          batchNumber: '',
          expiryDate: '',
          availableCount: '',
          unqualifiedBizCount: '',
          qualifiedBizServings: '',
          qualifiedCount: '',
          unqualifiedCount: '',
          qualifiedActualServings: '',
          orgGoodsDto: {}
        });
      },
      initTable() {
        for (let i = 0; i < 5; i++) {
          this.materials.push({
            orgGoodsId: '',
            batchNumberId: '',
            batchNumber: '',
            expiryDate: '',
            availableCount: '',
            unqualifiedBizCount: '',
            qualifiedBizServings: '',
            qualifiedCount: '',
            unqualifiedCount: '',
            qualifiedActualServings: '',
            orgGoodsDto: {}
          });
        }
      },
      eddTable(scope) {
        this.materials.splice(scope.$index, 1);
      },
      orgGoodsChange(item) {
        item.batchNumberId = '';
        item.batchNumber = '';
        item.expiryDate = '';
        item.availableCount = '';
        item.unqualifiedBizCount = '';
        item.qualifiedBizServings = '';
        item.qualifiedCount = '';
        item.unqualifiedCount = '';
        item.qualifiedActualServings = '';
        this.batchNumberList = [];
        this.filterBatchNumber(null, item);
        // 设置多余属性值
        if (item.orgGoodsId) {
          this.orgGoods.forEach(i => {
            if (i.orgGoodsDto.id === item.orgGoodsId) {
              item.orgGoodsDto = JSON.parse(JSON.stringify(i.orgGoodsDto));
            }
          });
        }
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
          keyWord: query,
          orgId: orgId,
          status: true
        });
        Vaccine.query(params).then(res => {
          this.orgGoods = res.data.list;
        });
      },
      filterBatchNumber(query, item) {
        if (!item.orgGoodsId) return;
        let goodsId = '';
        this.orgGoods.forEach(i => {
          if (i.orgGoodsDto.id === item.orgGoodsId) {
            goodsId = i.orgGoodsDto.goodsId;
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
      setBatchNumber(item) {
        if (item.batchNumberId) {
          this.batchNumberList.forEach(i => {
            if (i.id === item.batchNumberId) {
              item.batchNumber = i.batchNumber;
              item.expiryDate = i.expirationDate;
            }
          });
        }
      },
      queryOrgWarehouse() {
        let param = Object.assign({}, {
          deleteFlag: false,
          auditedStatus: '1'
        });
        Address.queryAddress(param).then(res => {
          this.warehouses = res.data;
          if (res.data) {
            this.warehouseId = res.data[0];
          }
        });
      },
      add() {
        for (let i = 0; i < this.materials.length; i++) {
          let val = this.materials[i];
          if (!val.orgGoodsId || !val.batchNumberId || !val.availableCount || !val.unqualifiedBizCount ||
            !val.qualifiedBizServings || !val.qualifiedCount || !val.unqualifiedCount || !val.qualifiedActualServings) {
            return this.$notify.info('请输入完整数据');
          }
        }
      },
      save() {
        if (!this.warehouseId) {
          return this.$notify.info('请选择仓库');
        }
        for (let i = 0; i < this.materials.length; i++) {
          let val = this.materials[i];
          if (!val.orgGoodsId || !val.batchNumberId || !val.availableCount || !val.unqualifiedBizCount ||
            !val.qualifiedBizServings || !val.qualifiedCount || !val.unqualifiedCount || !val.qualifiedActualServings) {
            return this.$notify.info('请输入完整数据');
          }
        }
        let dataList = [];
        this.materials.forEach(m => {
          let data = {};
          data.orgGoodsId = m.orgGoodsId;
          data.batchNumberId = m.batchNumberId;
          data.warehouseId = this.warehouseId;
          data.availableCount = m.availableCount;
          data.unqualifiedBizCount = m.unqualifiedBizCount;
          data.qualifiedBizServings = m.qualifiedBizServings;
          data.qualifiedCount = m.qualifiedCount;
          data.unqualifiedCount = m.unqualifiedCount;
          data.qualifiedActualServings = m.qualifiedActualServings;
          dataList.push(data);
        });
        this.$http.put('/erp-stock/batch/import', dataList).then(() => {
          this.doing = false;
          this.$notify.success({
            message: '期初库存录入成功'
          });

        });
      }

    }
  };
</script>
