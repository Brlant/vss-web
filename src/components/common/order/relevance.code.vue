<style lang="scss" scoped>
@import '../../../assets/mixins';

.product-code-list {
  margin-top: 20px;
  text-align: center;
  border-collapse: collapse;
  font-size: 12px;

  td {
    height: 24px;
    border: 1px solid #dfe6ec;
  }

}

.t-head {
  background: #eef1f6;
  color: #1f2d3d;
  font-weight: bold;
}

.btn-group {
  margin-bottom: 30px;
  overflow: hidden;

  .download-icon {
    margin-top: 10px;
    cursor: pointer;

    &:hover a {
      color: $activeColor;
    }
  }
}

.empty-info {
  &.mini-empty-info {
    height: 60px;
  }
}

.qp-box {
  &.accessory {
    margin-bottom: 20px;
    border: 1px solid #eee;
    border-radius: 5px;
    padding: 0 20px 10px 20px;

    h2 {
      line-height: 20px;
      margin: 10px 0;
      padding: 0;
    }

    .accessory-item {
      margin-top: 10px;
    }
  }

  .accessory-list {
    .show-list {
      .list-item {
        .attachment-delete, .download-link {
          float: right;
          padding: 0 10px;
          color: #fff;
          font-size: 16px;
        }

        &:hover .attachment-delete {
          color: red;
        }

        &:hover .download-link {
          color: #1c8de0;
        }
      }
    }
  }
}

</style>
<template>
  <div>
    <div v-loading="loadingData">
      <div class="order-list clearfix">
        <h2>合计信息</h2>
        <el-row class="order-list-header t-head" style="margin:0">
          <el-col :span="8">疫苗名称</el-col>
          <el-col :span="4">批号</el-col>
          <el-col :span="6">生产单位</el-col>
          <el-col :span="3">生产日期</el-col>
          <el-col :span="3">数量</el-col>
        </el-row>
        <el-row v-if="!totalInfoList.length">
          <el-col :span="24">
            <div class="empty-type-info mini">暂无信息</div>
          </el-col>
        </el-row>
        <div v-else class="order-list-body">
          <div v-for="item in totalInfoList" class="order-list-item order-list-item-bg"
               style="margin-left: 0;margin-right: 0">
            <el-row>
              <el-col :span="8" class="R pt10">
                <span>{{ item.goodsName }}</span>
              </el-col>
              <el-col :span="4" class="pt">
                <span>{{ item.batchNumber }}</span>
              </el-col>
              <el-col :span="6" class="pt">
                <span>{{ item.factoryName }}</span>
              </el-col>
              <el-col :span="3" class="pt">
                <span>{{ item.productionDate | date}}</span>
              </el-col>
              <el-col :span="3" class="pt">
                <span>{{ item.count }}</span>
              </el-col>
            </el-row>
          </div>
        </div>

      </div>
      <div style="margin-bottom: 10px; margin-top: 20px;overflow: hidden">
        <h2 style="display: inline-block">追溯码信息</h2>
      </div>
      <code-search :currentOrder="currentOrder" :index="index" :type="type" @search="search"/>
      <div class="order-list clearfix">

        <el-row class="order-list-header t-head" style="margin:0">
          <el-col :span="8">追溯码</el-col>
          <el-col :span="8">疫苗名称</el-col>
          <el-col :span="5">批号</el-col>
          <el-col :span="3">包装类型</el-col>
        </el-row>
        <el-row v-if="!traceCodes.length">
          <el-col :span="24">
            <div class="empty-type-info mini">暂无信息</div>
          </el-col>
        </el-row>
        <div v-else class="order-list-body">
          <div v-for="item in traceCodes" class="order-list-item order-list-item-bg"
               style="margin-left: 0;margin-right: 0">
            <el-row>
              <el-col :span="8" class="R pt10">
                <span>{{ item.code }}</span>
              </el-col>
              <el-col :span="8" class="pt">
                <span>{{ item.goodsName }}</span>
                <div class="select-other-info" style="margin-left: 0">
                  <div>
                    <el-tooltip class="item" content="规格" effect="dark" placement="right">
                      <span>{{item.specification}}</span>
                    </el-tooltip>
                  </div>
                  <div>
                    <el-tooltip class="item" content=生产单位 effect="dark" placement="right">
                      <span>{{item.factoryName}}</span>
                    </el-tooltip>
                  </div>
                </div>
              </el-col>
              <el-col :span="5" class="pt">
                <span>{{ item.batchNumber }}</span>
              </el-col>
              <el-col :span="3" class="pt">
                <span>{{ packageType[item.packageScheme-1] }}</span>
              </el-col>
            </el-row>
          </div>
        </div>

      </div>
      <div v-show="(traceCodes.length || pager.currentPage !== 1) && !loadingData" class="text-center">
        <el-pagination :current-page="pager.currentPage" :page-size="pager.pageSize"
                       :page-sizes="[10,20,50,100]"
                       :total="pager.count" layout="total ,sizes, prev, pager, next, jumper"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import {http} from '@/resources';
