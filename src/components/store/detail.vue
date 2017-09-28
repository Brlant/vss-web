<style lang="less" scoped="">
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
</style>
<template>
  <div>
    <div class="content-part">
      <div class="content-right content-padding">
        <h3>库存批次货位详情</h3>
        <table class="table clearfix">
          <thead>
          <tr class="tr-bg">
            <td width="150px">物流中心</td>
            <td width="100px">仓库</td>
            <td width="100px">库区</td>
            <td width="100px">库位</td>
            <td width="150px">包装类型</td>
            <td width="100px">包装数</td>
            <td width="100px">库存数量</td>
          </tr>
          </thead>
          <tbody>
          <tr v-if="loadingData">
            <td colspan="7" style="border: 0">
              <oms-loading :loading="loadingData"></oms-loading>
            </td>
          </tr>
          <tr v-else-if="storeDetails.length == 0">
            <td colspan="7" style="border: 0">
              <div class="empty-info">
                暂无信息
              </div>
            </td>
          </tr>
          <tr v-else="" v-for="i in storeDetails" :key="i.id">
            <td>{{ i.centerName }}</td>
            <td>{{ i.warehouseName }}</td>
            <td>{{ i.areaName }}</td>
            <td>{{ i.storeName }}</td>
            <td>
              {{ formatSize(i.packageSize)}} ({{ i.packageUnitCount }}
              <dict :dict-group="'measurementUnit'" :dict-key="i.saleUnit"></dict>
              /
              <dict :dict-group="'shipmentPackingUnit'" :dict-key="i.goodsUnit"></dict>
              )
            </td>
            <td>{{ i.packageAmount }}
              <dict :dict-group="'shipmentPackingUnit'" :dict-key="i.goodsUnit"></dict>
            </td>
            <td>{{ i.count }}
              <dict :dict-group="'measurementUnit'" :dict-key="i.saleUnit"></dict>
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
    props: ['id'],
    data () {
      return {
        loadingData: true,
        storeDetails: []
      };
    },
    watch: {
      id () {
        this.queryStoreDetails();
      }
    },
    methods: {
      queryStoreDetails () {
        this.loadingData = true;
        http.get(`/stock-batch/${this.id}`).then(res => {
          this.storeDetails = res.data.locationDtoList;
          this.loadingData = false;
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
