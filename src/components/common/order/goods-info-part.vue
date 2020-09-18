<template>
  <div v-if="productInfo.fixInfo">
    <el-row>
      <el-col :span="12">
        <oms-row :span="8" label="散件">
          <span v-show="productInfo.fixInfo.goodsDto.smallPacking">
                      {{productInfo.fixInfo.goodsDto.smallPacking}}
          <dict :dict-group="'measurementUnit'" :dict-key="productInfo.fixInfo.goodsDto.measurementUnit"></dict>
            /
          <dict :dict-group="'shipmentPackingUnit'"
                :dict-key="productInfo.fixInfo.goodsDto.smallPackageUnit"></dict>
          </span>
        </oms-row>
        <oms-row :span="8" label="整件">
          <span v-show="productInfo.fixInfo.goodsDto.largePacking">
          {{productInfo.fixInfo.goodsDto.largePacking}}
          <dict :dict-group="'measurementUnit'" :dict-key="productInfo.fixInfo.goodsDto.measurementUnit"></dict>
          /
          <dict :dict-group="'shipmentPackingUnit'"
                :dict-key="productInfo.fixInfo.goodsDto.largePackageUnit"></dict>
          </span>

        </oms-row>
        <oms-row :span="8" label="生产单位">
          {{productInfo.fixInfo.goodsDto.factoryName}}
        </oms-row>
      </el-col>
      <el-col :span="12">
        <oms-row :span="8" label="规格">
          {{productInfo.fixInfo.goodsDto.specifications}}
        </oms-row>
        <oms-row :span="8" label="货主货品编号">
          {{productInfo.fixInfo.goodsNo}}
        </oms-row>
        <oms-row :span="8" label="批准文号">
          {{productInfo.fixInfo.goodsDto.approvalNumber}}
        </oms-row>
      </el-col>
    </el-row>

    <!--<oms-row label="供货单位" :span="4">-->
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
