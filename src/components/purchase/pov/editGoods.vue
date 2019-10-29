<style lang="scss" scoped="">

  .align-word {
    letter-spacing: 1em;
    margin-right: -1em;
  }

  .color-blue {
    color: #00ff00;
  }

  .color-red {
    color: red;
  }

  .content-part {
    .content-right {
      > h3 {
        left: 0;
      }

      left: 0;
    }
  }

  .order-page {
    padding: 0 20px;
  }

  .colorRed {
    color: red;
  }

  .el-select {
    display: block;
  }
</style>
<template>

  <div>
    <div class="content-part">
      <div class="content-right content-padding">
        <h3>编辑货主疫苗</h3>
        <div class="order-page">
          <div class="container">
            <el-form ref="form" :rules="rules" :model="form" @submit.prevent="save"
                     onsubmit="return false"
                     label-width="120px" style="padding-right: 20px">
              <el-form-item label="货主疫苗" prop="orgGoodsId">
                <el-select v-model="form.orgGoodsId" filterable placeholder="请输入名称搜索货主疫苗"
                           :clearable="true" popper-class="good-selects">

                  <el-option v-for="item in goodsList" :key="item.id"
                             :label="item.name"
                             :value="item.id">
                    <div>
                      <div>
                        <span class="pull-left">{{item.name}}</span>
                      </div>
                      <div class="clearfix">
                      <span class="select-other-info pull-left"><span
                        v-show="item.goodsNo">疫苗编号:</span>{{item.goodsNo}}</span>
                        <span class="select-other-info pull-left"><span
                          v-show="item.sellPrice">销售价格:￥{{ item.sellPrice
                        }}</span>
                        </span>
                        <span class="select-other-info pull-left"><span
                          v-show="item.salesFirmName">供货厂商:</span>{{ item.salesFirmName }}</span>
                      </div>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="save" :disabled="doing">保存</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>

  export default {
    props: {
      currentItem: Object,
      show: Boolean
    },
    data() {
      return {
        form: {
          orgGoodsId: ''
        },
        rules: {
          orgGoodsId: [
            {required: true, message: '请选择货主疫苗'}
          ]
        },
        goodsList: [],
        doing: false
      };
    },
    watch: {
      show(val) {
        this.form.orgGoodsId = '';
        this.$refs.form && this.$refs.form.clearValidate();
        this.goodsList = [];
        if (val) {
          this.queryGoodsList();
        }
      }
    },
    methods: {
      queryGoodsList() {
        if (!this.currentItem.orgGoodsId) return;
        this.$http.get(`vaccine-info/${this.currentItem.orgGoodsId}/goods-type`).then(res => {
          this.goodsList = res.data;
          this.form.orgGoodsId = this.currentItem.orgGoodsId;
        });
      },
      save(item) {
        this.$refs.form.validate(v => {
          if (!v || this.doing) {
            return;
          }
          this.doing = true;
          let data = {
            detailIdList: this.currentItem.list.map(m => m.detailId),
            orgGoodsId: this.form.orgGoodsId
          };
          this.$http.put('/demand-assignment/goods', data).then(() => {
            this.doing = false;
            this.$notify.success('编辑成功');
            this.$emit('refresh');
          }).catch(error => {
            this.doing = false;
            this.$notify.error({
              message: error.response.data && error.response.data.msg || '修改失败'
            });
          });
        });
      }
    }
  };
</script>
