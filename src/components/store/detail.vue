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
        <h3>货品所在仓库详情</h3>
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
          <tr v-else="" v-for="i in storeDetails" :key="i.id">
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
    props: ['id'],
    data () {
      return {
        loadingData: true,
        storeDetails: [],
        packSizeTyps: [
          '大包装',
          '中包装',
          '小包装',
          '散件'
        ]
      };
    },
    watch: {
      id () {
        this.queryStoreDetails();
      }
    },
    methods: {
      queryStoreDetails () {
        this.storeDetails = [];
        if (!this.id) return;
        this.loadingData = true;
        http.get(`/erp-stock/${this.id}/detail`).then(res => {
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
