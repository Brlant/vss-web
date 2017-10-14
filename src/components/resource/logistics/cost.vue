<style lang="less" scoped="">
  .advanced-query-form {
    .el-select {
      display: block;
      position: relative;
    }
    .el-date-editor.el-input {
      width: 100%;
    }
    padding-top: 20px;
  }

  .R {
    word-wrap: break-word;
    word-break: break-all;
  }

  .pt {
    padding-top: 15px;
  }

  .opera-btn-group {

    border: 2px solid #eeeeee;
    margin: 10px -5px;
    .opera-icon {
      line-height: 50px;
      height: 50px;
      padding: 0 10px;
      border-bottom: 2px solid #eeeeee;
    }
    .switching-icon {
      cursor: pointer;
      .el-icon-arrow-up {
        transition: all .5s ease-in-out;
      }
    }
    &.up {
      .advanced-query-form {
        display: none;
      }
      .opera-icon {
        border-bottom: 0;
      }
      .el-icon-arrow-up {
        transform: rotate(180deg);
      }
    }
  }

  .search-input {
    .el-select {
      display: block;
      position: relative;
    }
    .el-date-editor.el-input {
      width: 100%;
    }
  }

  .costs {
    font-size: 16px;
    .oms-row {
      margin-bottom: 10px;
    }
  }

  .border-show {
    height: 20px;
    border-bottom: 1px solid #777777;
    opacity: 0.2;
    margin-left: 40px;
    margin-right: 40px;
    margin-bottom: 20px;
  }
</style>
<template>
  <div class="order-page">
    <div class="container">

      <div class="d-table">

        <div class="d-table-right">
          <div class=" costs clearfix " style="margin-top: 10px">
            <el-row v-if="loadingData">
              <el-col :span="24">
                <oms-loading :loading="loadingData"></oms-loading>
              </el-col>
            </el-row>
            <div v-else="">
              <div style="overflow: hidden">
                <perm label="cerp-logistics-cost-add">
                  <span class="pull-right cursor-span" style="margin-left: 10px" @click.prevent="add"
                        v-if="cost.id===''">
                    <a href="#" class="btn-circle" @click.prevent=""><i class="iconfont icon-plus"></i> </a>
                  </span>
                </perm>
                <perm label="cerp-logistics-cost-update">
                      <span class="pull-right cursor-span" style="margin-left: 10px" @click.prevent="edit"
                            v-if="cost.id!==''">
                    <a href="#" class="btn-circle" @click.prevent=""><i class="iconfont icon-edit"></i> </a>
                  </span>
                </perm>
              </div>
              <oms-row label="一类疫苗费用模式" :span="8">{{ setModel}}</oms-row>
              <oms-row label="一类疫苗物流费用" :span="8" v-if="cost.model==='0'"><span v-if="cost.price">￥</span>{{ cost.price}}
              </oms-row>
              <oms-row label="一类疫苗物流费用比例" :span="8" v-if="cost.model==='1'">{{ cost.price * 100 }}<span
                v-if="cost.price">%</span>
              </oms-row>
            </div>
          </div>
        </div>
        <div class="d-table-right">
          <div class=" costs clearfix " style="margin-top: 10px">
            <el-row v-if="loadingData">
              <el-col :span="24">
                <oms-loading :loading="loadingData"></oms-loading>
              </el-col>
            </el-row>
            <div v-else="">
              <div style="overflow: hidden">
                <perm label="cerp-logistics-cost-add">
                  <span class="pull-right cursor-span" style="margin-left: 10px" @click.prevent="addSecond"
                        v-if="secondCost.id===''">
                    <a href="#" class="btn-circle" @click.prevent=""><i class="iconfont icon-plus"></i> </a>
                  </span>
                </perm>
                <perm label="cerp-logistics-cost-update">
                  <span class="pull-right cursor-span" style="margin-left: 10px" @click.prevent="editSecond"
                        v-if="secondCost.id!==''">
                    <a href="#" class="btn-circle" @click.prevent=""><i class="iconfont icon-edit"></i> </a>
                  </span>
                </perm>
              </div>
              <oms-row label="二类疫苗费用模式" :span="10">{{ setSecondModel}}</oms-row>
              <oms-row label="二类疫苗物流费用" :span="10" v-if="secondCost.model==='0'"><span v-if="secondCost.price">￥</span>{{ secondCost.price
                }}
              </oms-row>
              <oms-row label="二类疫苗物流费用比例" :span="10" v-if="secondCost.model==='1'">{{ secondCost.price * 100}}<span
                v-if="secondCost.price">%</span>
              </oms-row>
            </div>
          </div>
        </div>
      </div>
    </div>
    <page-right :show="showItemRight" @right-close="resetRightBox" :css="{'width':'1000px','padding':0}">
      <add-form :formItem="form" :formType="action" @close="resetRightBox"></add-form>
    </page-right>
    <page-right :show="showSecondItemRight" @right-close="resetRightBox" :css="{'width':'1000px','padding':0}">
      <second-form :formItem="secondform" :formType="action" @close="resetRightBox"></second-form>
    </page-right>
  </div>
</template>
<script>
  import addForm from './form.vue';
  import secondForm from './secondForm.vue';
  import {http} from '../../../resources';
  import utils from '../../../tools/utils';
  export default {
    components: {
      addForm,
      secondForm
    },
    data () {
      return {
        loadingData: true,
        cost: {},
        secondCost: {},
        showItemRight: false,
        showSecondItemRight: false,
        form: {},
        secondform: {},
        action: '',
        model: '',
        secondModel: ''
      };
    },
    mounted () {
      this.queryCosts();
    },
    computed: {
      setModel: function () {
        let title = '';
        if (this.cost.model) {
          title = '单支';
          if (this.cost.model === '1') {
            title = '比例';
          }
        }
        return title;
      },
      setSecondModel: function () {
        let title = '';
        if (this.secondCost.model) {
          title = '单支';
          if (this.secondCost.model === '1') {
            title = '比例';
          }
        }
        return title;
      }
    },
    methods: {
      queryCosts () {
        this.cost = {};
        this.loadingData = true;
        http.get('/logistics-cost/municipal').then(res => {
          if (res.data.length !== 0) {
            res.data.forEach(val => {
              if (val.vaccineType === '1') {
                this.cost = val;
              }
              if (val.vaccineType === '2') {
                this.secondCost = val;
              }
            });
          }
          if (JSON.stringify(this.cost) === '{}') {
            this.cost = {id: ''};
          }
          if (JSON.stringify(this.secondCost) === '{}') {
            this.secondCost = {id: ''};
          }
          this.loadingData = false;
        });
      },
      edit: function () {
        this.action = 'edit';
        this.form = JSON.parse(JSON.stringify(this.cost));
        this.form.price = utils.autoformatDecimalPoint(this.form.price.toString());
        this.showItemRight = true;
      },
      editSecond: function () {
        this.action = 'edit';
        this.secondform = JSON.parse(JSON.stringify(this.secondCost));
        this.secondform.price = utils.autoformatDecimalPoint(this.secondform.price.toString());
        this.showSecondItemRight = true;
      },
      resetRightBox () {
        this.showItemRight = false;
        this.showSecondItemRight = false;
        this.queryCosts();
      },
      add () {
        this.action = 'add';
        this.showItemRight = true;
      },
      addSecond() {
        this.action = 'add';
        this.showSecondItemRight = true;
      }
    }
  };
</script>
