<style lang="scss" scoped="">
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

.d-table > div.d-table-right {
  padding: 10px 20px;
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
                  <span v-if="cost.id===''" class="pull-right cursor-span" style="margin-left: 10px"
                        @click.prevent="add">
                    <a class="btn-circle" href="#" @click.prevent=""><i class="el-icon-t-plus"></i> </a>
                  </span>
                </perm>
                <perm label="cerp-logistics-cost-update">
                      <span v-if="cost.id!==''" class="pull-right cursor-span" style="margin-left: 10px"
                            @click.prevent="edit">
                    <a class="btn-circle" href="#" @click.prevent=""><i class="el-icon-t-edit"></i> </a>
                  </span>
                </perm>
              </div>
              <oms-row :span="10" label="免疫规划疫苗费用模式">{{ setModel}}</oms-row>
              <oms-row v-if="cost.model==='0'" :span="10" label="免疫规划疫苗物流费用"><span v-if="cost.price">￥</span>{{
                cost.price}}
              </oms-row>
              <oms-row v-if="cost.model==='1'" :span="10" label="免疫规划疫苗物流费用比例">{{ cost.price * 100 }}<span
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
                  <span v-if="secondCost.id===''" class="pull-right cursor-span" style="margin-left: 10px"
                        @click.prevent="addSecond">
                    <a class="btn-circle" href="#" @click.prevent=""><i class="el-icon-t-plus"></i> </a>
                  </span>
                </perm>
                <perm label="cerp-logistics-cost-update">
                  <span v-if="secondCost.id!==''" class="pull-right cursor-span" style="margin-left: 10px"
                        @click.prevent="editSecond">
                    <a class="btn-circle" href="#" @click.prevent=""><i class="el-icon-t-edit"></i> </a>
                  </span>
                </perm>
              </div>
              <oms-row :span="10" label="非免疫规划疫苗费用模式">{{ setSecondModel}}</oms-row>
              <oms-row v-if="secondCost.model==='0'" :span="10" label="非免疫规划疫苗物流费用"><span
                v-if="secondCost.price">￥</span>{{
                secondCost.price
                }}
              </oms-row>
              <oms-row v-if="secondCost.model==='1'" :span="10" label="非免疫规划疫苗物流费用比例">{{ secondCost.price * 100}}<span
                v-if="secondCost.price">%</span>
              </oms-row>
            </div>
          </div>
        </div>
      </div>
    </div>
    <page-right :css="{'width':'1000px','padding':0}" :show="showItemRight" @right-close="resetRightBox">
      <add-form :formItem="form" :formType="action" @close="resetRightBox"></add-form>
    </page-right>
    <page-right :css="{'width':'1000px','padding':0}" :show="showSecondItemRight" @right-close="resetRightBox">
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
  data() {
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
  mounted() {
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
    queryCosts() {
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
    resetRightBox() {
      this.showItemRight = false;
      this.showSecondItemRight = false;
      this.queryCosts();
    },
    add() {
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