import utils from '@/tools/utils';
import codeSearch from './code-search';

export default {
  props: {
    currentOrder: {
      required: true,
      type: Object,
      default: function () {
        return {};
      }
    },
    index: {
      type: Number,
      default: -1
    },
    type: String
  },
  components: {codeSearch},
  data() {
    return {
      loadingData: false,
      showSearch: true,
      traceCodes: [],
      totalTraceCodes: [],
      filters: {
        code: ''
      },
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10
      },
      packageType: utils.packageType,
      doing: false,
      totalInfoList: []
    };
  },
  watch: {
    index(val) {
      this.filters = {};
      if (val !== 8) return;
      this.getTraceCodes(1);
    },
  },
  methods: {
    search(val) {
      this.filters = Object.assign({}, val);
      this.getTraceCodes(1);
    },
    handleSizeChange(val) {
      this.pager.pageSize = val;
      window.localStorage.setItem('currentPageSize', val);
      this.filterTraceCodes(1);
    },
    handleCurrentChange(val) {
      this.filterTraceCodes(val);
    },
    getCurrentList(pageNo) {
      this.loadingData = true;
      this.pager.currentPage = pageNo;
      const {pager} = this;
      let start = (pageNo - 1) * pager.pageSize;
      let end = pageNo * pager.pageSize;
      let code = this.filters.code;
      this.traceCodes = this.totalTraceCodes.filter(f => !code || code && f.code.includes(code))
        .slice(start, end > pager.count ? pager.count : end);
      setTimeout(() => {
        this.loadingData = false;
      }, 100);
    },
    filterTraceCodes(pageNo) {
      let code = this.filters.code;
      const curTraceCodes = this.totalTraceCodes.filter(f => !code || code && f.code.includes(code));
      this.pager.count = curTraceCodes.length;
      this.getCurrentList(pageNo);
    },
    getTraceCodes(pageNo) {
      if (pageNo === 1) {
        this.pager.count = 0;
      }
      this.pager.currentPage = pageNo;
      let params = Object.assign({
        pageNo: pageNo,
        pageSize: this.pager.pageSize,
        type: this.type,
        sourceOrgId: this.currentOrder.type === '0' ? this.currentOrder.supplierId : this.currentOrder.orgId,
        directOrgId: this.currentOrder.type === '0' ? this.currentOrder.orgId : this.currentOrder.customerId
      }, this.filters);
      this.loadingData = true;
      // this.currentOrder.orderNo = '201805250001'; // 201805250001
      http.get(`/vss-code/${this.currentOrder.orderNo}/trace-code/list`, {params}).then(res => {
        this.totalTraceCodes = res.data.list || [];
        this.filterTraceCodes(1);
        this.totalInfoList = res.data.statisticsList || [];
        this.loadingData = false;
      });
    }
  }
};
</script>
