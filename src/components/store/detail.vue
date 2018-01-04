<style lang="less" scoped="">
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
      background: @dialog-left-bg;
    }
  }

  .batch-info {
    .oms-row {
      margin-bottom: 10px;
    }
  }
</style>
<template>
  <div>
    <div class="content-part">
      <div class="content-right content-padding">
        <h3>库存详情</h3>
        <el-row class="batch-info">
          <el-col :span="12">
            <oms-row label="货主" :span="span">{{ currentItem.orgName }}</oms-row>
            <oms-row label="货主货品名称" :span="span">{{currentItem.goodsName }}</oms-row>
            <oms-row label="生产厂商" :span="span">{{ currentItem.factoryName }}</oms-row>
            <oms-row label="批号" :span="span">{{ currentItem.batchNumber }}</oms-row>
          </el-col>
          <el-col :span="12">
            <oms-row label="可用库存" :span="span" v-show="orgLevel !== 3">{{ currentItem.availableCount }}</oms-row>
            <oms-row label="实际合格库存" :span="span">{{ currentItem.qualifiedCount }}</oms-row>
            <oms-row label="在途库存" :span="span" v-show="orgLevel !== 3">{{ currentItem.transitCount }}</oms-row>
            <oms-row label="实际不合格库存" :span="span">{{ currentItem.unqualifiedCount }}</oms-row>
            <oms-row label="有效期" :span="span">{{ currentItem.expiryDate | date }}</oms-row>
          </el-col>
        </el-row>
        <table class="table clearfix">
          <thead>
          <tr class="tr-bg">
            <td width="300px">仓库名称/地址</td>
            <td width="150px">数量</td>
          </tr>
          </thead>
          <tbody>
          <tr v-if="loadingData">
            <td colspan="3" style="border: 0">
              <oms-loading :loading="loadingData"></oms-loading>
            </td>
          </tr>
          <tr v-else-if="storeDetails.length == 0">
            <td colspan="3" style="border: 0">
              <div class="empty-info">
                暂无信息
              </div>
            </td>
          </tr>
          <tr v-else="" v-for="i in storeDetails" :key="i.id" class="tr-ntd-bg">
            <td>
              <div>
                {{ i.warehouseName }}
              </div>
              <div>
                {{ i.warehouseAddress }}
              </div>
            </td>
            <td>
              {{ i.realCount }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
  import { http } from '@/resources';

  export default {
    props: ['currentItem'],
    data () {
      return {
        loadingData: false,
        storeDetails: [],
        packSizeTyps: [
          '大包装',
          '中包装',
          '小包装',
          '散件'
        ],
        span: 9
      };
    },
    watch: {
      currentItem () {
        this.queryStoreDetails();
      }
    },
    computed: {
      orgLevel () {
        return this.$store.state.orgLevel;
      }
    },
    methods: {
      queryStoreDetails () {
        this.storeDetails = [];
        if (!this.currentItem.id) return;
        this.loadingData = true;
        http.get(`/erp-stock/${this.currentItem.id}/detail`).then(res => {
          this.loadingData = false;
          this.storeDetails = res.data.list;
        });
      },
      formatSize (size) {
        return size === 0 ? '大包装'
          : size === 1 ? '中包装'
            : size === 2 ? '小包装'
              : size === 3 ? '散件' : '';
      }
    }
  };
</script>
