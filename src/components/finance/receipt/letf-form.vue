<style lang="scss" scoped>
@import "../../../assets/mixins.scss";

$leftWidth: 220px;

.el-form .el-checkbox__label {
  font-size: 12px;
  padding-left: 5px;
}

.el-form .el-checkbox__inner {
  width: 14px;
  height: 14px;
}

.content-part {
  .content-left {
    text-align: center;
    width: $leftWidth;
  }

  .content-right {
    > h3 {
      left: $leftWidth;
    }

    left: $leftWidth;
  }
}

.el-form .el-select {
  display: block;
}

.order-product-box {
  position: relative;
  border-radius: 10px;
  font-size: 12px;
  line-height: 26px;

  .product-info-fix {
    background: #f6f6f6;
    margin-top: 10px;
    padding: 5px;
    margin-bottom: 20px;
  }

  &:hover {
    border-color: #aaa
  }

  .product-remove {
    position: absolute;
    right: 0;
    top: 0;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    cursor: pointer;
    color: #666;

    &:hover {
      color: #333
    }
  }

  .order-goods-info {
    .col-label {
      padding-top: 4px;
    }
  }

}

.ml15 {
  margin-left: 40px;
}

.combinatioon-product {
  color: #777
}

.productItem-info {
  float: left;
}

.ar {
  text-align: right;
}
</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title" style="font-size: 16px">新增应收账单</h2>
        <ul>
          <li class="text-center" style="margin-top:40px;position:absolute;bottom:30px;left:0;right:0;">
            <el-button :disabled="doing" type="success" @click="onSubmit">保存</el-button>
          </li>
        </ul>
      </div>
      <div class="content-right min-gutter">
        <div class="hide-content show-content">
          <el-form ref="d-form" :model="form" :rules="rules"
                   label-width="160px" style="padding-right: 20px">
            <el-form-item label="选择收货单位" prop="povId">
              <el-select v-model="form.payerId" :remote-method="queryPOVs" clearable filterable placeholder="请选择收货单位"
                         remote
                         @click.native="queryPOVs('')">
                <el-option v-for="item in povs" :key="item.id" :label="item.subordinateName"
                           :value="item.subordinateId">
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
import {receipt} from '@/resources';

export default {
  data() {
    return {
      form: {
        payerId: ''
      },
      rules: {
        payerId: {required: true, message: '请选择收货单位', trigger: 'change'}
      },
      povs: [], // 订单列表
      doing: false
    };
  },
  methods: {
    queryPOVs(query) {
      // this.povs = [];
      // let params = {
      //   keyWord: query
      // };
      // cerpAction.queryAllPov(params).then(res => {
      //   this.povs = res.data.list;
      // });
    },
    onSubmit() {
      this.$refs['d-form'].validate((valid) => {
        if (!valid) {
          return false;
        }
        this.doing = true;
        receipt.save(this.form).then(() => {
          this.$notify.success({
            message: '付款方添加成功'
          });
          this.doing = false;
          this.$refs['d-form'].resetFields();
          this.$emit('refresh');
        }).catch(error => {
          this.$notify.error({
            message: error.response && error.response.data && error.response.data.msg || '付款方添加失败'
          });
          this.doing = false;
        });
      });
    }
  }
};
</script>
