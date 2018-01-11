<style lang="less" scoped>
  @import "../../../assets/mixins.less";

  @leftWidth: 220px;

  .el-form .el-checkbox__label {
    font-size: 12px;
    padding-left: 5px;
  }

  .el-form .el-checkbox__inner {
    width: 14px;
    height: 14px;
  }

  .content-part {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    .content-left {
      width: @leftWidth;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      text-align: left;
      background-color: #eef2f3;
      > ul {
        margin: 0;
      }
      > h2 {
        padding: 0 45px;
        margin: 0;
        font-size: 18px;
        font-weight: bold;
        line-height: 55px;
        border-bottom: 1px solid #ddd;
        background-color: #eef2f3;
      }
      .list-style {
        cursor: pointer;
        padding: 10px;
        text-align: center;
        span {
          display: inline-block;
          padding: 8px 35px;
        }
        &.active {
          span {
            background-color: @activeColor;
            border-radius: 20px;
            color: @activeColorFont
          }
        }
        &:hover {
          background: #dee9eb
        }

      }

    }
    .content-right {
      > h3 {
        padding: 0;
        margin: 0 0 20px;
        font-size: 18px;
        font-weight: normal;
        line-height: 55px;
        border-bottom: 1px solid #ddd;
        text-align: center;
        position: fixed;
        top: 0;
        right: 0;
        left: @leftWidth;
        background: #fff;
        z-index: 2;
      }
      position: absolute;
      top: 0;
      left: @leftWidth;
      right: 0;
      bottom: 0;
      overflow: auto;
      padding-top: 75px;
      .hide-content {
        display: none;
      }
      .show-content {
        padding: 0 20px;
        display: block;
      }
    }

    .min-gutter {
      .el-form-item {
        margin-bottom: 20px;
      }
      .el-form-item__label {
        font-size: 12px
      }
    }
  }

  .el-form .el-select {
    display: block;
  }

  .table-product-list {
    font-size: 12px;
    > tbody > tr > td, > thead > tr > th {
      padding: 5px;
    }
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

  .ml15 {
    margin-left: 40px;
  }

  .combinatioon-product {
    color: #777
  }

  .el-select-dropdown__item {
    height: auto;
  }

  .productItem-info {
    float: left;
  }

  .order-good-selects {
    .el-select-dropdown__item {
      height: auto;
      width: auto;
    }
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
            <el-button type="success" @click="onSubmit" :disabled="doing">保存</el-button>
          </li>
        </ul>
      </div>
      <div class="content-right min-gutter">
        <div class="hide-content show-content">
          <el-form ref="d-form" :rules="rules" :model="form"
                   label-width="160px" style="padding-right: 20px">
            <el-form-item label="物料名称" prop="name">
              <oms-input v-model="form.name" placeholder="请输入物料名称"></oms-input>
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
  import { material } from '@/resources';

  export default {
    props: {
      formItem: Object
    },
    data () {
      return {
        form: {
          name: '',
          parameters: ''
        },
        rules: {
          name: {required: true, message: '请输入物料名称', trigger: 'blur'},
          parameters: {required: true, message: '请输入物料描述', trigger: 'blur'}
        },
        doing: false,
        title: '添加物料'
      };
    },
    watch: {
      formItem (val) {
        if (val.id) {
          Object.assign(this.form, val);
          this.title = '编辑物料';
        } else {
          this.form = {
            name: '',
            parameters: ''
          };
          this.title = '添加物料';
        }
      }
    },
    methods: {
      onSubmit () {
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
                message: error.response.data && error.response.data.msg || '编辑物料失败'
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
              this.doing = false;
              this.$notify.error({
                message: error.response.data && error.response.data.msg || '添加物料失败'
              });
            });
          }
        });
      }
    }
  };
</script>
