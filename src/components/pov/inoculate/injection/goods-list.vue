<template>
  <div class="product-list-detail">
    <table class="table">
      <thead>
      <tr>
        <th style="width: 240px">疫苗</th>
        <th style="width: 100px">批号</th>
        <th style="width: 100px">有效期</th>
        <th style="width: 100px">接种部位</th>
        <th style="width: 100px">接种途经</th>
        <th style="width: 60px">操作</th>
      </tr>
      </thead>
      <tbody>
      <tr :key="product.goodsId" v-for="product in goodsList">
        <td>
          <span>{{product.orgGoodsName}}</span>
          <div class="font-gray">
            规格：{{product.specifications}}
          </div>
        </td>
        <td>{{ product.batchNumber }}</td>
        <td>
          {{ product.expiryDate | date }}
        </td>
        <td>
          <dict :dict-group="'inoculationPosition'" :dict-key="product.inoculationPosition"></dict>
        </td>
        <td>
          <dict :dict-group="'inoculationChannel'" :dict-key="product.inoculationChannel"></dict>
        </td>
        <td>
          <div>
            <a @click.prevent="deleteItem(product)" href="#"><i class="el-icon-t-delete"></i> 删除</a>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
  export default {
    props: {
      goodsList: {
        type: Array,
        default: () => []
      }
    },
    methods: {
      deleteItem(item) {
        this.$emit('deleteItem', item);
      }
    }
  };
</script>
