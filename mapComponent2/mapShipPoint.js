(function(global,factory){
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.MapLineAir = factory());
}(this,function(){

  function MapLineAir(){
    this.map;
    this.mapData = [];
    this.geoCoord = {};
    this.BMapExtCase = null;
    this.container = null;
  }

  MapLineAir.prototype = {
    init : function(data){

        // 初始化地图
        this.BMapExtCase = new BMapExt(document.getElementById(data.id), BMap, echarts,{
            enableMapClick: false
        });
        //获取到百度地图
        this.map = this.BMapExtCase.getMap();
        //获取到echarts对象
        this.container = this.BMapExtCase.getEchartsContainer();


        //设置百度地图的一些参数
        var point = new BMap.Point(data.center[0], data.center[1]);
        this.map.centerAndZoom(point, data.zoom);// 展现的位置
        this.map.setMapType(BMAP_HYBRID_MAP); // 地图类型
        this.map.enableScrollWheelZoom(true); //滚轮放大缩小

        //this._setMapData(data.data);

    },
    show:function(){

    },
    hide : function(){
      this.map.clearOverlays();
    },
    resize:function(){

    },
    resetMapData:function(data){
      this._setMapData(data);
    },
    _setMapData : function(data){
      //百度地图添加点
        if(data.vertexs){
          this._addPoint(data.vertexs);
        }

        this.geoCoord = this._convertGeoData(data.vertexs);
        this.mapData = data.edges;

        //添加飞机覆盖物
        if(data.shipLine){
          this._addShip(data.shipLine)
        }


        option = {
            color: ['gold','aqua','lime'],
            title : {
                text: '',
                subtext:'',
                x:'center',
                textStyle : {
                    color: '#fff'
                }
            },
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
                        // effect : {
                        //     show: true,
                        //     scaleSize: 1,
                        //     period: 30,
                        //     color: '#E5A274',
                        //     shadowBlur: 10
                        // },
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
    _addPoint : function(dataArr){
      var overlays = this.map.getOverlays();
      console.log(overlays)
      for(var i=0,len=overlays.length; i<len; i++){
        if(overlays[i].id == 'point'){
          this.map.removeOverlay(overlays[i]);
        }
      }
      for(var index = 0; index < dataArr.length; index++ ){
        var point = new BMap.Point(dataArr[index].position[0],dataArr[index].position[1]+0.8);
        var marker = new BMap.Marker(point,{icon:new BMap.Icon("./img/vertex2.png",new BMap.Size(20,25),{
          imageOffset: new BMap.Size(0,0)
        })});
        marker.setZIndex(100)
        var opts = {
          width: 200,
          title: dataArr[index].name,
          enableMessage: false
        };
        marker.id = 'point';
        var infoWindow = new BMap.InfoWindow(dataArr[index].content,opts);
        this._addClickHandler(marker,infoWindow);
        this.map.addOverlay(marker);
      };
    },
    _addShip:function(dataArr){
      var overlays = this.map.getOverlays();
      for(var n=0,leng=overlays.length; n<leng; n++){
        if(overlays[n].id=='ship'){
          this.map.removeOverlay(overlays[n])
        }
      }

      for(var m=0,length=dataArr.length; m<length; m++){
        var fromX = this.geoCoord[dataArr[m].from][0];
        var fromY = this.geoCoord[dataArr[m].from][1];
        var toX = this.geoCoord[dataArr[m].to][0];
        var toY = this.geoCoord[dataArr[m].to][1];
        var xDeviation = toX - fromX;
        var yDeviation = toY - fromY;
        var d_value = 2.5;
        if(Math.abs(xDeviation) == xDeviation && Math.abs(yDeviation) == -yDeviation){
          var planePosition = [fromX + xDeviation/2+d_value , fromY + yDeviation/2];
        }else if (Math.abs(xDeviation) == -xDeviation && Math.abs(yDeviation) == yDeviation){
          var planePosition = [fromX + xDeviation/2-d_value , fromY + yDeviation/2];
        }else if (Math.abs(xDeviation) == -xDeviation && Math.abs(yDeviation) <= 2){
          var planePosition = [fromX + xDeviation/2 , fromY + yDeviation/2+d_value];
        }else if (Math.abs(xDeviation) == xDeviation && Math.abs(yDeviation) <= 2){
          var planePosition = [fromX + xDeviation/2 , fromY + yDeviation/2-d_value];
        }

        var point = new BMap.Point(planePosition[0],planePosition[1]);
        var marker = new BMap.Marker(point,{icon:new BMap.Icon("./img/ship.png",new BMap.Size(68,48),{
          imageOffset: new BMap.Size(0,0)
        })});
        /*if(Math.abs(xDeviation) == xDeviation && Math.abs(yDeviation) == -yDeviation){
          marker.setRotation(-90);
        }else if (Math.abs(xDeviation) == -xDeviation && Math.abs(yDeviation) == yDeviation){
          marker.setRotation(90);
        }else if (Math.abs(xDeviation) == -xDeviation && Math.abs(yDeviation) <= 2){
          marker.setRotation(0);
        }else if (Math.abs(xDeviation) == xDeviation && Math.abs(yDeviation) <= 2){
          marker.setRotation(180);
        }*/
        marker.id = 'ship';
        // console.log(marker)
        this.map.addOverlay(marker);
      }
    },
    _startPoint:function(data){
      return {
        x:data[0],
        y:data[1]
      }
    },
    _convertGeoData : function(data){
      var innerObj = {};
      for(var i=0,len=data.length; i<len; i++){
        innerObj[data[i].name] = data[i].position;
      }
      return innerObj;

    },
    _convertMapData : function(data){
      var innerArr = [],
          outerArr = [];

    },
    _addClickHandler:function (target,window){
      target.addEventListener("click",function(){
        target.openInfoWindow(window);
      });
    }
  }

return MapLineAir;
}))