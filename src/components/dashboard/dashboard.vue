<style lang="scss" scoped="">

.home-btn-banner {

  .home-btn-wrap {
    width: 100%;
    padding: 25px 0;
    font-size: 2.5em;

    i {
      font-size: 1em;
      margin-right: 10px;

    }
  }
}
</style>

<template>
  <div class="container">
    <!--公告-->
    <notice/>
    <!--异常的采购订单信息-->
    <purchase-order-exception/>

    <!--收货单位要货需求-->
    <dev-demand/>

    <!--疫苗效期提醒-->
    <stock-overdue-tip/>
    <licence/>
  </div>


</template>
<script>
import PurchaseOrderException from './purchase-order-exception';
import DevDemand from './dev-demand';
import StockOverdueTip from './stock-overdue-tip';
import licence from './licence';
import notice from './notice/notice';

export default {
  components: {PurchaseOrderException, DevDemand, StockOverdueTip, licence, notice}
};

</script>

