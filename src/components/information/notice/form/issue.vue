<style lang="scss" scoped>
  @import "../../../../assets/mixins.scss";

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
            <el-button type="success" @click="onSubmit" :disabled="doing" :loading="doing">{{ doing ? '正在授权' : '保存' }}
            </el-button>
          </li>
        </ul>
      </div>
      <div class="content-right min-gutter">
        <div class="hide-content show-content">
          <el-form ref="d-form" :rules="rules" :model="form"
                   label-width="100px" style="padding-right: 20px">

            <el-form-item label="单位" >
              <el-transfer v-loading="loading"
                           v-model="form.povList"
                           :props="{
                  key: 'subordinateId',
                  label: 'subordinateName'
                }"
                           filter-placeholder="请输入名称搜索单位"
                           :data="orgList"
                           filterable
                           :filter-method="filterMethod"
                           :titles="['未选单位', '已选单位']"
                           class="transfer-list"
                           :render-content="renderFunc"
              >
              </el-transfer>
            </el-form-item>
            <el-form-item label="单位" prop="povId" v-if="form.id">
              <span>{{ formItem.povName }}</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/jsx">
  import { http, VaccineRights } from '@/resources';
  export default {
    props: {
      formItem: Object,
      currentItem: Object
    },
    data () {
      return {
        form: {
          povList: [],
          noticeId:''
        },
        rules: {
          povList: {required: true, type: 'array', message: '请选择单位', trigger: 'change'},
        },
        title: '新增公告授权',
        orgList: [],
        unitPrice: '',
        doing: false,
        loading: false
      };
    },
    mounted() {
      this.getOrg();
    },
    watch: {
      formItem (val) {
          let form = JSON.parse(JSON.stringify(val));
          this.form = Object.assign(form, {povList: []});
          this.title = '疫苗授权';

        }
      },
    methods: {
      renderFunc(h, option) {
        return (
          <span title={option.subordinateName}>{ option.subordinateName }</span>
        );
      },

      getOrg: function (query) {// 过滤POV
        let params = Object.assign({}, {
          keyWord: query
        });
        this.loading = true;
        this.$http.get('/erp-org/relationList', params).then(res => {
          this.orgList = res.data;
          this.loading = false;
        });
      },
      filterMethod (query, item) {
        if (!query) return true;
        return item.subordinateName && item.subordinateName.indexOf(query) > -1 ||
          item.subordinateNameAcronymy && item.subordinateNameAcronymy.indexOf(query) > -1 ||
          item.subordinateNamePhonetic && item.subordinateNamePhonetic.indexOf(query) > -1 ||
          item.subordinateCode && item.subordinateCode.indexOf(query) > -1;
      },
      onSubmit () {
        this.$refs['d-form'].validate((valid) => {
          if (!valid) {
            return false;
          }
          console.log(this.form);
          // if (this.form.noticeId) {
          //   let obj = {
          //     'noticeId': this.form.noticeId,
          //   };
          //   this.doing = true;
          //   http.put('/vaccine-authorization', obj).then(() => {
          //     this.$notify.success({
          //       message: '修改公告授权成功'
          //     });
          //     this.form = {
          //       noticeId: '',
          //       povList: [],
          //     };
          //     this.doing = false;
          //     this.$emit('refresh');
          //   }).catch(error => {
          //     this.doing = false;
          //     this.$notify.error({
          //       message: error.response.data && error.response.data.msg || '修改公告授权失败'
          //     });
          //   });
          // } else {
            if (!this.form.povList.length) {
              this.$notify.info({
                duration: 2000,
                message: '请先选择单位'
              });
              return false;
            }
            console.log(this.form);
            let id = this.form.noticeId;
            let obj = this.form.povList;
            this.doing = true;
           this.$http.put('/notice/issue/'+id,obj).then(() => {

              this.$notify.success({
                message: '添加公告授权成功'
              });
              this.$refs['d-form'].resetFields();
              this.$emit('refresh');
              this.doing = false;
            }).catch(error => {
              this.doing = false;
              this.$notify.error({
                message: error.response.data && error.response.data.msg || '添加公告授权失败'
              });
            });

        });
      }
    }
  };
</script>
