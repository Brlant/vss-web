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
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 100px;
    overflow: auto;
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
            <oms-row label="货品名称" :span="span">{{product.name}}111</oms-row>
            <oms-row label="批号" :span="span">{{product.batchNumber}}</oms-row>
            <oms-row label="规格" :span="span">{{product.orgGoodsDto.goodsDto.specifications}}</oms-row>
            <oms-row label="生产厂商" :span="span">{{product.orgGoodsDto.goodsDto.factoryName}}</oms-row>
            <oms-row label="数量" :span="span">{{product.amount}}</oms-row>
          </div>
        </div>
        <div class="btn-submit-save">
          <el-button type="primary" @click="onSubmit" :disabled="doing">保存</el-button>
        </div>
      </div>
      <div class="content-right content-padding">
        <h3></h3>
        <div v-for="(item, key) in productList" v-show="key === activeKey">
          <el-form :ref=" 'form' + key" :model="item" :rules="rules" label-width="160px"
                   style="padding-right: 20px">
            <el-form-item label="整件数量">
              <oms-input type="text" placeholder="请输入整件数量" v-model.number="item.largePackageCount"></oms-input>
            </el-form-item>
            <el-form-item label="散件数量">
              <oms-input type="text" placeholder="请输入散件数量" v-model.number="item.bulkCount"></oms-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { povReceipt, InWork } from '@/resources';

  export default {
    props: {
      orderId: String
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
      orderId () {
        this.queryOrderDetail();
      }
    },
    methods: {
      onSubmit () {
//        let forms = this.productList.map((item, index) => {
//          return {
//            name: `form${index}`,
//            value: item
//          };
//        });
//        for (let i = 0; i < forms.length; i++) {
//          let v = true;
//          this.$refs[forms[i].name][0].validate((valid) => {
//            v = valid;
//          });
//          if (!v) {
//            this.currentItem = forms[i].value;
//            return;
//          }
//        }
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
        povReceipt.save(this.orderId, obj).then(() => {
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
        if (!this.orderId) return false;
        InWork.queryOrderDetail(this.orderId).then(res => {
          res.data.detailDtoList.forEach(f => {
            f.largePackageCount = '';
            f.bulkCount = '';
            f.mediumPackageCount = '';
            f.smallPackageCount = '';
          });
          this.productList = [].concat(res.data.detailDtoList);
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

