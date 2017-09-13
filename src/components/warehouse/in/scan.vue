<style lang="less" scoped>
  @leftWidth: 260px;
  .content-part {
    .content-left {
      width: @leftWidth;
    }
    .content-right {
      > h3 {
        left: @leftWidth;
      }
      left: @leftWidth;
    }
  }

  .ui-right {
    height: 222px;
    overflow: auto;
    background: #eee;
    border-radius: 4px;
    padding-top: 4px;
    .show-item {
      padding: 3px 10px;
    }
  }

  .part-top {
    margin: 10px;
    .title {
      margin: 10px 0;
    }
  }

  .correct-color {
    color: #3DBE2E;
  }

  .error-color {
    color: #e00000;
  }
</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title">扫描复核</h2>
        <div class="part-top">
          <span class="title" v-show="leftNumberList.length">【箱编码】</span>
          <ul class="show-list ui-left">
            <li class="show-item" v-for="s in leftNumberList">
              {{ s.id }}
              <i class="iconfont icon-correct correct-color" v-if="s.status === 1"></i>
              <i class="iconfont icon-error error-color" v-if="s.status === 2"></i>
              <span class="delete-remove" @click="removeNumberItem(s)">X</span>
            </li>
          </ul>
        </div>
        <div class="part-top">
          <span class="title" v-show="leftSeriesList.length">【散件编码】</span>
          <ul class="show-list ui-left">
            <li class="show-item" v-for="s in leftSeriesList">
              {{ s.id }}
              <i class="iconfont icon-correct correct-color" v-if="s.status === 1"></i>
              <i class="iconfont icon-error error-color" v-if="s.status === 2"></i>
              <span class="delete-remove" @click="removeSeriesItem(s)">X</span>
            </li>
          </ul>
        </div>
        <div class="opera-btn">
          <div type="primary" class="btn" @click="submit">提交编码</div>
          <div type="primary" class="btn" @click="reviewPass">通过复核</div>
        </div>
      </div>
      <div class="content-right">
        <h3></h3>

        <el-form ref="form" :model="form" label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="箱编码">
                <el-input type="textarea" v-model="form.number" class="input-width" :rows="10"
                          @change="formatNumberToAry"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" align="right" style="padding-right: 10px;padding-top: 10px">
              <span v-show="rightNumberList.length">箱编码</span>
            </el-col>
            <el-col :span="10">
              <ul class="show-list ui-right" v-show="rightNumberList.length">
                <li class="show-item" v-for="i in rightNumberList">{{ i }}</li>
              </ul>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="散件编码">
                <el-input type="textarea" v-model="form.series" class="input-width" :rows="10"
                          @change="formatSeriesToAry"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" align="right" style="padding-right: 10px;padding-top: 10px">
              <span v-show="rightSeriesList.length">散件编码</span>
            </el-col>
            <el-col :span="10" v-show="rightSeriesList.length">
              <ul class="show-list ui-right">
                <li class="show-item" v-for="s in rightSeriesList">{{ s }}</li>
              </ul>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  import {InWork, http, Wave} from '@/resources';

  export default {
    props: {
      orderId: {
        'type': String,
        'default': ''
      },
      showPartIndex: String
    },
    data() {
      return {
        form: {
          number: '',
          series: ''
        },
        rightNumberList: [],
        rightSeriesList: [],
        leftNumberList: [],
        leftSeriesList: []
      };
    },
    watch: {
      showPartIndex: function (val) {
        this.resetParam();
        if (val !== '1') return;
        this.queryCodes();
      }
    },
    mounted() {

    },
    methods: {
      resetParam() {
        this.rightNumberList = [];
        this.rightSeriesList = [];
        this.form.number = '';
        this.form.series = '';
      },
      submit() {
        let ary1 = [];
        this.rightNumberList.slice().forEach(i => {
          ary1.push({
            type: 0,
            code: i
          });
        });
        this.rightSeriesList.slice().forEach(i => {
          ary1.push({
            type: 1,
            code: i
          });
        });
        if (ary1.length === 0) {
          this.$notify.info({
            message: '请输入编码'
          });
          return;
        }
        InWork.reviewScan(this.orderId, ary1).then(() => {
          this.$notify.success({
            message: '提交成功'
          });
          this.queryCodes();
          this.resetParam();
        }).catch(error => {
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '提交失败'
          });
        });
      },
      queryCodes() { // 查询追溯码
        InWork.queryCodes(this.orderId).then(res => {
          this.leftNumberList = res.data.packageDtoList;
          this.leftSeriesList = res.data.codeGoodsDtoList;
        });
      },
      reviewPass() {
        InWork.assignPlace(this.orderId).then(res => {
          this.$notify.success({
            message: '通过复核成功'
          });
          this.$emit('close');
        }).catch(error => {
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '通过复核失败'
          });
        });
      },
      removeNumberItem(item) {
        Wave.deleteCode(item.logId).then(res => {
          let index = this.leftNumberList.indexOf(item);
          this.leftNumberList.splice(index, 1);
        });
      },
      removeSeriesItem(item) {
        Wave.deleteCode(item.logId).then(res => {
          let index = this.leftSeriesList.indexOf(item);
          this.leftSeriesList.splice(index, 1);
        });
      },
      formatNumberToAry(value) {
        this.rightNumberList = value.split(/[\n,\s，]/g).filter(i => i);
      },
      formatSeriesToAry(value) {
        this.rightSeriesList = value.split(/[\n,\s，]/g).filter(i => i);
      }
    }
  };
</script>
