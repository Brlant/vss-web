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
      padding: 5px !important;
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
              <el-select :clearable="true"
                         :remote-method="queryOrgWarehouse" @click.native="queryOrgWarehouse('')"
                         filterable placeholder="请选择仓库"
                         remote
                         v-model="warehouseId">
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
          label="货主疫苗名称" min-width="25%">
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
                  <br/>
                  <span class="select-other-info pull-left" v-if="item.orgGoodsDto.goodsDto">
                                <span v-show="item.orgGoodsDto.goodsDto.name">货品主档:</span>{{ item.orgGoodsDto.goodsDto.name }}
                          </span>
                  <br/>
                  <span class="select-other-info pull-left" v-if="item.orgGoodsDto.goodsDto">
                                <span v-show="item.orgGoodsDto.goodsDto.specifications">规格:</span>{{ item.orgGoodsDto.goodsDto.specifications }}
                          </span>
                  <span class="select-other-info pull-left" v-if="item.orgGoodsDto.goodsDto">
                                <span v-show="item.orgGoodsDto.goodsDto.measurementUnit">单位:</span>{{ item.orgGoodsDto.goodsDto.measurementUnit }}
                          </span>
                  <span class="select-other-info pull-left" v-if="item.orgGoodsDto.goodsDto">
                                <span v-show="item.orgGoodsDto.goodsDto.dosageForm">剂型:</span><dict
                    :dict-group="'dosageForm'"
                    :dict-key="item.orgGoodsDto.goodsDto.dosageForm"></dict>
                  </span>
                  <br/>
                  <span class="select-other-info pull-left" v-if="item.orgGoodsDto.goodsDto">
                                <span v-show="item.orgGoodsDto.goodsDto.factoryName">生产单位:</span>{{ item.orgGoodsDto.goodsDto.factoryName }}
                  </span>
                </div>
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="规格" min-width="8%" prop="specifications">
          <template slot-scope="scope">
            {{scope.row.specifications}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="生产厂家" min-width="8%" prop="factoryName">
          <template slot-scope="scope">
            {{scope.row.factoryName}}
          </template>
        </el-table-column>
        <el-table-column
          prop="batchNumber"
          align="center" label="批号" min-width="9%">
          <template slot-scope="scope">
            <el-select :remoteMethod="(query)=>filterBatchNumber(query,scope.row)"
                       @click.native="(query)=>filterBatchNumber('',scope.row)"
                       @change="setBatchNumber(scope.row)" clearable filterable
                       placeholder="请输入批号名称搜索批号"
                       :disabled="!scope.row.orgGoodsId" remote style="width: 100%" v-model="scope.row.batchNumberId">
              <el-option :key="item.id" :label="item.batchNumber" :value="item.id"
                         v-for="item in scope.row.batchNumberList">
                {{ item.batchNumber }}
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="单位" min-width="3%" prop="measurementUnit">
          <template slot-scope="scope">
            {{scope.row.measurementUnit}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="业务库存">
          <el-table-column
            align="center"
            label="合格" prop="availableCount" width="65px">
            <template slot-scope="scope">
              <el-input :disabled="!scope.row.orgGoodsId"
                        :maxlength="10"
                        @change="setQualifiedBizServings(scope.row)"
                        @input="checkNumber(scope.row,'availableCount')" v-model="scope.row.availableCount">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="不合格" prop="unqualifiedBizCount" width="65px">
            <template slot-scope="scope">
              <el-input @change="setUnqualifiedCount(scope.row)" @input="checkNumber(scope.row,'unqualifiedBizCount')"
                        :maxlength="10"
                        :disabled="!scope.row.orgGoodsId" v-model="scope.row.unqualifiedBizCount">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="人份剂次" prop="qualifiedBizServings" width="65px">
            <template slot-scope="scope">
              <el-input :maxlength="10"
                        @change="setQualifiedActualServings(scope.row)"
                        @input="checkNumber(scope.row,'qualifiedBizServings')"
                        :disabled="!scope.row.orgGoodsId" v-model="scope.row.qualifiedBizServings"/>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="实物库存" width="60px">
          <el-table-column
            align="center"
            label="合格" prop="qualifiedCount" width="65px">
            <template slot-scope="scope">
              <el-input @input="checkNumber(scope.row,'qualifiedCount')"
                        :maxlength="10"
                        :disabled="!scope.row.orgGoodsId" v-model="scope.row.qualifiedCount">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="不合格" prop="unqualifiedCount" width="65px">
            <template slot-scope="scope">
              <el-input @input="checkNumber(scope.row,'unqualifiedCount')"
                        :maxlength="10"
                        :disabled="!scope.row.orgGoodsId" v-model="scope.row.unqualifiedCount">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="人份剂次" prop="qualifiedActualServings" width="65px">
            <template slot-scope="scope">
              <el-input @input="checkNumber(scope.row,'qualifiedActualServings')"
                        :maxlength="10"
                        :disabled="!scope.row.orgGoodsId" v-model="scope.row.qualifiedActualServings"/>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          width="40">
          <template slot-scope="scope">
            <el-button type="text" size="small" style="padding: 0" @click="addTable">增加</el-button>
            <el-button @click="eddTable(scope)" size="small" style="padding: 0;margin: 0" type="text"
                       v-show="materials.length>1">删除
            </el-button>
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
        <el-button @click="reset" v-show="this.showFlag">修改</el-button>
        <el-button :loading="loading" @click="save" type="success" v-show="this.showFlag">保存</el-button>
      </el-row>
    </div>
  </div>
</template>
<script>
  import {Address, Vaccine} from '@/resources';
  import previewDialog from './previewDialog';

  export default {
    components: {previewDialog},
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
        warehouses: [],
        orgGoods: [],
        form: {},
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 15
        },
        currentId: '',
        showFlag: false,
        loading: false
      };
    },
    mounted() {
      this.initTable();
      this.initOrgWarehouse();
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
        // 删除未选货品的数据行
        for (let i = 0; i < this.materials.length; i++) {
          let val = this.materials[i];
          if (!val.orgGoodsId) {
            this.materials.splice(i, 1);
            i--;
          }
        }
        if (!this.materials.length) {
          this.initTable();
          return this.$notify.info('请先填写数据');
        }
        for (let i = 0; i < this.materials.length; i++) {
          let val = this.materials[i];
          if (!val.orgGoodsId || !val.batchNumberId || val.availableCount === '' || val.unqualifiedBizCount === '' ||
            val.qualifiedBizServings === '' || val.qualifiedCount === '' || val.unqualifiedCount === '' || val.qualifiedActualServings === '') {
            return this.$notify.info('请输入完整数据');
          }
          if (val.availableCount > 2147483647 || val.unqualifiedBizCount > 2147483647 ||
            val.qualifiedBizServings > 2147483647 || val.qualifiedCount > 2147483647 ||
            val.unqualifiedCount > 2147483647 || val.qualifiedActualServings > 2147483647) {
            return this.$notify.warning('输入的数据超过最大数值限制');
          }
        }
        // 校验是否有同货品同批号的数据，如果存在则提示
        for (var i = 0; i < this.materials.length; i++) {
          let temp = this.materials[i];
          for (var j = 0; j < this.materials.length; j++) {
            let next = this.materials[j];
            if (temp.orgGoodsId === next.orgGoodsId && temp.batchNumberId === next.batchNumberId && i !== j) {
              return this.$notify.info('存在同货品同批号的数据');
            }
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
      setQualifiedActualServings(item) {
        if (!item.qualifiedActualServings && item.qualifiedBizServings) {
          item.qualifiedActualServings = item.qualifiedBizServings;
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
        // 校验数据最大10位数
        if (item[itemName]) {
          let flag = new RegExp('^[1-9]\\d*|0$').test(item[itemName]);
          if (!flag) {
            item[itemName] = '';
            return this.$notify.warning('请输入正整数!');
          }
        }
      },
      //动态表格的方法
      addTable() {
        this.materials.push({
          orgGoodsId: '',
          batchNumberId: '',
          batchNumber: '',
          expiryDate: '',
          availableCount: null,
          unqualifiedBizCount: null,
          qualifiedBizServings: null,
          qualifiedCount: null,
          unqualifiedCount: null,
          qualifiedActualServings: null,
          orgGoodsDto: {},
          measurementUnit: '',
          specifications: '',
          factoryName: '',
          batchNumberList: []
        });
      },
      initTable() {
        for (let i = 0; i < 5; i++) {
          this.materials.push({
            orgGoodsId: '',
            batchNumberId: '',
            batchNumber: '',
            expiryDate: '',
            availableCount: null,
            unqualifiedBizCount: null,
            qualifiedBizServings: null,
            qualifiedCount: null,
            unqualifiedCount: null,
            qualifiedActualServings: null,
            orgGoodsDto: {},
            measurementUnit: '',
            specifications: '',
            factoryName: '',
            batchNumberList: []
          });
        }
      },
      eddTable(scope) {
        // 如果数据行都没填写数据，至少保留一行
        if (this.materials.length > 1) {
          this.materials.splice(scope.$index, 1);
        }
      },
      orgGoodsChange(item) {
        item.batchNumberId = '';
        item.batchNumber = '';
        item.expiryDate = '';
        item.availableCount = '';
        item.unqualifiedBizCount = 0;
        item.qualifiedBizServings = '';
        item.qualifiedCount = '';
        item.unqualifiedCount = 0;
        item.qualifiedActualServings = '';
        item.measurementUnit = '';
        item.specifications = '';
        item.factoryName = '';
        item.batchNumberList = [];
        this.filterBatchNumber(null, item);
        // 设置多余属性值
        if (item.orgGoodsId) {
          this.orgGoods.forEach(i => {
            if (i.orgGoodsDto.id === item.orgGoodsId) {
              item.orgGoodsDto = JSON.parse(JSON.stringify(i.orgGoodsDto));
              item.measurementUnit = item.orgGoodsDto.goodsDto.measurementUnit;
              item.specifications = item.orgGoodsDto.goodsDto.specifications;
              item.factoryName = item.orgGoodsDto.goodsDto.factoryName;
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
        Vaccine.query({
          keyWord: query,
          status: true,
          deleteFlag: false,
          auditedStatus: '1'
        }).then(res => {
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
          this.$set(item, 'batchNumberList', res.data.list);
        });
      },
      setBatchNumber(item) {
        if (item.batchNumberId) {
          item.batchNumberList.forEach(i => {
            if (i.id === item.batchNumberId) {
              item.batchNumber = i.batchNumber;
              item.expiryDate = i.expirationDate;
            }
          });
        }
      },
      initOrgWarehouse(query) {
        let orgId = this.$store.state.user.userCompanyAddress;
        Address.queryAddress(orgId, {
          orgId: orgId,
          deleteFlag: false,
          auditedStatus: '1',
          status: '0',
          keyword: query
        }).then(res => {
          this.warehouses = res.data;
          if (res.data) {
            this.warehouseId = res.data[0].id;
          }
        });
      },
      queryOrgWarehouse(query) {
        let orgId = this.$store.state.user.userCompanyAddress;
        Address.queryAddress(orgId, {
          orgId: orgId,
          deleteFlag: false,
          auditedStatus: '1',
          status: '0',
          keyword: query
        }).then(res => {
          this.warehouses = res.data;
        });
      },
      add() {
        for (let i = 0; i < this.materials.length; i++) {
          let val = this.materials[i];
          if (!val.orgGoodsId || !val.batchNumberId || val.availableCount === '' || val.unqualifiedBizCount === '' ||
            val.qualifiedBizServings === '' || val.qualifiedCount === '' || val.unqualifiedCount === '' || val.qualifiedActualServings === '') {
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
          if (!val.orgGoodsId || !val.batchNumberId || val.availableCount === '' || val.unqualifiedBizCount === '' ||
            val.qualifiedBizServings === '' || val.qualifiedCount === '' || val.unqualifiedCount === '' || val.qualifiedActualServings === '') {
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
        this.loading = true;
        this.$http.put('/erp-stock/batch/import', dataList).then(() => {
          this.loading = false;
          this.$notify.success({
            message: '期初库存录入成功'
          });
          this.$router.push({
            path: '/store/request/bizServing'
          });
        }).catch(error => {
          this.loading = false;
          this.$notify.error({
            message: '期初库存录入失败'
          });
        });
      }
    }
  };
</script>
