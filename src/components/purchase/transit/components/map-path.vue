<style scoped>
  .map-path {
    margin-bottom: 10px;
  }
</style>
<template>
  <div>
    <div v-show="!points.length" class="empty-info mini">暂无轨迹信息</div>
    <el-amap v-show="points.length" ref="pathMap" :vid="vid" :amap-manager="amapManager"
             :style="mapStyle" :zoom="10" class="map-path">
    </el-amap>
  </div>
</template>
<script>
import {AMapManager} from 'vue-amap';
import CarImg from '@/assets/img/car.png';
import MapMixin from '../mixins/mapMixin';
import {http} from '@/resources';
export default {
    props: {
      currentItem: Object,
      mapStyle: {
        type: Object,
        default () {
          return {
            height: '300px'
          };
        }
      },
      vid: {
        type: String,
        default: 'pathMap'
      }
    },
    mixins: [MapMixin],
    data () {
      return {
        amapManager: new AMapManager(),
        pathSimplifierIns: null,
        points: []
      };
    },
    watch: {
      currentItem:{
        deep: true,
        immediate: true,
        handler(val){
          this.points = [];
          if (!val.waybillNumber) return;
          this.queryPath(val.waybillNumber);
        } 
      }
    },
    methods: {
      queryPath (waybillNumber) {
        let params = {
          waybillNo:waybillNumber,
          startDate:this.currentItem.startTransportTime,
          endDate:this.currentItem.completeTime?this.currentItem.completeTime:''
        }
        http.get(`/erp-order/track`, {params}).then(res => {
          let {code,data,msg} = res
          if(code == 200){
            this.points = data.filter(f => f.longitude && f.latitude).map((m, index) => {
              return {
                lnglat: [m.longitude, m.latitude],
                time: this.$moment(m.collectionTime).format('YYYY-MM-DD HH:mm:ss'),
                name: this.currentItem.receiverAddress
              };
            });
            this.points.length && this.drawPath(this.points);
          }else{
            this.$message.warning(msg)
          }
        })
        .catch(err=>{
          if(err && err.response && err.response.data && err.response.data.msg){
            this.$message.warning(err.response.data.msg)
          }
        })
      },
      // 创建轨迹线对象
      createPathSimplifier (PathSimplifier) {
        const pathSimplifierIns = new PathSimplifier({
          zIndex: 100,
          map: this.amapManager._map, //所属的地图实例
          getPath: function (pathData, pathIndex) {
            let points = pathData.points;
            let lnglatList = [];
            for (let i = 0, len = points.length; i < len; i++) {
              lnglatList.push(points[i].lnglat);
            }
            return lnglatList;
          },
          getHoverTitle: function (pathData, pathIndex, pointIndex) {
            if (typeof pointIndex !== 'number') return '收货地址：' + pathData.points[0].name;
            if (pointIndex === 0) return pathData.points[pointIndex].time + '出发';
            if (pointIndex === pathData.points.length - 1) return pathData.points[pointIndex].time + '到达目的地（' + pathData.points[0].name + '）';
            return pathData.points[pointIndex].time + '路过此地';
          },
          renderOptions: {
            startPointStyle: {
              radius: 8
            },
            endPointStyle: {
              radius: 8
            }
          }
        });
        this.pathSimplifierIns = pathSimplifierIns;
        return pathSimplifierIns;
      },
      // 创建巡航器对象
      createPathNavigator (PathSimplifier, pathSimplifierIns) {
        // 销毁现存的所有轨迹巡航器
        pathSimplifierIns.clearPathNavigators();
        // 重新创建新的导航器
        const nav = pathSimplifierIns.createPathNavigator(0, {
          loop: false,
          speed: 5000,
          pathNavigatorStyle: {
            width: 16,
            height: 32,
            content: PathSimplifier.Render.Canvas.getImageContent(CarImg, onload, onerror),
            strokeStyle: null,
            fillStyle: null
          }
        });
        nav.start();
      },
      // 画线
      drawPath (points) {
        window.AMapUI.loadUI(['misc/PathSimplifier'], PathSimplifier => {
          const pathSimplifierIns = this.pathSimplifierIns ? this.pathSimplifierIns : this.createPathSimplifier(PathSimplifier);
          pathSimplifierIns.setData([{points}]);
          pathSimplifierIns.setSelectedPathIndex(0);
          this.addMapTools();
          // this.createPathNavigator(PathSimplifier, pathSimplifierIns);
        });
      }
    }
  };
</script>
