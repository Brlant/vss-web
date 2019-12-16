<template>
  <span>
    <span v-show="accessoryList.length">【组合疫苗】</span>
    <span style="display: block;font-size: 12px" v-for="acce in accessoryList" :key="acce.id">
         <span style="margin-right: 10px">{{acce.name}}</span>
        <span style="margin-right: 10px"
              v-show="acce.procurementPrice">采购价格:¥ {{ acce.procurementPrice | formatMoney }}</span>
         <span style="margin-right: 10px"
               v-show="acce.sellPrice">销售价格:¥{{ acce.sellPrice | formatMoney }}</span>
         <span style="margin-right: 10px" v-show="acce.proportion">比例:{{ acce.proportion }}</span>
         <span style="margin-right: 10px">{{ acce.salesFirmName }}</span>
        <span style="margin-right: 10px" v-if="acce.accessoryGoods">
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
