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
        <h2 class="clearfix right-title" style="font-size: 16px">{{ title }}</h2>
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
            <el-form-item label="物料名称" prop="name">
              <oms-input v-model="form.name" placeholder="请输入物料名称"></oms-input>
            </el-form-item>
            <el-form-item label="物料编码" prop="materialCode">
              <oms-input v-model="form.materialCode" placeholder="请输入物料编码"></oms-input>
            </el-form-item>
            <el-form-item label="选择物料描述" prop="parameters">
              <oms-input v-model="form.parameters" placeholder="请输入物料描述"></oms-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {material} from '@/resources';

export default {
  props: {
    formItem: Object
  },
  data() {
    let checkMaterialCode = (rule, value, callback) => {
      if (value === '') {
        callback();
      } else {
        let re = /^\d*$/;
        if (!re.test(value) || value.length > 35) {
          callback(new Error('请输入正确的物料编码(只能为数字并且最大不能超过35位)'));
        } else {
          callback();
        }
      }
    };
    return {
      form: {
        name: '',
        parameters: '',
        materialCode:''
      },
      rules: {
        name: {required: true, message: '请输入物料名称', trigger: 'blur'},
        parameters: {required: true, message: '请输入物料描述', trigger: 'blur'},
        materialCode: [
          {required: true, message: '请输入物料编码', trigger: 'blur'},
          {validator: checkMaterialCode, trigger: 'blur'}
        ]
      },
      doing: false,
      title: '添加物料'
    };
  },
  watch: {
    formItem:function (val) {
      if (val.id) {
        this.title = '编辑物料';
        this.form = Object.assign(this.form, val);
      } else {
        this.form = {
          name: '',
          parameters: '',
          materialCode: '',
        };
        this.title = '添加物料';
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs['d-form'].validate((valid) => {
        if (!valid || this.doing) {
          return false;
        }
        this.doing = true;
        if (this.form.id) {
          material.update(this.form.id, this.form).then(() => {
            this.$notify.success({
              message: '编辑物料成功'
            });
            this.$refs['d-form'].resetFields();
            this.$emit('refresh');
            this.doing = false;
          }).catch(error => {
            this.doing = false;
            this.$notify.error({
              message: error.response.data ||  '编辑物料失败'
            });
          });
        } else {
          material.save(this.form).then(() => {
            this.$notify.success({
              message: '添加物料成功'
            });
            this.doing = false;
            this.$refs['d-form'].resetFields();
            this.$emit('refresh');

          }).catch(error => {
            console.log(error)
            this.doing = false;
            this.$notify.error({
              message:error.response.data || '添加物料失败'
            });
          });
        }
      });
    }
  }
};
</script>
