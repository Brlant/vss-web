<template>
  <div>
    <el-row>
      <el-col :span="18">
        <object id="view1" type="application/x-eloamplugin" width="100%" height="400" name="view"></object>
      </el-col>
      <el-col :span="6">
        <object id="thumb1" type="application/x-eloamplugin" width="100%" height="400" name="thumb"></object>
      </el-col>
    </el-row>
    <div style="margin-top:20px">
      <el-button @click="Scan">拍照</el-button>
      <el-button type="primary" class="pull-right" @click="close">确 定</el-button>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'gpy',
    data: function () {
      let sdata = {
        Video: '',
        thumb: '',
        plugin: '',
        view: '',
        option: {
          SelectType: '1',
          dev: '',
          nResolution: '0'
        }
      };
      return sdata;
    },
    props: {
      content: {
        type: String,
        default: ''
      }
    },
    mounted: function () {
      this.thumb = document.getElementById('thumb1');
      this.plugin = document.getElementById('view1');
      this.view = document.getElementById('view1');
      let that = this;
      setTimeout(function () {
        that.Load();
      }, 500);
    },
    methods: {
      addEvent: function (obj, name, func) {
        if (obj.attachEvent) {
          obj.attachEvent('on' + name, func);
        } else {
          obj.addEventListener(name, func, false);
        }
      },
      close: function () {
        this.Unload();
        this.$emit('close');
      },
      OpenVideo: function () {

        console.log('sssss', this.option.dev, '222');
        // this.CloseVideo();

        // var nResolution = sResolution.selectedIndex;

        this.Video = this.plugin.Device_CreateVideo(this.option.dev, this.option.nResolution, this.option.SelectType);
        console.log(this.option.dev, this.option.nResolution, this.option.SelectType);
        if (this.Video) {
          this.view.View_SelectVideo(this.Video);
          this.view.View_SetText('打开视频中，请等待...', 0);

        }

      },
      CloseVideo: function () {
        if (this.Video) {
          this.view.View_SetText('', 0);
          this.plugin.Video_Release(this.Video);
          this.Video = null;
        }
      },
      Load: function () {
        // 设备接入和丢失
        // type设备类型， 1 表示视频设备， 2 表示音频设备
        // idx设备索引
        // dbt 1 表示设备到达， 2 表示设备丢失
        let that = this;
        this.addEvent(this.plugin, 'DevChange', function (type, idx, dbt) {
          if (type === 1) {// 视频设备
            if (dbt === 1) {// 设备到达
              that.option.dev = that.plugin.Global_CreateDevice(1, idx);
              that.OpenVideo();
            } else if (dbt === 2) {// 设备丢失
              that.CloseVideo();
            }
          }
        });
        this.view.Global_SetWindowName('view');
        this.thumb.Global_SetWindowName('thumb');
        this.plugin.Global_InitDevs();
      },
      Unload: function () {
        try {
          if (this.Video) {
            this.view.View_SetText('', 0);
            this.plugin.Video_Release(this.Video);
            this.Video = null;
          }
          if (this.option.dev) {
            this.plugin.Device_Release(this.option.dev);
            this.option.dev = null;
          }
          this.plugin.Global_DeinitDevs();
        } catch (e) {

        }

      },

      Scan: function () {
        let date = new Date();
        let yy = date.getFullYear().toString();
        let mm = (date.getMonth() + 1).toString();
        let dd = date.getDate().toString();
        let hh = date.getHours().toString();
        let nn = date.getMinutes().toString();
        let ss = date.getSeconds().toString();
        let mi = date.getMilliseconds().toString();
        let Name = 'D:\\' + yy + mm + dd + hh + nn + ss + mi + '.jpg';

        let img = this.plugin.Video_CreateImage(this.Video, 0, this.view.View_GetObject());
        let bSave = this.plugin.Image_Save(img, Name, 0);
        if (bSave) {
          this.view.View_PlayCaptureEffect();
          this.thumb.Thumbnail_Add(Name);
        }

        this.plugin.Image_Release(img);
      }
    }
  };
</script>
