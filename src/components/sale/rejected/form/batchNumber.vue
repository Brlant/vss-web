<style lang="scss">

.no-batch-number-info {
  padding: 5px;
}

.goods-title {
  overflow: hidden;
}
</style>
<template>
  <div v-loading="doing">
    <div v-show="!isHasBatchNumberInfo">
      <div v-for="item in batchNumbers" class="product-list-detail">
        <h3 class="goods-title">
          <span class="pull-left">批号信息({{item.orgGoodsName}}<el-tag v-show="!item.isMainly">组合</el-tag>)</span>
          <span class="pull-right">销售价格: ¥{{product.unitPrice}}</span>
        </h3>
        <table class="table">
          <thead>
          <tr>
            <th>
              <el-checkbox v-model="item.isCheckedAll" @change="checkItemAll(item)"></el-checkbox>
            </th>
            <th>产品数量</th>
            <th>批号</th>
            <th>生产日期</th>
            <th>有效期</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for=" bm in item.lots">
            <td>
              <el-checkbox v-model="bm.isChecked"></el-checkbox>
            </td>
            <td>
              <el-input v-model.number="bm.productCount" :min="0" style="width:160px" type="number"
                        @blur="isChangeValue(bm, item)">
                <template slot="append">
                  <dict :dict-group="'measurementUnit'"
                        :dict-key="product.fixInfo.goodsDto.measurementUnit"></dict>
                </template>
              </el-input>
            </td>
            <td>
              {{ bm.batchNumber }}
              <goods-status-tag :form="form" :item="bm"/>
              <!--<el-tag v-show="bm.inEffectiveFlag" type="warning">近效期</el-tag>-->
            </td>
            <td>{{ bm.productionDate | date }}</td>
            <td>{{ bm.expirationDate | date }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-show="isHasBatchNumberInfo && !doing && product.orgGoodsId">
      <h2 class="no-batch-number-info">无批号信息</h2>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import utils from '@/tools/utils';

export default {
  props: {
    form: {},
    product: {},
    productList: {
      type: Array,
      default() {
        return [];
      }
    },
    editItemProduct: {}
  },
  data() {
    return {
      batchNumbers: [],
      isHasBatchNumberInfo: false,
      changeTotalNumber: utils.changeTotalNumber,
      isCheckPackage: utils.isCheckPackage,
      doing: false
    };
  },
  watch: {
    'product.orgGoodsId'() {
      this.initBatchNumber();
      this.queryBatchNumber();
    },
    batchNumbers: {
      handler() {
        this.setIsHasBatchNumberInfo();
      },
      deep: true
    }
  },
  methods: {
    initBatchNumber() {
      this.batchNumbers = [];
      if (!this.product.orgGoodsId || !this.productList.length) {
        return;
      }
      let ary = this.productList.filter(f => f.orgGoodsDto.id === this.product.orgGoodsId);
      if (!ary.length) return [];
      // 主疫苗
      this.batchNumbers.push({
        orgGoodsId: ary[0].orgGoodsDto.id,
        orgGoodsName: ary[0].orgGoodsDto.name,
        goodsId: ary[0].orgGoodsDto.goodsId,
        isMainly: true,
        lots: []
      });
      // 组合疫苗
      ary[0].list.forEach(i => {
        this.batchNumbers.push({
          orgGoodsId: i.accessory,
          orgGoodsName: i.name,
          goodsId: i.accessoryGoods.id,
          isMainly: false,
          lots: []
        });
      });
    },
    /**
     * 组合疫苗，得到多个API接口
     * @returns {any[]}
     */
    getAPIAry() {
      return this.batchNumbers.map(m => {
        let params = {
          goodsId: m.goodsId
        };
        return this.$http.get('/batch-number', {params});
      });
    },
    /**
     * 如果有组合疫苗，并发查询批号信息
     */
    queryBatchNumber() {
      if (!this.batchNumbers.length) return;
      this.doing = true;
      axios.all(this.batchNumbers.map(m => {
        let params = {
          goodsId: m.goodsId,
          orgGoodsId:m.orgGoodsId
        };
        return this.$http.get('/erp-stock/getBatchNumberByCondition', {params});
      })).then(
        axios.spread((...args) => {
          this.batchNumbers.forEach((i, index) => {
            args[index].data.forEach(f => {
              f.isChecked = false;
              f.productCount = '';
            });
            i.lots = args[index].data || [];
          });
          this.editBatchNumbers();
          this.doing = false;
        })
      );
    },
    /**
     * 编辑疫苗时，重设对应批号信息
     */
    editBatchNumbers() {
      if (!this.editItemProduct.batchNumberId) return;
      this.batchNumbers.forEach(i => {
        if (i.orgGoodsId === this.editItemProduct.orgGoodsId) {
          if (i.lots.length) {
            i.lots.forEach(i => {
              if (i.id === this.editItemProduct.batchNumberId) {
                i.productCount = this.editItemProduct.amount;
                i.isChecked = true;
              }
            });
          }
        }
      });
    },
    /**
     * 全选
     * @param item
     */
    checkItemAll(item) {
      item.lots.forEach(l => {
        l.isChecked = item.isCheckedAll;
      });
    },
    /**
     * 输入数量校验
     * @param item
     */
    isChangeValue(item, product) {
      if (!item.productCount) return;
      if (product.isMainly) {
        let newAmount = this.changeTotalNumber(item.productCount, this.product.fixInfo.goodsDto.smallPacking);
        if (item.productCount !== newAmount) {
          this.$confirm(`疫苗"${this.product.fixInfo.name}"数量${item.productCount}不是最小包装的倍数，确认后会对后续操作产生严重影响!
             选择“是”修改数量为${newAmount}，选择“否”确认数量${item.productCount}`, '', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(res => {
            item.productCount = newAmount;
            item.isChecked = item.productCount > 0;
            this.$emit('addProduct');
          }).catch(() => {
            item.isChecked = item.productCount > 0;
            this.$emit('addProduct');
          });
        } else {
          item.isChecked = item.productCount > 0;
          this.$emit('addProduct');
        }
      } else {
        item.isChecked = item.productCount > 0;
        this.$emit('addProduct');
      }
    },
    setIsHasBatchNumberInfo() {
      let batchNumbers = this.batchNumbers || [];
      this.isHasBatchNumberInfo = !batchNumbers.length || batchNumbers.length && batchNumbers.every(s => !s.lots.length);
      this.$emit('setIsHasBatchNumberInfo', this.isHasBatchNumberInfo);
    },
    checkPass() {
      if (this.isHasBatchNumberInfo) {
        this.$notify.info({
          duration: 2000,
          message: '无批号信息，无法加入订单'
        });
        return false;
      }
      let isChecked = this.batchNumbers.some(item => item.lots.some(l => l.isChecked));
      if (!isChecked) {
        this.$notify.info({
          duration: 2000,
          message: '请选择疫苗批号'
        });
        return false;
      }
      let isHaveCount = this.batchNumbers.some(item => item.lots.some(l => l.isChecked && !l.productCount));
      if (isHaveCount) {
        this.$notify.info({
          duration: 2000,
          message: '请填写产品数量'
        });
        return false;
      }
      // if (!this.editItemProduct.orgGoodsId) {
      //   let isPassed = true;
      //   this.productList.forEach((item) => {
      //     if (this.product.orgGoodsId === item.orgGoodsDto.id) {
      //       let list = item.list;
      //       list.forEach(i => {
      //         let count = 0;
      //         this.batchNumbers.forEach(b => {
      //           if (b.orgGoodsId === i.accessory) {
      //             b.lots.forEach(bl => {
      //               if (bl.isChecked) {
      //                 count += Number(bl.productCount);
      //               }
      //             });
      //           }
      //         });
      //         i.accessoryTotalCount = count;
      //       });
      //       let totalCount = 0;
      //       this.batchNumbers.forEach(b => {
      //         if (b.orgGoodsId === this.product.orgGoodsId) {
      //           b.lots.forEach(bl => {
      //             if (bl.isChecked) {
      //               totalCount += Number(bl.productCount);
      //             }
      //           });
      //         }
      //       });
      //       list.forEach(i => {
      //         let amount = Math.ceil(i.proportion * totalCount);
      //         if (i.accessoryTotalCount !== amount) {
      //           isPassed = false;
      //         }
      //       });
      //     }
      //   });
      //   if (!isPassed) {
      //     this.$notify.warning({
      //       duration: 2000,
      //       message: '组合疫苗数量比例不匹配'
      //     });
      //     return false;
      //   }
      // }
      return true;
    }
  }
};
</script>
