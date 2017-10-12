<style lang="less" scoped>
  @leftWidth: 280px;
  .content-part {
    .content-left {
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
      background: #fff;
      text-align: center;
      padding: 15px 0;
      cursor: pointer;
      position: relative;
      .product-status {
        position: absolute;
        right: 3px;
        bottom: 3px;
        color: #0c0;
      }
      .no-bg {
        color: #999;
      }
      &.active {
        background: #00cc66;
        color: #fff;
        .no-bg {
          color: #aaa;
        }
      }
    }
  }
</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title">添加收货信息</h2>
        <div class="product-list">
          <div v-for="product in productList" :class="{'active': currentItem.id === product.id }"
               @click="changeProduct(product)" class="product-item">
            <div>{{product.name}}</div>
            <div class="no-bg">批号 {{product.batchNumber}}</div>
          </div>
        </div>
        <div class="btn-submit-save">
          <el-button type="primary" @click="onSubmit">保存</el-button>
        </div>
      </div>
      <div class="content-right content-padding">
        <h3></h3>
        <div v-for="item in productList" v-show="currentItem.id === item.id">
          <el-form :ref=" 'form' + item.id" :model="item" label-width="160px" style="padding-right: 20px">
            <el-form-item label="整件数量">
              <oms-input type="text" placeholder="请输入整件数量" v-model.number="item.packageCount"></oms-input>
            </el-form-item>
            <el-form-item label="散件数量">
              <oms-input type="text" placeholder="请输入散件数量" v-model.number="item.basicPackingCount"></oms-input>
            </el-form-item>
            <el-form-item label="包装规格">
              <el-select placeholder="请选择包装规格" v-model="item.scheme" filterable>
                <el-option :label="item.name" :value="item.id" :key="item.name" v-for="item in types">
                  <span class="pull-left">{{ item.name }}</span>
                  <span class="pull-right">{{ item.count }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { InWork, povReceipt } from '@/resources';
  export default {
    props: {
      orderId: String
    },
    data () {
      return {
        currentOrder: {},
        index: 0,
        pageSets: [
          {name: '收货信息', key: 0}
        ],
        productList: [],
        currentItem: {},
        types: [],
        doing: false
      };
    },
    watch: {
      orderId () {
        this.queryOrderDetail();
      }
    },
    methods: {
      onSubmit () {
        let obj = {
          orderId: this.orderId,
          list: []
        };
        this.productList.forEach(f => {
          obj.list.push({
            orderDetailId: f.id,
            packageCount: f.packageCount,
            basicPackingCount: f.basicPackingCount,
            scheme: f.scheme
          });
        });
        if (this.doing) return;
        this.doing = true;
        povReceipt.save(obj).then(() => {
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
            f.packageCount = '';
            f.basicPackingCount = '';
            f.scheme = '';
          });
          this.productList = res.data.detailDtoList.slice();
          if (this.productList.length) {
            this.currentItem = this.productList[0];
            this.changeTypes(this.currentItem);
          }
        });
      },
      changeProduct (item) {
        this.currentItem = item;
        this.changeTypes(item);
      },
      changeTypes (item) {
        let ary = [];
        ary.push({name: '大包装', id: '0', count: item.orgGoodsDto.goodsDto.largePacking});
        ary.push({name: '中包装', id: '1', count: item.orgGoodsDto.goodsDto.mediumPacking});
        ary.push({name: '小包装', id: '2', count: item.orgGoodsDto.goodsDto.smallPacking});
        this.types = [].concat(ary);
      }
    }
  };
</script>

