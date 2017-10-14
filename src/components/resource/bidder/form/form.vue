<style lang="less" scoped="">
  .el-form .el-select {
    display: block;
  }
</style>
<template>
  <div>
    <h2 class="clearfix">{{title}}</h2>
    <el-form ref="bidderForm" :model="form" label-width="100px" :rules="rules"
             @submit.prevent="onSubmit()" onsubmit="return false">
      <el-form-item label="疫苗">
        <el-select filterable remote placeholder="请输入名称搜索疫苗" :remote-method="filterVaccine"
                   :clearable="true"
                   v-model="form.goodsId">
          <el-option :value="vaccine.id" :key="vaccine.id"
                     :label="vaccine.name" v-for="vaccine in vaccineList" popper-class="good-selects">
            <div style="overflow: hidden">
              <span class="pull-left">{{vaccine.name}}</span>
            </div>
            <div style="overflow: hidden">
                <span class="select-other-info pull-left"><span
                  v-show="vaccine.id">货品ID</span>  {{vaccine.id}}
                </span>
              <span class="select-other-info pull-left"><span
                v-show="vaccine.specifications">货品规格</span>  {{vaccine.specifications}}
                </span>
              <span class="select-other-info pull-left"><span
                v-show="vaccine.approvalNumber">批准文号</span>  {{vaccine.approvalNumber}}
                </span>
            </div>
            <div style="overflow: hidden">
              <span class="select-other-info pull-left"><span
                v-show="item.orgGoodsDto.salesFirmName">生产</span>  {{ item.orgGoodsDto.salesFirmName }}
              </span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="中标年份" prop="phone">
        <div class="block">
          <el-date-picker
            v-model="form.year"
            align="right"
            type="year"
            placeholder="选择年"
            @change="formatDate"
          >
          </el-date-picker>
        </div>

      </el-form-item>
      <el-form-item label="有效时间" prop="email">
        <el-date-picker v-model="form.expireTime" format="yyyy-MM-dd" placeholder="选择日期"
                        style="width: 100%;">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="是否生效" prop="phone">
        <el-switch on-text="是" off-text="否" on-color="#13ce66" off-color="#ff4949"
                   v-model="form.availabilityStatus"></el-switch>
      </el-form-item>
      <el-form-item label-width="100px">
        <el-button type="primary" @click="onSubmit('bidderForm')" native-type="submit">保存</el-button>
        <el-button @click="doClose">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {User, Access, OrgUser, http} from '../../../../resources';

  export default {
    name: 'editForm',
    props: {
      title: {
        type: String,
        default: '增加'
      },
      formItem: {
        type: Object
      },
      action: {
        type: String,
        default: ''
      },
      actionType: {
        type: Boolean,
        default: true
      }
    },
    data: function () {
      return {
        vaccineList: [],
        goodsId: '',
        rules: {
//          name: [
//            {required: true, message: '请输入用户名', trigger: 'blur'}
//          ],
//          phone: [
//            {required: true, message: '请输入手机号码', trigger: 'blur'},
//          ],
//          email: [
//            {required: true, message: '请输入邮箱', trigger: 'blur'},
//          ],
//          roleId: [
//            {required: true, message: '请输入用户角色', trigger: 'blur'}
//          ]
        },
        form: {
          goodsId: '',
          expireTime: '',
          year: '',
          availabilityStatus: true
        },
        doing: false
      };
    },
    computed: {
      user() {
        return this.$store.state.user;
      }
    },
    watch: {
      formItem: function () {
        this.form = this.formItem;// this.formItem;
      },
      showRight: function (val) {
        if (!val) {
          this.$refs['bidderForm'].resetFields();
        }
      }
    },
    methods: {
      filterVaccine: function (query) {
        let params = {
          keyWord: query
        };
        http.get('/vaccine-info/valid', {params}).then(res => {
          this.vaccineList = res.data.list;
        });
      },
      onSubmit: function (formName) {
        let self = this;
        this.$refs[formName].validate((valid) => {
          if (!valid || this.doing) {
            return false;
          }
          this.doing = true;
          http.post('/successful-bidder', self.form).then(() => {
            this.doing = false;
            this.$notify.success({
              duration: 2000,
              name: '成功',
              message: '新增疫苗中标记录成功'
            });
            self.$emit('change', self.form);
          }).catch(() => {
            this.$notify.error({
              duration: 2000,
              message: '新增疫苗中标记录失败'
            });
            this.doing = false;
          });
        });
      },
      formatDate(param) {
        this.form.year = this.$moment(param).format('YYYY');
      },
      doClose: function () {
        this.$emit('close');
        this.$refs['bidderForm'].resetFields();
      }
    }
  };
</script>
