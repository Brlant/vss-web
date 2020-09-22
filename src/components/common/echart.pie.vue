<style scoped="">
.echarts2 {
  height: 100px;
  width: 100px;
}
</style>
<template>
  <e-charts :options="polar" class="echarts2"></e-charts>
</template>
<script>
import ECharts from 'vue-echarts/components/ECharts.vue';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
//  import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';

export default {
  components: {ECharts},
  props: {
    dataList: {
      type: Array,
      default: function () {
        return [0, 1];
      }
    }
  },
  data() {
    let arr = [];
    let stateArr = [];
    let name = '';
    let index = 0;
    let len = 0;
    stateArr = ['已存放', '可存放'];
    len = stateArr.length;
    this.dataList.forEach((v) => {
      if (len > index) {
        name = stateArr[index];
      } else {
        name = '';
      }
      arr.push({value: v, name: name});
      index++;
    });
    return {
      polar: {
        tooltip: {
          trigger: 'item',
          position: 'right',
          formatter: '{b}: {c} ({d}%)'
        },
        series: [
          {
            type: 'pie',
            radius: '75%',
            center: ['50%', '50%'],
            label: {
              normal: {
                show: false,
                position: 'left'
              }
            },
            data: arr,
            itemStyle: {
              normal: {
                color: function (params) {
                  let colorList = [
                    '#009fc3', '#eeeeee', '#FCCE10', '#E87C25', '#27727B',
                    '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                    '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                  ];
                  return colorList[params.dataIndex];
                }
              },
              emphasis: {
                shadowBlur: 2,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    };
  },
  methods: {}
};
</script>
