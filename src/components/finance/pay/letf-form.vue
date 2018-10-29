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
        <h2 class="clearfix right-title" style="font-size: 16px">新增应付账单</h2>
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
            <el-form-item label="收款方" prop="povId">
              <el-select placeholder="请选择收款方" v-model="form.remitteeId" filterable remote clearable
                         @click.native="queryOrgs('')"
                         :remote-method="queryOrgs">
                <el-option :label="item.name" :value="item.id" :key="item.id"
                           v-for="item in orgs">
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
  import { BaseInfo, pay } from '@/resources';

  export default {
    data() {
      return {
        form: {
          remitteeId: ''
        },
        rules: {
          remitteeId: {required: true, message: '请选择收款方', trigger: 'change'}
        },
        doing: false,
        orgs: [] // 订单列表
      };
    },
    methods: {
      queryOrgs(query) {
        this.orgs = [];
        let params = {
          keyWord: query,
          relation: '1'
        };
        BaseInfo.queryOrgByValidReation(this.$store.state.user.userCompanyAddress, params).then(res => {
          this.orgs = res.data;
        });
      },
      onSubmit() {
        this.$refs['d-form'].validate((valid) => {
          if (!valid || this.doing) {
            return false;
          }
          this.doing = true;
          pay.save(this.form).then(() => {
            this.doing = false;
            this.$notify.success({
              message: '收款方添加成功'
            });
            this.$refs['d-form'].resetFields();
            this.$emit('refresh');
          }).catch(error => {
            this.doing = false;
            this.$notify.error({
              message: error.response.data && error.response.data.msg || '收款方添加失败'
            });
          });
        });
      }
    }
  };
</script>
