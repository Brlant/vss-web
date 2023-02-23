<style lang="scss" scoped="">
@import "../../assets/mixins";

.content-part {
  .content-right {
    > h3 {
      left: 0;
    }

    left: 0;
    padding-left: 25px;
    padding-right: 25px;
  }
}

.tr-bg {
  background: #eeeeee;
}

.table > tbody > tr:first-child > td {
  border-top: 0;
}

.tr-ntd-bg {
  &:nth-child(odd) {
    background: #ffffff;
  }

  &:nth-child(even) {
    background: $dialog-left-bg;
  }
}

.batch-info {
  .oms-row {
    margin-bottom: 10px;
  }
}

h2 {
  margin: 5px 0 5px 0;
  background: #eee;
  border-left: 10px solid $activeColor;
}

.font-color {
  color: darkgray;
}
</style>
<template>
  <div>
    <div class="content-part">
      <div class="content-right content-padding">
        <h3>库存详情信息</h3>

        <h2>基础信息</h2>
        <el-row class="batch-info">
          <el-col :span="12">
            <oms-row label="货主" :span="span">{{ currentItem.orgName }}</oms-row>
            <oms-row :span="span" label="货主疫苗名称">{{ currentItem.goodsName }}</oms-row>
            <oms-row :span="span" label="疫苗主档通用名称">{{ currentItem.platformGoodsName }}</oms-row>
            <oms-row label="生产厂商" :span="span">{{ currentItem.factoryName }}</oms-row>
            <oms-row label="仓库名称" :span="span" v-show="currentItem.warehouseName">{{
                currentItem.warehouseName
              }}
            </oms-row>
          </el-col>
          <el-col :span="12">
            <oms-row :span="span" label="疫苗编码">{{ currentItem.orgGoodsCode }}</oms-row>
            <oms-row :span="span" label="疫苗种类">
              <dict :dict-key="currentItem.vaccineType" dict-group="vaccineSign"></dict>
            </oms-row>
            <oms-row label="批号" :span="span">{{ currentItem.batchNumber }}</oms-row>
            <oms-row label="有效期" :span="span">{{ currentItem.expiryDate | date }}</oms-row>
            <oms-row label="仓库地址" :span="span" v-show="currentItem.warehouseAddress">{{
                currentItem.warehouseAddress
              }}
            </oms-row>
          </el-col>
        </el-row>
        <el-table :data="storeItem" class="header-list store border-black" border
                  :header-row-class-name="'headerClass'" v-loading="loadingData"
                  style="width: 100%">
          <el-table-column label="业务库存" align="center">
            <el-table-column prop="qualifiedBizServings" label="剂次库存" :render-header="formatHeader" align="center"
                             width="100">
              <template slot-scope="scope">
                <span>{{ currentItem.qualifiedBizServings }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="availableCount" label="合格" :render-header="formatHeader" align="center"
                             width="100">
              <template slot-scope="scope">
                <span>{{ currentItem.availableCount }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="unqualifiedBizCount" label="不合格" :render-header="formatHeader" align="center"
                             width="100">
              <template slot-scope="scope">
                <span>{{ currentItem.unqualifiedBizCount }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="undeterminedCount" label="业务停销" :render-header="formatHeader" align="center"
                             width="110">
              <template slot-scope="scope">
                <span>{{ currentItem.undeterminedCount }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="实物库存" align="center">
            <el-table-column prop="qualifiedActualServings" label="剂次库存" :render-header="formatHeader" align="center"
                             width="100">
              <template slot-scope="scope">
                <span>{{ currentItem.qualifiedActualServings }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="qualifiedCount" label="合格" :render-header="formatHeader" align="center"
                             width="100">
              <template slot-scope="scope">
                <span>{{ currentItem.qualifiedCount }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="unqualifiedCount" label="不合格" :render-header="formatHeader" align="center"
                             width="100">
              <template slot-scope="scope">
                <span>{{ currentItem.unqualifiedCount }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="transitCount" label="出库库存" :render-header="formatHeader" align="center"
                             width="100">
              <template slot-scope="scope">
                <span>{{ currentItem.transitCount }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="totalCount" label="库存总数" :render-header="formatHeader" align="center">
              <template slot-scope="scope">
                <span>{{ currentItem.totalCount }}</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
<!--        <h2>库存流水</h2>-->
<!--        <el-form class="advanced-query-form" onsubmit="return false">-->
<!--          <el-row>-->
<!--            <el-col :span="14">-->
<!--              <oms-form-row :span="4" label="业务时间">-->
<!--                <el-date-picker v-model="bizDateAry" :default-time="['00:00:00', '23:59:59']" placeholder="请选择日期"-->
<!--                                type="datetimerange">-->
<!--                </el-date-picker>-->
<!--              </oms-form-row>-->
<!--            </el-col>-->
<!--            <el-col :span="10">-->
<!--              <oms-form-row :span="4" label="业务编号">-->
<!--                <el-input v-model="searchWord.orderNo" clearable size="mini" placeholder="订单号/受种者编码"></el-input>-->
<!--              </oms-form-row>-->
<!--            </el-col>-->
<!--            <el-col :span="8">-->
<!--              <oms-form-row :span="6" label="追溯码">-->
<!--                <el-input v-model="searchWord.traceCode" clearable size="mini"></el-input>-->
<!--              </oms-form-row>-->
<!--            </el-col>-->
<!--            <el-col :span="8">-->
<!--              <oms-form-row :span="6" label="业务ID">-->
<!--                <el-input v-model="searchWord.objectId" clearable size="mini"></el-input>-->
<!--              </oms-form-row>-->
<!--            </el-col>-->
<!--            <el-col :span="8">-->
<!--              <oms-form-row :span="2" label="">-->
<!--                <el-button native-type="submit" type="primary" @click="searchStockLog">查询</el-button>-->
<!--                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>-->
<!--                <perm :label="perm">-->
<!--                  <el-button :disabled="exportFlag" :plain="true" style="margin-left: 10px" type="success"-->
<!--                             @click="exportFile">-->
<!--                    {{ exportFlag ? '导出中' : '导出Excel' }}-->
<!--                  </el-button>-->
<!--                </perm>-->
<!--              </oms-form-row>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--        </el-form>-->
<!--        <el-table :data="stockLogList" class="header-list store border-black" border-->
<!--                  :header-row-class-name="'headerClass'" v-loading="loadingStockLog"-->
<!--                  style="width: 100%">-->

<!--          <el-table-column label="业务时间" prop="expiryDate" width="100">-->
<!--            <template slot-scope="scope">-->
<!--              <span>{{ scope.row.createTime | time }}</span>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column label="业务类型" prop="expiryDate">-->
<!--            <template slot-scope="scope">-->
<!--              <span>{{ scope.row.actionType }}</span>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column label="业务编号" prop="expiryDate">-->
<!--            <template slot-scope="scope">-->
<!--              <span>-->
<!--                <el-tooltip effect="dark" :content="'业务ID：'+scope.row.objectId" placement="right">-->
<!--                  <span>{{ scope.row.orderNo }}</span>-->
<!--                </el-tooltip>-->
<!--              </span>-->
<!--            </template>-->
<!--          </el-table-column>-->

<!--          <el-table-column align="center" label="业务库存">-->
<!--            <el-table-column :render-header="formatLogHeader" label="人份剂次"-->
<!--                             prop="qualifiedBizServings" width="50">-->
<!--              <template slot-scope="scope">-->
<!--                <span>{{ formatNumber(scope.row.qualifiedBizServingsX) }}</span>-->
<!--                <div class="font-color">{{ scope.row.qualifiedBizServings }}</div>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column :render-header="formatLogHeader" label="合格" prop="availableCount"-->
<!--                             width="50">-->
<!--              <template slot-scope="scope">-->
<!--                <span>{{ formatNumber(scope.row.availableCountX) }}</span>-->
<!--                <div class="font-color">{{ scope.row.availableCount }}</div>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column :render-header="formatLogHeader" label="不合格" prop="unQualifiedBizCount" width="50">-->
<!--              <template slot-scope="scope">-->
<!--                <span>{{ formatNumber(scope.row.unQualifiedBizCountX) }}</span>-->
<!--                <div class="font-color">{{ scope.row.unQualifiedBizCount }}</div>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column :render-header="formatLogHeader" label="业务停销" prop="undeterminedActualCount"-->
<!--                             width="50">-->
<!--              <template slot-scope="scope">-->
<!--                <span>{{ formatNumber(scope.row.undeterminedActualCountX) }}</span>-->
<!--                <div class="font-color">{{ scope.row.undeterminedActualCount }}</div>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column :render-header="formatLogHeader" label="入库在途" prop="inOrderTransitCount"-->
<!--                             width="50">-->
<!--              <template slot-scope="scope">-->
<!--                <span>{{ formatNumber(scope.row.inOrderTransitCountX) }}</span>-->
<!--                <div class="font-color">{{ scope.row.inOrderTransitCount }}</div>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--          </el-table-column>-->
<!--          <el-table-column align="center" label="实物库存">-->
<!--            <el-table-column :render-header="formatLogHeader" label="人份剂次"-->
<!--                             prop="qualifiedActualServings" width="50">-->
<!--              <template slot-scope="scope">-->
<!--                <span>{{ formatNumber(scope.row.qualifiedActualServingsX) }}</span>-->
<!--                <div class="font-color">{{ scope.row.qualifiedActualServings }}</div>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column :render-header="formatLogHeader" label="合格" prop="qualifiedActualCount"-->
<!--                             width="50">-->
<!--              <template slot-scope="scope">-->
<!--                <span>{{ formatNumber(scope.row.qualifiedActualCountX) }}</span>-->
<!--                <div class="font-color">{{ scope.row.qualifiedActualCount }}</div>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column :render-header="formatLogHeader" label="不合格" prop="unqualifiedActualCount"-->
<!--                             width="50">-->
<!--              <template slot-scope="scope">-->
<!--                <span>{{ formatNumber(scope.row.unqualifiedActualCountX) }}</span>-->
<!--                <div class="font-color">{{ scope.row.unqualifiedActualCount }}</div>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column :render-header="formatLogHeader" label="出库库存" prop="transitCount"-->
<!--                             width="50">-->
<!--              <template slot-scope="scope">-->
<!--                <span>{{ formatNumber(scope.row.transitCountX) }}</span>-->
<!--                <div class="font-color">{{ scope.row.transitCount }}</div>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--          </el-table-column>-->
<!--          <el-table-column label="追溯码" prop="expiryDate" width="100">-->
<!--            <template slot-scope="scope">-->
<!--              <span>{{ scope.row.traceCode }}</span>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--        </el-table>-->
<!--        <div class="text-center" v-show="pager.count>0 && !loadingStockLog" style="padding-bottom: 20px">-->
<!--          <el-pagination :current-page="pager.currentPage" :page-size="pager.pageSize"-->
<!--                         :page-sizes="[10,20,50,100]"-->
<!--                         :total="pager.count" layout="total ,sizes, prev, pager, next, jumper"-->
<!--                         @size-change="handleSizeChange"-->
<!--                         @current-change="handleCurrentChange">-->
<!--          </el-pagination>-->
<!--        </div>-->
      </div>
    </div>
  </div>
</template>
<script type="text/jsx">
import {http} from '@/resources';
import utils from "@/tools/utils";

export default {
  props: {
    currentItem: Object,
    perm: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: 20
      },
      loadingData: false,
      loadingStockLog: false,
      exportFlag: false,
      storeDetails: [],
      stockLogList: [],
      searchWord: {
        startTime: null,
        endTime: null,
        traceCode: '',
        objectId: '',
        orderNo: ''
      },
      bizDateAry: '',
      storeItem: [this.currentItem],
      span: 9
    };
  },
  watch: {
    currentItem() {
      this.queryStoreDetails();
      // 查询库存流水
      this.resetSearchForm();
    }
  },
  computed: {
    orgLevel() {
      return this.$store.state.orgLevel;
    }
  },
  methods: {
    exportFile: function () {
      this.exportFlag = true;
      this.searchWord.startTime = this.$formatAryTime(this.bizDateAry, 0, 'YYYY-MM-DD HH:mm:ss');
      this.searchWord.endTime = this.$formatAryTime(this.bizDateAry, 1, 'YYYY-MM-DD HH:mm:ss');
      let params = Object.assign({}, {erpStockId: this.currentItem.id}, this.searchWord);
      this.$http.get(`/erp-stock/log/export`, {params: params}).then(res => {
        utils.download(res.data.path, '即时库存流水');
        this.exportFlag = false;
      }).catch(error => {
        this.exportFlag = false;
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '导出失败'
        });
      });
    },
    formatNumber(val) {
      if (val == null) {
        return 0;
      }
      if (val > 0) {
        return '+' + val;
      } else {
        return val;
      }
    },
    handleSizeChange(val) {
      this.pager.pageSize = val;
      this.getStockLogs(1);
    },
    handleCurrentChange(val) {
      this.getStockLogs(val);
    },
    getStockLogs(pageNo) {
      this.pager.currentPage = pageNo;
      let params = Object.assign({}, {
        pageNo: pageNo,
        pageSize: this.pager.pageSize,
        erpStockId: this.currentItem.id,
      }, this.searchWord);
      this.loadingStockLog = true;
      this.$http.get('erp-stock/log', {params: params}).then(res => {
        this.stockLogList = res.data.list;
        this.pager.count = res.data.count;
        this.loadingStockLog = false;
      });
    },
    searchStockLog() {
      this.searchWord.startTime = this.$formatAryTime(this.bizDateAry, 0, 'YYYY-MM-DD HH:mm:ss');
      this.searchWord.endTime = this.$formatAryTime(this.bizDateAry, 1, 'YYYY-MM-DD HH:mm:ss');
      this.getStockLogs(1);
    },
    resetSearchForm() {
      this.searchWord = {
        startTime: null,
        endTime: null,
        traceCode: '',
        objectId: '',
        orderNo: ''
      };
      this.bizDateAry = '';
      this.getStockLogs(1);
    },
    queryStoreDetails() {
      this.storeDetails = [];
      if (!this.currentItem.id) return;
      this.loadingData = true;
      http.get(`/erp-stock/${this.currentItem.id}/detail`).then(res => {
        this.loadingData = false;
        this.storeDetails = res.data.list;
      });
    },
    formatLogHeader(h, col) {
      let property = col.column.property;
      let content = '';
      let title = '';
      switch (property) {
        case 'inOrderTransitCount': {
          content = '在运输中的疫苗数量';
          title = '入库在途';
          break;
        }
        case 'qualifiedActualCount': {
          content = '仓库内真实合格疫苗数量';
          title = '合格';
          break;
        }
        case 'unqualifiedActualCount': {
          content = '仓库内真实不合格疫苗数量';
          title = '不合格';
          break;
        }
        case 'transitCount': {
          content = '在运输中的疫苗数量';
          title = '出库库存';
          break;
        }
        case 'totalCount': {
          content = '用于计算资产';
          title = '库存总数';
          break;
        }
        case 'availableCount': {
          content = '用于出库订单的控制，表明可销售的数量';
          title = '合格';
          break;
        }
        case 'unQualifiedBizCount': {
          content = '用于不合格品退货订单控制';
          title = '不合格';
          break;
        }
        case 'undeterminedActualCount': {
          content = '仓库内质量状态待确定而不允许销售的库存数';
          title = '业务停销';
          break;
        }
        case 'qualifiedActualServings': {
          content = '合格库存x人份';
          title = '剂次';
          break;
        }
        case 'qualifiedBizServings': {
          content = '合格库存x人份';
          title = '剂次';
          break;
        }
      }
      return (
        <el-tooltip effect="dark" content={content} placement="top">
          <span>{title}</span>
        </el-tooltip>
      );
    },
    formatHeader(h, col) {
      let property = col.column.property;
      let content = '';
      let title = '';
      switch (property) {
        case 'qualifiedCount': {
          content = '仓库内真实合格疫苗数量';
          title = '合格';
          break;
        }
        case 'unqualifiedCount': {
          content = '仓库内真实不合格疫苗数量';
          title = '不合格';
          break;
        }
        case 'transitCount': {
          content = '在运输中的疫苗数量';
          title = '出库库存';
          break;
        }
        case 'totalCount': {
          content = '用于计算资产';
          title = '库存总数';
          break;
        }
        case 'availableCount': {
          content = '用于出库订单的控制，表明可销售的数量';
          title = '合格';
          break;
        }
        case 'unqualifiedBizCount': {
          content = '用于不合格品退货订单控制';
          title = '不合格';
          break;
        }
        case 'undeterminedCount': {
          content = '仓库内质量状态待确定而不允许销售的库存数';
          title = '业务停销';
          break;
        }
        case 'qualifiedActualServings': {
          content = '合格库存x人份';
          title = '剂次';
          break;
        }
        case 'qualifiedBizServings': {
          content = '合格库存x人份';
          title = '剂次';
          break;
        }
      }
      return (
        <el-tooltip effect="dark" content={content} placement="top">
          <span>{title}</span>
        </el-tooltip>
      );
    }
  }
};
</script>
