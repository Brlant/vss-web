<style lang="scss" scoped="">
  .el-form .el-select {
    display: block;
  }
</style>
<template>
  <div>
    <h2 class="clearfix">{{title}}中标疫苗</h2>
    <el-form ref="bidderForm" :model="form" label-width="100px" :rules="rules"
             @submit.prevent="onSubmit()" onsubmit="return false">
      <el-form-item label="疫苗" prop="goodsId">
        <el-select filterable remote placeholder="请输入名称搜索疫苗" :remote-method="filterVaccine"
                   :clearable="true"
                   v-model="form.goodsId" popper-class="good-selects">
          <el-option :value="vaccine.id" :key="vaccine.id"
                     :label="vaccine.name" v-for="vaccine in vaccineList">
            <div style="overflow: hidden">
              <span class="pull-left">{{vaccine.name}}</span>
                <!--<el-tag type="success" v-if="vaccine.vaccineSign==='1'">一类疫苗</el-tag>-->
                <!--<el-tag type="success" v-if="vaccine.vaccineSign==='2'">二类疫苗</el-tag>-->
            </div>
            <div style="overflow: hidden">
                <span class="select-other-info pull-left"><span
                  v-show="vaccine.code">货品编号:</span>{{vaccine.code}}
                </span>
              <span class="select-other-info pull-left"><span
                v-show="vaccine.specifications">货品规格:</span>{{vaccine.specifications}}
                </span>
              <span class="select-other-info pull-left"><span
                v-show="vaccine.approvalNumber">批准文号:</span>{{vaccine.approvalNumber}}
                </span>
            </div>
            <div style="overflow: hidden">
              <span class="select-other-info pull-left"><span
                v-show="vaccine.factoryName">生产厂商:</span>{{ vaccine.factoryName }}
              </span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="中标年份" prop="year">
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
      <el-form-item label="有效时间" prop="expireTime">
        <el-date-picker v-model="form.expireTime" format="yyyy-MM-dd" placeholder="选择日期"
                        style="width: 100%;" @change="formatExpireTimeDate">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="是否生效">
        <el-switch active-text="是" inactive-text="否" active-color="#13ce66" inactive-color="#ff4949"
                   v-model="form.availabilityStatus"></el-switch>
      </el-form-item>
      <el-form-item label-width="100px">
        <el-button type="primary" @click="onSubmit('bidderForm')" native-type="submit" :disabled="doing">保存</el-button>
        <el-button @click="doClose">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { http } from '../../../../resources';

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
          goodsId: [
            {required: true, message: '请输入疫苗', trigger: 'blur'}
          ],
          year: [
            {required: true, message: '请选择中标年份', trigger: 'change'}
          ],
          expireTime: [
            {required: true, message: '请选择有效时间', trigger: 'change'}
          ]
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
        if (this.formItem.id) {
          this.filterVaccine(this.formItem.goodsName);
          this.form = this.formItem;// this.formItem;
          this.formatExpireTimeDate(this.form.expireTime);
        } else {
          this.form = {
            goodsId: '',
            expireTime: '',
            year: '',
            availabilityStatus: true
          };
          this.$refs['bidderForm'].resetFields();
        }
      },
      showRight: function (val) {
        if (!val) {
          this.$refs['bidderForm'].resetFields();
        }
      }
    },
    methods: {
      filterVaccine: function (query) {
        let params = Object.assign({}, {
          deleteFlag: false,
          keyWord: query
        });
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
          if (this.action === 'add') {
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
          }
          if (this.action === 'edit') {
            http.put('/successful-bidder', self.form).then(() => {
              this.doing = false;
              this.$notify.success({
                duration: 2000,
                name: '成功',
                message: '编辑疫苗中标记录成功'
              });
              self.$emit('change', self.form);
            }).catch(() => {
              this.$notify.error({
                duration: 2000,
                message: '编辑疫苗中标记录失败'
              });
              this.doing = false;
            });
          }
        });
      },
      formatDate(param) {
        this.form.year = param ? this.$moment(param).format('YYYY') : '';
      },
      formatExpireTimeDate(param) {
        this.form.expireTime = param ? this.$moment(param).format('YYYY-MM-DD') : '';
      },
      doClose: function () {
        this.$emit('close');
        this.$refs['bidderForm'].resetFields();
      }
    }
  };
</script>
