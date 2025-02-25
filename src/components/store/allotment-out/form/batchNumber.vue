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
          <span v-if="product.unitPrice" class="pull-right">单价: ¥{{product.unitPrice}}</span>
        </h3>
        <table class="table">
          <thead>
          <tr>
            <th>
              <el-checkbox v-model="item.isCheckedAll" @change="checkItemAll(item)"></el-checkbox>
            </th>
            <th>产品数量</th>
            <th>批号</th>
            <th>可用库存</th>
            <th>生产日期</th>
            <th>有效期</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for=" batchNumber in item.lots">
            <td>
              <el-checkbox v-model="batchNumber.isChecked" :disabled="batchNumber.disabled"></el-checkbox>
            </td>
            <td>
              <el-input v-model.number="batchNumber.productCount" :disabled="batchNumber.disabled" :min="0" style="width:160px"
                        type="number" @blur="isChangeValue(batchNumber, item)">
                <template slot="append">
                  <dict :dict-group="'measurementUnit'"
                        :dict-key="product.fixInfo.goodsDto.measurementUnit"></dict>
                </template>
              </el-input>
            </td>
            <td>
              {{ batchNumber.no }}
              <goods-status-tag :form="form" :item="batchNumber"/>
            </td>
            <td>{{ batchNumber.count }}</td>
            <td>{{ batchNumber.productionDate | date }}</td>
            <td>{{ batchNumber.expirationDate | date }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-show="isHasBatchNumberInfo && !doing && product.orgGoodsId">
      <h2 class="no-batch-number-info">无库存批次信息</h2>
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
    editItemProduct: {},
    formCopy: {},
    orderType: String
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
          goodsId: m.goodsId,
          orgId: this.form.orgId,
          orgGoodsId: m.orgGoodsId
        };
        return this.$http.get('/stock-batch/valid/batch', {params});
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
          orgId: this.form.orgId,
          orgGoodsId: m.orgGoodsId
        };
        return this.$http.get(this.form.qualifiedFlag ? '/erp-stock/valid/batch' : '/erp-stock/unqualified/batch', {params});
      })).then(
        axios.spread((...args) => {
          this.batchNumbers.forEach((i, index) => {
            args[index].data.forEach(f => {
              f.isChecked = false;
              f.productCount = '';
              // f.disabled = this.isValid(f);
            });
            i.lots = args[index].data || [];
          });
          this.editBatchNumbers();
          this.doing = false;
        })
      );
    },
    isValid(item) {
      let a = this.$moment(this.form.createTime || Date.now());
      let b = this.$moment(item.expirationDate);
      return a > b;
    },
    /**
     * 编辑疫苗时，重设对应批号信息
     */
    editBatchNumbers() {
      if (!this.editItemProduct.batchNumberId) return;
      this.batchNumbers.forEach(i => {
        if (i.orgGoodsId === this.editItemProduct.orgGoodsId) {
          if (!i.lots.length) {
            this.addBatchNumber(i);
          } else {
            // 把对应的数量，重新加回去
            let isHas = i.lots.some(s => s.id === this.editItemProduct.batchNumberId);
            if (isHas) {
              i.lots.forEach(i => {
                if (i.id === this.editItemProduct.batchNumberId) {
                  i.productCount = this.editItemProduct.amount;
                  // 编辑时，如果是已经保存的疫苗，取其相应的数量+还剩下的可用库存
                  this.formCopy.detailDtoList.forEach(p => {
                    if (p.batchNumberId === this.editItemProduct.batchNumberId) {
                      i.count = i.count + p.amount;
                    }
                  });
                  i.isChecked = true;
                }
              });
            } else {
              this.addBatchNumber(i);
            }
          }
        }
      });
    },
    addBatchNumber(i) {
      i.lots.push({
        id: this.editItemProduct.batchNumberId,
        no: this.editItemProduct.no,
        inEffectiveFlag: this.editItemProduct.inEffectiveFlag,
        productCount: this.editItemProduct.amount,
        productionDate: this.editItemProduct.productionDate,
        expirationDate: this.editItemProduct.expiryDate,
        isChecked: true
      });
      // 编辑时，如果是已经保存的疫苗，取其相应的数量当可用库存
      this.formCopy.detailDtoList.forEach(p => {
        if (p.batchNumberId === this.editItemProduct.batchNumberId) {
          i.lots.forEach(il => {
            if (il.id === this.editItemProduct.batchNumberId) {
              il.count = p.amount;
            }
          });
        }
      });
    },
    /**
     * 全选
     * @param item
     */
    checkItemAll(item) {
      item.lots.forEach(l => {
        l.isChecked = item.isCheckedAll && !l.disabled;
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
            if (item.productCount > item.count) {
              this.$notify.warning({
                duration: 2000,
                message: '输入的产品数量大于可用库存'
              });
            }
            item.isChecked = item.productCount > 0;
            this.autoSelectBatchWhenIsCombination(item, product);
            this.$emit('addProduct');
          }).catch(() => {
            if (item.productCount > item.count) {
              this.$notify.warning({
                duration: 2000,
                message: '输入的产品数量大于可用库存'
              });
            }
            item.isChecked = item.productCount > 0;
            this.autoSelectBatchWhenIsCombination(item, product);
            this.$emit('addProduct');
          });
        } else {
          if (item.productCount > item.count) {
            this.$notify.warning({
              duration: 2000,
              message: '输入的产品数量大于可用库存'
            });
          }
          item.isChecked = item.productCount > 0;
          this.autoSelectBatchWhenIsCombination(item, product);
          this.$emit('addProduct');
        }
      } else {
        if (item.productCount > item.count) {
          this.$notify.warning({
            duration: 2000,
            message: '输入的产品数量大于可用库存'
          });
        }
        item.isChecked = item.productCount > 0;
        this.autoSelectBatchWhenIsCombination(item, product);
        this.$emit('addProduct');
      }
    },
    /**
     * 自动选出组合疫苗的批号
     * @param item
     * @param product
     */
    autoSelectBatchWhenIsCombination(item, product) {
      let ary = this.productList.filter(f => f.orgGoodsDto.id === this.product.orgGoodsId);
      if (!ary.length) return;
      if (!ary[0].list) return;
      if (!product.isMainly) return;
      let totalCount = 0;
      // 主疫苗总数量
      this.batchNumbers.forEach(b => {
        if (b.orgGoodsId === this.product.orgGoodsId) {
          b.lots.forEach(bl => {
            if (bl.isChecked) {
              totalCount += Number(bl.productCount);
            }
          });
        }
      });
      // 置空勾选项和数量
      this.batchNumbers.filter(f => f.orgGoodsId !== this.product.orgGoodsId).forEach(i => {
        i.lots.forEach(lot => {
          if (lot.isChecked) {
            lot.isChecked = !lot.isChecked;
          }
          if (lot.productCount) {
            lot.productCount = null;
          }
        });
      });
      this.batchNumbers.filter(f => f.orgGoodsId !== this.product.orgGoodsId).forEach(i => {
        // 组合疫苗总数量
        let comTotalCount = 0;
        ary[0].list.forEach(p => {
          if (p.accessory === i.orgGoodsId) {
            comTotalCount = Math.ceil(totalCount * p.proportion);
          }
        });
        // 查出近效期的批号
        let effectiveList = i.lots.filter(fl => fl.inEffectiveFlag);
        if (!effectiveList.length) {
          this.selectBatch(i.lots, 0, 0, comTotalCount);
        } else {
          let c = this.selectBatch(effectiveList, 0, 0, comTotalCount);
          if (c < comTotalCount) {
            let noEffectiveList = i.lots.filter(fl => !fl.inEffectiveFlag);
            this.selectBatch(noEffectiveList, 0, 0, comTotalCount - c);
          }
        }
      });
    },
    /**
     * 递归设置批号信息
     * @param list
     * @param index
     * @param count
     * @param totalCount
     * @returns {*}
     */
    selectBatch(list, index, count, totalCount) {
      if (!list.length) return count;
      if (index > list.length - 1) return count;
      if (!(count < totalCount)) return count;
      let cur = totalCount - count;
      let batchCount = list[index].count;
      if (cur < batchCount) {
        list[index].productCount = cur;
        count += cur;
      } else {
        list[index].productCount = batchCount;
        count += batchCount;
      }
      list[index].isChecked = true;
      index++;
      return this.selectBatch(list, index, count, totalCount);
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
          message: '无库存批次，无法加入订单'
        });
        return false;
      }
      let isChecked = this.batchNumbers.every(item => item.lots.some(l => l.isChecked));
      if (!isChecked) {
        this.$notify.info({
          duration: 2000,
          message: '请选择疫苗批号'
        });
        return false;
      }
      if (this.form.sameBatchNumber) {
        let seleteNumber = 0;
        this.batchNumbers.forEach(i => {
          i.lots.forEach(l => {
            if (l.isChecked) {
              seleteNumber++;
            }
          });
        });
        if (seleteNumber > 1) {
          this.$notify.info({
            duration: 2000,
            message: '请选择单个批号'
          });
          return false;
        }
      }
      let isHaveCount = this.batchNumbers.some(item => item.lots.some(l => l.isChecked && !l.productCount));
      if (isHaveCount) {
        this.$notify.info({
          duration: 2000,
          message: '请填写产品数量'
        });
        return false;
      }
      let isOver = this.batchNumbers.some(item => item.lots.some(l => l.isChecked && (l.productCount > l.count)));
      if (isOver) {
        this.$notify.warning({
          duration: 2000,
          message: '输入的产品数量大于可用库存'
        });
        return false;
      }
      if (!this.editItemProduct.orgGoodsId) {
        let isPassed = true;
        this.productList.forEach((item) => {
          if (this.product.orgGoodsId === item.orgGoodsDto.id) {
            let list = item.list;
            list.forEach(i => {
              let count = 0;
              this.batchNumbers.forEach(b => {
                if (b.orgGoodsId === i.accessory) {
                  b.lots.forEach(bl => {
                    if (bl.isChecked) {
                      count += Number(bl.productCount);
                    }
                  });
                }
              });
              i.accessoryTotalCount = count;
            });
            let totalCount = 0;
            this.batchNumbers.forEach(b => {
              if (b.orgGoodsId === this.product.orgGoodsId) {
                b.lots.forEach(bl => {
                  if (bl.isChecked) {
                    totalCount += Number(bl.productCount);
                  }
                });
              }
            });
            list.forEach(i => {
              let amount = Math.ceil(i.proportion * totalCount);
              if (i.accessoryTotalCount !== amount) {
                isPassed = false;
              }
            });
          }
        });
        if (!isPassed) {
          this.$notify.warning({
            duration: 2000,
            message: '组合疫苗数量比例不匹配'
          });
          return false;
        }
      }
      return true;
    }
  }
};
</script>
