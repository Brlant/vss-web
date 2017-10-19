<style lang="less" scoped="">
  .product-detail-list {
    margin-top: 20px;
    text-align: center;
    border-collapse: collapse;
    font-size: 12px;
    width: 100%;
    > tbody > tr > td {
      padding: 5px;
      border: 1px solid #dfe6ec;
    }
    .t-head {
      background: #eef1f6;
      color: #1f2d3d;
      font-weight: bold;
    }
  }

  .bg-white {
    background: #fff;
  }

  .bg-red {
    background: #f70f0f;
  }

  .color-red {
    color: red;
  }

  .content-right {
    > h3 {
      text-align: center;
    }
    padding: 0 10px;
  }
</style>
<template>
  <div>
    <div class="content-right content-padding">
      <h3>收货详情</h3>
      <table class="product-detail-list">
        <tbody>
        <tr>
          <td colspan="2" width="120px" class="t-head">货品</td>
          <td colspan="2" width="120px" class="t-head">生产厂商</td>
          <td colspan="2" width="120px" class="t-head">批号</td>
          <td colspan="2" width="120px" class="t-head">生产日期</td>
          <td colspan="2" width="120px" class="t-head">有效期</td>
          <td colspan="2" width="120px" class="t-head">整件数</td>
          <td colspan="2" width="120px" class="t-head">散件数</td>
          <td colspan="2" width="120px" class="t-head">合计数量</td>
        </tr>
        <tr v-for="item in details">
          <td colspan="2">
            <div>
              <el-tooltip class="item" effect="dark" content="货主货品名称" placement="right">
                <span style="font-size: 14px;line-height: 20px">{{item.goodsName}}</span>
              </el-tooltip>
            </div>
            <div>
              <el-tooltip class="item" effect="dark" content="规格" placement="right">
                <span style="font-size: 12px;color:#999">{{ item.specification }}</span>
              </el-tooltip>
            </div>
          </td>
          <td colspan="2">
            {{item.productFactory}}
          </td>
          <td colspan="2">{{ item.batchNumber || '无' }}</td>
          <td colspan="2">{{ item.productionDate | date }}</td>
          <td colspan="2">{{ item.expirationDate | date }}</td>
          <td colspan="2">
            <div v-show="item.largeBoxCount">
              大包装 {{ item.largeBoxCount }}
            </div>
            <div v-show="item.mediumBoxCount">
              中包装 {{ item.mediumBoxCount }}
            </div>
            <div v-show="item.smallBoxCount">
              小包装 {{ item.smallBoxCount }}
            </div>
          </td>
          <td colspan="2">{{ item.bulkBoxCount }}</td>
          <td colspan="2">
            {{ item.totalCount }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
  import { http } from '@/resources';

  export default {
    props: {
      waveId: String
    },
    data () {
      return {
        details: [],
        plateNumber: '',
        packageType: ['大包装', '中包装', '小包装']
      };
    },
    watch: {
      waveId (val) {
        if (!val) return;
        this.details = [];
        this.getGoodsDetails();
      }
    },
    methods: {
      getGoodsDetails () {
        http.get(`/erp-receipt/wave-task/${this.waveId}/goods`).then(res => {
          this.details = res.data;
        });
      }
    }
  };
</script>
