<template>
  <span>
    <span v-show="accessoryList.length">【组合疫苗】</span>
    <span v-for="acce in accessoryList" :key="acce.id" style="display: block;font-size: 12px">
         <span style="margin-right: 10px">{{acce.name}}</span>
        <span v-show="acce.procurementPrice"
              style="margin-right: 10px">采购价格:¥ {{ acce.procurementPrice | formatMoney }}</span>
         <span v-show="acce.sellPrice"
               style="margin-right: 10px">销售价格:¥{{ acce.sellPrice | formatMoney }}</span>
         <span v-show="acce.proportion" style="margin-right: 10px">比例:{{ acce.proportion }}</span>
         <span style="margin-right: 10px">{{ acce.salesFirmName }}</span>
        <span v-if="acce.accessoryGoods" style="margin-right: 10px">
           散件：
          <span v-show="acce.accessoryGoods.smallPacking">
            {{acce.accessoryGoods.smallPacking}}
            <dict :dict-group="'measurementUnit'" :dict-key="acce.accessoryGoods.measurementUnit"></dict>
              /
            <dict :dict-group="'shipmentPackingUnit'"
                  :dict-key="acce.accessoryGoods.smallPackageUnit"></dict>
            </span>
        </span>
    </span>
  </span>
</template>
<script>
export default {
  name: 'acceGoodsPart',
  props: {
    accessoryList: {
      type: Array,
      default: () => []
    }
  }
};
</script>
