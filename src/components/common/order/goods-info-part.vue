<template>
  <div v-if="productInfo.fixInfo">
    <el-row>
      <el-col :span="12">
        <oms-row label="小包装" :span="8">
          <span v-show="productInfo.fixInfo.goodsDto.smallPacking">
                      {{productInfo.fixInfo.goodsDto.smallPacking}}
          <dict :dict-group="'measurementUnit'" :dict-key="productInfo.fixInfo.goodsDto.measurementUnit"></dict>/
          <dict :dict-group="'shipmentPackingUnit'"
                :dict-key="productInfo.fixInfo.goodsDto.smallPackageUnit"></dict>
          </span>
        </oms-row>
        <oms-row label="大包装" :span="8">
          <span v-show="productInfo.fixInfo.goodsDto.largePacking">
          {{productInfo.fixInfo.goodsDto.largePacking}}
          <dict :dict-group="'measurementUnit'" :dict-key="productInfo.fixInfo.goodsDto.measurementUnit"></dict>
          /
          <dict :dict-group="'shipmentPackingUnit'"
                :dict-key="productInfo.fixInfo.goodsDto.largePackageUnit"></dict>
          </span>

        </oms-row>
      </el-col>
      <el-col :span="12">
        <oms-row label="规格" :span="8">
          {{productInfo.fixInfo.goodsDto.specifications}}
        </oms-row>
        <oms-row label="货品编号" :span="8">
          {{productInfo.fixInfo.goodsNo}}
        </oms-row>
        <oms-row label="批准文号" :span="8">
          {{productInfo.fixInfo.goodsDto.approvalNumber}}
        </oms-row>
      </el-col>
    </el-row>
    <oms-row label="生产厂商" :span="4">
      {{productInfo.fixInfo.goodsDto.factoryName}}
    </oms-row>
    <!--<oms-row label="供货厂商" :span="4">-->
    <!--{{productInfo.fixInfo.salesFirmName}}-->
    <!--</oms-row>-->
  </div>
</template>
<script>
  export default {
    name: 'GoodsInfoPart',
    props: {
      productInfo: {}
    }
  };
</script>
