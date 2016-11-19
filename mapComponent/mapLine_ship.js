(function(global,factory){
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.MapLineShip = factory());
}(this,function(){

  function MapLineShip(){
    this.map;
    this.mapData = [];
    this.geoCoord = {};
    this.BMapExtCase = null;
    this.container = null;
  }

  MapLineShip.prototype = {
    init : function(data){

        // 初始化地图
        this.BMapExtCase = new BMapExt($('#' + data.id)[0], BMap, echarts,{
            enableMapClick: false
        });

        //获取到百度地图
        this.map = this.BMapExtCase.getMap();
        //获取到echarts对象
        this.container = this.BMapExtCase.getEchartsContainer();

        //设置起始点
        var centerX = data.center[0];
        var centerY = data.center[1];
        //设置百度地图的一些参数
        var point = new BMap.Point(centerX, centerY);
        this.map.centerAndZoom(point, data.zoom);// 展现的位置
        this.map.setMapType(BMAP_HYBRID_MAP); // 地图类型
        this.map.enableScrollWheelZoom(true); //滚轮放大缩小

        // this.map.addEventListener('click',function(event){
        //   console.log(event.point.lng,event.point.lat)
        // })

        this._setMapData(data.data);

    },
    show:function(data){

    },
    hide : function(){
      this.map.clearOverlays();
    },
    resize:function(){

    },
    resetMapData:function(data){
      this._setMapData(data);
    },
    _setMapData:function(data){

        this.geoCoord = this._convertGeoData(data.vertexs);
        this.mapData = this._convertMapData(data.shipLine);

        //添加轮船覆盖物
        if(data.shipLine){
          this._addShip(data.shipLine)
        }

        option = {
            tooltip : {
                trigger: 'item',
                formatter: function (v) {
                    return v[1].replace('>', ' => ');
                }
            },
            series : [
                {
                    type:'map',
                    mapType: 'none',
                    data:[],
                    geoCoord: this.geoCoord,
                    markLine : {
                        zlevel:-10,
                        smooth:true,
                        smoothness:0.4,
                        /*effect : {
                            show: true,
                            scaleSize: 1,
                            period: 30,
                            color: '#E5A274',
                            shadowBlur: 10
                        },*/
                        itemStyle : {
                            normal: {
                              color:'#EE6500',
                                borderWidth:1,
                                lineStyle: {
                                    type: 'dashed',
                                    shadowBlur: 10
                                }
                            }
                        },
                        data : this.mapData
                    }
                }

            ]
        };

        var myChart = this.BMapExtCase.initECharts(this.container);
        window.onresize = myChart.onresize;
        this.BMapExtCase.setOption(option);
    },
    _addShip:function(dataArr){
        var overlays = this.map.getOverlays();
        for(var n=0,len=overlays.length; n<len; n++){
            if(overlays[n].id == 'ship'){
                this.map.removeOverlay(overlays[n]);
            }
        }
      for(var m=0,length=dataArr.length; m<length; m++){
        var shipPosition = this._getposByname(dataArr[m][Math.floor(dataArr[m].length/2)]);
        var point = new BMap.Point(shipPosition[0],shipPosition[1]);
        var marker = new BMap.Marker(point,{icon:new BMap.Icon("./img/ship.png",new BMap.Size(68,48),{
          imageOffset: new BMap.Size(0,0)
        })});
        marker.id = 'ship';
        this.map.addOverlay(marker);
      }
    },
    _getposByname : function(name){
      return this.geoCoord[name];
    },
    _convertGeoData : function(data){
      var innerObj = {};
      for(var i=0,len=data.length; i<len; i++){
        innerObj[data[i].name] = data[i].position;
      }
      return innerObj;
    },
    _convertMapData:function(data){
      var outerArr = [],
          innerArr = [];

      for(var i=0,len=data.length; i<len; i++){
        for(var j=0,length=data[i].length; j<length-1; j++){
          innerArr.push({name:data[i][j]},{name:data[i][j+1]});
          if(innerArr.length = 2){
            outerArr.push(innerArr);
            innerArr = [];
          }
        }

      }

      return outerArr;
    }
  }

return MapLineShip;
}))