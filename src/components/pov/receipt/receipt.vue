<style lang="less" scoped>
  @import '../../../assets/mixins';
  @leftWidth: 280px;
  .content-part {
    .content-left {
      text-align: center;
      width: @leftWidth;
    }
    .content-right {
      > h3 {
        left: @leftWidth;
      }
      left: @leftWidth;
    }
  }

  .btn-submit-save {
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    z-index: 1;
    text-align: center;
    padding: 15px;
  }

  .product-list {
    padding: 10px;
    .product-item {
      margin-bottom: 15px;
      border: 1px solid #ccc;
      border-radius: 5px;
      background: #eef2f3;
      padding: 15px 0;
      cursor: pointer;
      position: relative;
      &.active {
        background: white;
      }
    }
  }

  .oms-row {
    color: #777;
    text-align: left;
  }
</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title">添加收货信息</h2>
        <div class="product-list">
          <div v-for="(product,key) in productList" :class="{'active': activeKey === key }"
               @click="changeProduct(product, key)" class="product-item">
            <oms-row label="货品名称" :span="span">{{product.goodsName}}111</oms-row>
            <oms-row label="批号" :span="span">{{product.batchNumber}}</oms-row>
            <oms-row label="规格" :span="span">{{product.specification}}</oms-row>
            <oms-row label="生产厂商" :span="span">{{product.productFactory}}</oms-row>
            <oms-row label="销售厂商" :span="span">{{product.saleFactory}}</oms-row>
            <oms-row label="大包装" :span="span" v-if="product.largeBoxCount">{{product.largeBoxCount}}</oms-row>
            <oms-row label="中包装" :span="span" v-if="product.mediumBoxCount">{{product.mediumBoxCount}}</oms-row>
            <oms-row label="小包装" :span="span" v-if="product.smallBoxCount">{{product.smallBoxCount}}</oms-row>
            <oms-row label="散件" :span="span" v-if="product.bulkBoxCount">{{product.bulkBoxCount}}</oms-row>
            <oms-row label="合计数量" :span="span">{{product.totalCount}}</oms-row>
          </div>
        </div>
        <div class="btn-submit-save">
          <el-button type="primary" @click="onSubmit">保存</el-button>
        </div>
      </div>
      <div class="content-right content-padding">
        <h3></h3>
        <div v-for="(item, key) in productList" v-show="key === activeKey">
          <el-form :ref=" 'form' + key" :model="item" :rules="rules" label-width="160px"
                   style="padding-right: 20px">
            <el-form-item label="大包装数量" prop="largePackageCount" v-if="currentItem.largeBoxCount">
              <oms-input type="text" placeholder="请输入大包装数量" v-model.number="item.largePackageCount"></oms-input>
            </el-form-item>
            <el-form-item label="中包装数量" prop="mediumPackageCount" v-if="currentItem.mediumBoxCount">
              <oms-input type="text" placeholder="请输入中包装数量" v-model.number="item.mediumPackageCount"></oms-input>
            </el-form-item>
            <el-form-item label="小包装数量" prop="smallPackageCount" v-if="currentItem.smallBoxCount">
              <oms-input type="text" placeholder="请输入小包装数量" v-model.number="item.smallPackageCount"></oms-input>
            </el-form-item>
            <el-form-item label="散件数量" prop="bulkCount" v-if="currentItem.bulkBoxCount">
              <oms-input type="text" placeholder="请输入散件数量" v-model.number="item.bulkCount"></oms-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { povReceipt } from '@/resources';
  export default {
    props: {
      waveId: String
    },
    data () {
      return {
        span: 8,
        currentOrder: {},
        index: 0,
        pageSets: [
          {name: '收货信息', key: 0}
        ],
        productList: [],
        currentItem: {},
        activeKey: 0,
        types: [],
        doing: false,
        rules: {
          largePackageCount: [
            {required: true, type: 'number', message: '请输入大包装数量', trigger: 'blur'}
          ],
          mediumPackageCount: [
            {required: true, type: 'number', message: '请输入中包装数量', trigger: 'blur'}
          ],
          smallPackageCount: [
            {required: true, type: 'number', message: '请输入小包装数量', trigger: 'blur'}
          ],
          bulkCount: [
            {required: true, type: 'number', message: '请输入散件数量', trigger: 'blur'}
          ]
        }
      };
    },
    watch: {
      waveId () {
        this.queryOrderDetail();
      }
    },
    methods: {
      onSubmit () {
        let forms = this.productList.map((item, index) => {
          return {
            name: `form${index}`,
            value: item
          };
        });
        console.log(this.$refs);
        for (let i = 0; i < forms.length; i++) {
          let v = true;
          this.$refs[forms[i].name][0].validate((valid) => {
            v = valid;
          });
          if (!v) {
            this.currentItem = forms[i].value;
            return;
          }
        }
        let obj = {
          list: []
        };
        this.productList.forEach(f => {
          obj.list.push({
            batchNumber: f.batchNumber,
            orgGoodsId: f.orgGoodsId,
            largePackageCount: f.largePackageCount,
            bulkCount: f.bulkCount,
            mediumPackageCount: f.mediumPackageCount,
            smallPackageCount: f.smallPackageCount
          });
        });
        if (this.doing) return;
        this.doing = true;
        povReceipt.save(this.waveId, obj).then(() => {
          this.$notify.success({
            message: '添加收货信息成功'
          });
          this.doing = false;
          this.$emit('close');
          this.$emit('refreshOrder');
        }).catch(error => {
          this.doing = false;
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '添加收货信息失败'
          });
        });
      },
      queryOrderDetail () {
        if (!this.waveId) return false;
        povReceipt.queryWaskGoods(this.waveId).then(res => {
          res.data.forEach(f => {
            f.largePackageCount = '';
            f.bulkCount = '';
            f.mediumPackageCount = '';
            f.smallPackageCount = '';
          });
          this.productList = res.data.slice();
          if (this.productList.length) {
            this.currentItem = this.productList[0];
          }
        });
      },
      changeProduct (item, key) {
        this.currentItem = item;
        this.activeKey = key;
      }
    }
  };
</script>

