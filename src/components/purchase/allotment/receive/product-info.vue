<style scoped>
  .goods-info {
    font-size: 14px;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #d9d9d9;
  }
</style>
<template>
  <div v-if="currentItem.orgGoodsDto" class="goods-info">
    <el-row>
      <el-col :span="12">
        <oms-row label="货品名称" :span="8">
          {{currentItem.orgGoodsDto.goodsDto.name}}
        </oms-row>
        <oms-row label="规格" :span="8">
          {{currentItem.orgGoodsDto.goodsDto.specifications}}
        </oms-row>
        <oms-row label="数量" :span="8">
          {{currentItem.amount}}
          <dict :dict-group="'measurementUnit'" :dict-key="currentItem.orgGoodsDto.goodsDto.measurementUnit"></dict>
        </oms-row>
        <oms-row label="散件" :span="8">
          <span v-show="currentItem.orgGoodsDto.goodsDto.smallPacking">
                      {{currentItem.orgGoodsDto.goodsDto.smallPacking}}
          <dict :dict-group="'measurementUnit'" :dict-key="currentItem.orgGoodsDto.goodsDto.measurementUnit"></dict>/
          <dict :dict-group="'shipmentPackingUnit'"
                :dict-key="currentItem.orgGoodsDto.goodsDto.smallPackageUnit"></dict>
          </span>
        </oms-row>
        <oms-row label="整件" :span="8">
          <span v-show="currentItem.orgGoodsDto.goodsDto.largePacking">
          {{currentItem.orgGoodsDto.goodsDto.largePacking}}
          <dict :dict-group="'measurementUnit'" :dict-key="currentItem.orgGoodsDto.goodsDto.measurementUnit"></dict>
          /
          <dict :dict-group="'shipmentPackingUnit'"
                :dict-key="currentItem.orgGoodsDto.goodsDto.largePackageUnit"></dict>
          </span>

        </oms-row>
        <oms-row label="生产厂商" :span="8">
          {{currentItem.orgGoodsDto.goodsDto.factoryName}}
        </oms-row>
      </el-col>
      <el-col :span="12">
        <oms-row label="">
          {{currentItem.orgName}}
        </oms-row>
        <oms-row label="货品编号" :span="8">
          {{currentItem.orgGoodsDto.goodsDto.code}}
        </oms-row>
        <oms-row label="批准文号" :span="8">
          {{currentItem.orgGoodsDto.goodsDto.approvalNumber}}
        </oms-row>
        <oms-row label="批准文号有效期" :span="8">
          {{currentItem.orgGoodsDto.goodsDto.goodsApprovalNOValidity | date}}
        </oms-row>
        <oms-row label="是否OTC" :span="8">
          <span v-show="currentItem.orgGoodsId">{{currentItem.orgGoodsDto.goodsDto.goodsOtc | formatStatus}}</span>
        </oms-row>
        <oms-row label="有效期" :span="8">
          {{ currentItem.orgGoodsDto.goodsDto.expiryNumber }} {{ currentItem.orgGoodsDto.goodsDto.expiryUnit |
          formExpiryUnit}}
        </oms-row>
        <oms-row label="供货厂商" :span="8">
          {{currentItem.orgGoodsDto.salesFirmName}}
        </oms-row>
        <oms-row label="注册证号" :span="8" v-show="currentItem.orgGoodsDto.goodsDto.importation !== '1' ">
          {{currentItem.orgGoodsDto.goodsDto.registrationNumber}}
        </oms-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  export default {
    props: {
      currentItem: {}
    },
    filters: {
      formExpiryUnit: function (value) {
        let array = {
          0: '年',
          1: '月',
          2: '日'
        };
        return array[value];
      }
    }
  };
</script>
