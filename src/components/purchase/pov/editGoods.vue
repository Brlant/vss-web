<style lang="scss" scoped>

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
        <h3>修改要货品种</h3>
        <div class="order-page">
          <div class="container">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px"
                     onsubmit="return false"
                     style="padding-right: 20px" @submit.prevent="save">
              <el-form-item label="货主疫苗" prop="orgGoodsId">
                <el-select v-model="form.orgGoodsId" :clearable="true" filterable
                           placeholder="请输入名称搜索货主疫苗" popper-class="good-selects">

                  <el-option v-for="item in goodsList" :key="item.id"
                             :label="item.name" :value="item.id">
                    <div>
                      <div>
                        <span class="pull-left">{{item.name}}</span>
                      </div>
                      <div class="clearfix">
                         <span class="select-other-info pull-left"><span
                           v-show="item.specification">规格:</span>{{item.specification}}</span>
                        <span class="select-other-info pull-left"><span
                          v-show="item.goodsNo">货主货品编号:</span>{{item.goodsNo}}</span>
                        <span class="select-other-info pull-left"><span
                          v-show="item.salesFirmName">供货单位:</span>{{ item.salesFirmName }}</span>
                      </div>
                      <div class="clearfix">
                         <span class="select-other-info pull-left">
                          <span>业务可用库存:</span>{{item. availableCount}}</span>
                      </div>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button :disabled="doing" type="primary" @click="save">保存</el-button>
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
    show: {
      handler(val) {
        this.form.orgGoodsId = '';
        this.$refs.form && this.$refs.form.clearValidate();
        this.goodsList = [];
        if (val) {
          this.queryGoodsList();
        }
      },
      immediate: true
    }
  },
  methods: {
    queryGoodsList() {
      if (!this.currentItem.orgGoodsId) return;
      this.$http.get(`vaccine-info/${this.currentItem.orgGoodsId}/goods-type`).then(res => {
        this.goodsList = res.data;
        console.log(this.goodsList);
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
          this.$notify.success('修改成功');
          this.$emit('refresh');
        }).catch(error => {
          this.doing = false;
          this.$notify.error({
            message: error.response && error.response.data && error.response.data.msg || '修改失败'
          });
        });
      });
    }
  }
};
</script>
