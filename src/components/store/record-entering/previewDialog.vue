<template>
  <el-dialog
    title="预览"
    :visible.sync="dialogVisible"
    width="50%"
    :before-close="handleClose">
    <el-table :data="batches" class="header-list store border-black" border
              :header-row-class-name="'headerClass'" v-loading="loadingData" :summary-method="getSummaries"
              :row-class-name="formatRowClass"
              show-summary style="width: 100%">
      <el-table-column prop="goodsName" label="货主疫苗名称" min-width="200" :sortable="true">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="`orgGoodsId[${scope.row.orgGoodsId}]`" placement="right">
            <span>{{scope.row.goodsName}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="orgGoodsCode" label="货主货品编号" min-width="120" :sortable="true">
        <template slot-scope="scope"><span>{{scope.row.orgGoodsCode}}</span></template>
      </el-table-column>
      <el-table-column prop="factoryName" label="疫苗种类" min-width="120" :sortable="true">
        <template slot-scope="scope">
          <dict dict-group="vaccineSign" :dict-key="scope.row.vaccineType"></dict>
        </template>
      </el-table-column>
      <el-table-column prop="platformGoodsName" label="疫苗主档通用名称" min-width="200" :sortable="true">
      </el-table-column>
      <el-table-column prop="factoryName" label="生产单位" min-width="160" :sortable="true"></el-table-column>
      <el-table-column prop="batchNumber" label="批号" :sortable="true" width="110"></el-table-column>

      <el-table-column label="业务库存" align="center">
        <el-table-column prop="qualifiedBizServings" label="人份剂次" :render-header="formatHeader" :sortable="true"
                         width="100" v-if="isBizServing">
          <template slot-scope="scope">
            <span>{{scope.row.qualifiedBizServings}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="availableCount" label="合格" :render-header="formatHeader" :sortable="true"
                         width="100">
          <template slot-scope="scope">
            <span>{{scope.row.availableCount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="unqualifiedBizCount" label="不合格" :render-header="formatHeader" :sortable="true"
                         width="100">
          <template slot-scope="scope">
            <span>{{scope.row.unqualifiedBizCount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="undeterminedCount" label="业务停销" :render-header="formatHeader" :sortable="true"
                         width="110">
          <template slot-scope="scope">
            <span>{{scope.row.undeterminedCount}}</span>
          </template>
        </el-table-column>
      </el-table-column>


      <el-table-column label="实物库存" align="center">
        <el-table-column prop="qualifiedActualServings" label="人份剂次" :render-header="formatHeader" :sortable="true"
                         width="100" v-if="isBizServing">
          <template slot-scope="scope">
            <span>{{scope.row.qualifiedActualServings}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="qualifiedCount" label="合格" :render-header="formatHeader" :sortable="true"
                         width="100">
          <template slot-scope="scope">
            <span>{{scope.row.qualifiedCount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="unqualifiedCount" label="不合格" :render-header="formatHeader" :sortable="true"
                         width="100">
          <template slot-scope="scope">
            <span>{{scope.row.unqualifiedCount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="transitCount" label="在途库存" :render-header="formatHeader" :sortable="true"
                         width="100">
          <template slot-scope="scope">
            <span>{{scope.row.transitCount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalCount" label="库存总数" :render-header="formatHeader" :sortable="true"
                         width="100">
          <template slot-scope="scope">
            <span>{{scope.row.totalCount}}</span>
          </template>
        </el-table-column>
      </el-table-column>


      <el-table-column prop="expiryDate" label="有效期" :sortable="true" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.expiryDate | date}}</span>
        </template>
      </el-table-column>
    </el-table>

    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script type="text/jsx">
  export default {
    name: 'previewDialog',
    data() {
      return {
        loadingData: false,
        dialogVisible: false,
        batches: [],
      };
    },
    methods: {
      handleClose() {
        this.dialogVisible = false;
      },
      show() {
        this.dialogVisible = true;
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
            title = '在途库存';
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
            title = '人份剂次';
            break;
          }
          case 'qualifiedBizServings': {
            content = '合格库存x人份';
            title = '人份剂次';
            break;
          }
        }
        return (
          <el-tooltip effect="dark" content={content} placement="top">
          <span>{title}</span>
          </el-tooltip>
      )
      },

      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if (column.property !== 'availableCount' && column.property !== 'qualifiedCount' &&
            column.property !== 'transitCount' && column.property !== 'unqualifiedCount'
            && column.property !== 'undeterminedCount' && column.property !== 'totalCount' && column.property !== 'unqualifiedBizCount') {
            sums[index] = '';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
          } else {
            sums[index] = '';
          }
        });
        return sums;
      },
      formatRowClass(data) {
        if (this.isValid(data.row) === 1) {
          return 'effective-row';
        }
        if (this.isValid(data.row) === 0) {
          return 'danger-row';
        }
      },
    }
  };
</script>

<style scoped>

</style>
