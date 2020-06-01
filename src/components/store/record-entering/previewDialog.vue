<template>
  <el-table :data="formItem" border class="header-list store border-black"
            v-if="dialogVisible"
            :header-row-class-name="'headerClass'" v-loading="loadingData" :summary-method="getSummaries"
            :row-class-name="formatRowClass"
            show-summary style="width: 100%">
    <el-table-column align="center" fixed="left" label="货主疫苗名称" min-width="180" prop="goodsName">
      <template slot-scope="scope">
        <el-tooltip :content="`orgGoodsId[${scope.row.orgGoodsDto.orgGoodsId}]`" class="item" effect="dark"
                    placement="right">
          <span>{{scope.row.orgGoodsDto.name}}</span>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column align="center" fixed="left" label="货主货品编号" min-width="100" prop="orgGoodsCode">
      <template slot-scope="scope"><span>{{scope.row.orgGoodsDto.goodsNo}}</span></template>
    </el-table-column>
    <el-table-column align="center" label="疫苗种类" min-width="70" prop="factoryName">
      <template slot-scope="scope">
        <dict :dict-key="scope.row.orgGoodsDto.goodsVaccineSign" dict-group="vaccineSign"></dict>
      </template>
    </el-table-column>
    <el-table-column align="center" fixed="left" label="疫苗主档通用名称" min-width="120" prop="orgGoodsDto.goodsDto.name">
    </el-table-column>
    <el-table-column align="center" label="生产单位" min-width="120"
                     prop="orgGoodsDto.goodsDto.factoryName"></el-table-column>
    <el-table-column align="center" label="批号/有效期至" prop="batchNumber" width="110">
      <template slot-scope="scope">
        <div>{{ scope.row.batchNumber }}</div>
        <div>{{ scope.row.expiryDate | date}}</div>
      </template>
    </el-table-column>
      <el-table-column align="center" label="业务库存">
        <el-table-column :render-header="formatHeader" align="center" label="合格"
                         prop="availableCount" width="50px">
          <template slot-scope="scope">
            <span>{{scope.row.availableCount}}</span>
          </template>
        </el-table-column>
        <el-table-column :render-header="formatHeader" align="center" label="不合格"
                         prop="unqualifiedBizCount" width="50px">
          <template slot-scope="scope">
            <span>{{scope.row.unqualifiedBizCount}}</span>
          </template>
        </el-table-column>
        <el-table-column :render-header="formatHeader" align="center" label="人份剂次"
                         prop="qualifiedBizServings" width="50px">
          <template slot-scope="scope">
            <span>{{scope.row.qualifiedBizServings}}</span>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column align="center" label="实物库存" >
        <el-table-column :render-header="formatHeader" align="center" label="合格"
                         prop="qualifiedCount" width="50px">
          <template slot-scope="scope">
            <span>{{scope.row.qualifiedCount}}</span>
          </template>
        </el-table-column>
        <el-table-column :render-header="formatHeader" align="center" label="不合格"
                         prop="unqualifiedCount" width="50px">
          <template slot-scope="scope">
            <span>{{scope.row.unqualifiedCount}}</span>
          </template>
        </el-table-column>
        <el-table-column :render-header="formatHeader" align="center" label="人份剂次"
                         prop="qualifiedActualServings" width="50px">
          <template slot-scope="scope">
            <span>{{scope.row.qualifiedActualServings}}</span>
          </template>
        </el-table-column>
      </el-table-column>
  </el-table>
</template>

<script type="text/jsx">
  export default {
    name: 'previewDialog',
    props: {
      formItem: Array
    },
    data() {
      return {
        loadingData: false,
        dialogVisible: false,
        batches: [],
        materials: []
      };
    },
    methods: {
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
        );
      },

      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if (column.property !== 'availableCount' && column.property !== 'unqualifiedBizCount' &&
            column.property !== 'qualifiedBizServings' && column.property !== 'qualifiedCount'
            && column.property !== 'unqualifiedCount' && column.property !== 'qualifiedActualServings') {
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
      },
    }
  };
</script>

<style scoped>

</style>
