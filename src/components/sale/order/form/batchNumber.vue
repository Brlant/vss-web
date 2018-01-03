<style lang="less">
  .product-list-detail {
    margin-top: 20px;
    font-size: 12px;
    h3 {
      background: #eee;
      padding: 10px 15px;
      font-size: 14px;
      font-weight: normal;
    }
  }
</style>
<template>
  <div v-show="!isHasBatchNumberInfo">
    <div class="product-list-detail" v-for="item in batchNumbers">
      <h3>批号信息({{item.orgGoodsName}}
        <el-tag v-show="!item.isMainly">组合</el-tag>
        )
      </h3>
      <table class="table">
        <thead>
        <tr>
          <th>
            <el-checkbox @change="checkItemAll(item)" v-model="item.isCheckedAll"></el-checkbox>
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
            <el-checkbox v-model="batchNumber.isChecked"></el-checkbox>
          </td>
          <td>
            <el-input style="width:160px" type="number" v-model.number="batchNumber.productCount" :min="0"
                      @blur="isChangeValue(batchNumber)">
              <template slot="append">
                <dict :dict-group="'measurementUnit'"
                      :dict-key="product.fixInfo.goodsDto.measurementUnit"></dict>
              </template>
            </el-input>
          </td>
          <td>
            {{ batchNumber.no }}
            <el-tag v-show="batchNumber.inEffectiveFlag" type="danger">近效期</el-tag>
          </td>
          <td>{{ batchNumber.count }}</td>
          <td>{{ batchNumber.productionDate | date }}</td>
          <td>{{ batchNumber.expirationDate | date }}</td>
        </tr>
        </tbody>
      </table>
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
        default () {
          return [];
        }
      },
      editItemProduct: {},
      isHasBatchNumberInfo: false,
      setIsHasBatchNumberInfo: Function
    },
    data () {
      return {
        batchNumbers: []
      };
    },
    watch: {
      'product.orgGoodsId' () {
        this.initBatchNumber();
        this.queryBatchNumber();
      },
      batchNumbers: {
        handler () {
          this.setIsHasBatchNumberInfo();
        },
        deep: true
      }
    },
    methods: {
      initBatchNumber () {
        this.batchNumbers = [];
        if (!this.product.orgGoodsId || !this.productList.length) {
          return;
        }
        let ary = this.productList.filter(f => f.orgGoodsDto.id === this.product.orgGoodsId);
        if (!ary.length) return [];
        // 主货品
        this.batchNumbers.push({
          orgGoodsId: ary[0].orgGoodsDto.id,
          orgGoodsName: ary[0].orgGoodsDto.name,
          goodsId: ary[0].orgGoodsDto.goodsId,
          isMainly: true,
          lots: []
        });
        // 组合货品
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
       * 组合货品，得到多个API接口
       * @returns {any[]}
       */
      getAPIAry () {
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
       * 如果有组合货品，并发查询批号信息
       */
      queryBatchNumber () {
        if (!this.batchNumbers.length) return;
        axios.all(this.batchNumbers.map(m => {
          let params = {
            goodsId: m.goodsId,
            orgId: this.form.orgId,
            orgGoodsId: m.orgGoodsId
          };
          return this.$http.get('/stock-batch/valid/batch', {params});
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
          })
        );
      },
      /**
       * 编辑货品时，重设对应批号信息
       */
      editBatchNumbers () {
        if (!this.editItemProduct.batchNumberId) return;
        this.batchNumbers.forEach(i => {
          if (i.orgGoodsId === this.editItemProduct.orgGoodsId) {
            if (!i.lots.length) {
              i.lots.push({
                id: this.editItemProduct.batchNumberId,
                no: this.editItemProduct.no,
                inEffectiveFlag: this.editItemProduct.inEffectiveFlag,
                productCount: this.editItemProduct.amount,
                count: this.editItemProduct.amount,
                productionDate: this.editItemProduct.productionDate,
                expirationDate: this.editItemProduct.expiryDate,
                isChecked: true
              });
            } else {
              // 把对应的数量，重新加回去
              i.lots.forEach(i => {
                if (i.id === this.editItemProduct.batchNumberId) {
                  i.productCount = this.editItemProduct.amount;
                  i.count = i.count + this.editItemProduct.amount;
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
      checkItemAll (item) {
        item.lots.forEach(l => {
          l.isChecked = item.isCheckedAll;
        });
      },
      /**
       * 输入数量校验
       * @param item
       */
      isChangeValue (item) {
        item.productCount = utils.changeTotalNumber(item.productCount, this.product.fixInfo.goodsDto.smallPacking);
        if (item.productCount > item.count) {
          this.$notify.warning({
            duration: 2000,
            message: '输入的产品数量大于仓库数量'
          });
        }
        item.isChecked = item.productCount > 0;
      },
      checkInputValid () {
        if (!this.batchNumbers.length && this.form.bizType === '0') {
          this.$notify.info({
            duration: 2000,
            message: '无库存批次，无法加入订单'
          });
          return false;
        }
        if (this.batchNumbers.length && this.form.bizType === '0') {
          let isHave = this.batchNumbers.some(item => item.lots.some(s => s.count > 0));
          if (!isHave) {
            this.$notify.info({
              duration: 2000,
              message: '无库存，无法加入订单'
            });
            return false;
          }
        }
        if (this.batchNumbers.length) {
          let isChecked = this.batchNumbers.every(item => item.lots.some(l => l.isChecked));
          if (!isChecked) {
            this.$notify.info({
              duration: 2000,
              message: '请选择货品批号'
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
              message: '输入的产品数量大于仓库数量'
            });
            return false;
          }
          return true;
        } else {
          return true;
        }
      }
    }
  };
</script>
