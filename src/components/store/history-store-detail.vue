<style lang="scss" scoped>
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
</style>
<template>
  <div>
    <div class="content-part">
      <div class="content-right content-padding">
        <h3>库存详情</h3>
        <el-row class="batch-info">
          <el-col :span="12">
            <oms-row :span="span" label="货主">{{ currentItem.orgName }}</oms-row>
            <oms-row :span="span" label="货主疫苗名称">{{currentItem.goodsName }}</oms-row>
            <oms-row :span="span" label="生产单位">{{ currentItem.factoryName }}</oms-row>
            <oms-row :span="span" label="批号">{{ currentItem.batchNumber }}</oms-row>
            <oms-row :span="span" label="有效期">{{ currentItem.expiryDate | date }}</oms-row>
          </el-col>
          <el-col :span="12">
            <!--<oms-row label="业务剂次库存" :span="span">{{ currentItem.qualifiedBizServings }}</oms-row>-->
            <oms-row :span="span" label="合格业务库存">{{ currentItem.availableCount }}</oms-row>
            <oms-row :span="span" label="不合格业务库存">{{ currentItem.unqualifiedBizCount }}</oms-row>
            <oms-row :span="span" label="业务停销">{{ currentItem.undeterminedCount }}</oms-row>
            <!--<oms-row label="实物剂次库存" :span="span">{{ currentItem.qualifiedActualServings }}</oms-row>-->
            <oms-row :span="span" label="合格实物库存">{{ currentItem.qualifiedCount }}</oms-row>
            <oms-row :span="span" label="不合格实物库存">{{ currentItem.unqualifiedCount }}</oms-row>
            <oms-row :span="span" label="在途库存">{{ currentItem.transitCount }}</oms-row>
            <oms-row :span="span" label="库存总数">{{ currentItem.totalCount }}</oms-row>
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
          <tr v-for="i in storeDetails" v-else :key="i.id" class="tr-ntd-bg">
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
import {erpStock} from '@/resources';

export default {
  props: ['currentItem', 'isShowLock'],
  data() {
    return {
      loadingData: false,
      storeDetails: [],
      span: 9
    };
  },
  watch: {
    currentItem() {
      this.queryStoreDetails();
    }
  },
  methods: {
    queryStoreDetails() {
      this.storeDetails = [];
      if (!this.currentItem.id) return;
      this.loadingData = true;
      erpStock.queryHistoryDetail(this.currentItem.backupsInfoId, this.currentItem.id).then(res => {
        this.loadingData = false;
        this.storeDetails = res.data.list;
      });
    }
  }
};
</script>
