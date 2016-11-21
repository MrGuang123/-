(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.MapHotspot = factory());
}(this, function() {

  function MapHotspot() {
    this.map;
    this.callback;
  }

  MapHotspot.prototype = {
    init: function(data) {
      this._createMap(data);
      this._setMapEvent();
    },
    show: function() {

    },
    hide: function() {
      this.map.clearOverlays();
    },
    resize: function() {

    },
    _startPoint: function(dataArr) {
      return startPoint = {
        x: dataArr[0].position[0],
        y: dataArr[0].position[1]
      }
    },
    _createMap: function(dataObj) {

      // 百度地图API功能
      this.map = new BMap.Map(dataObj.id, {
        enableMapClick: false
      }); // 创建Map实例
      this.map.centerAndZoom(new BMap.Point(dataObj.center[0], dataObj.center[1]), dataObj.zoom); // 初始化地图,设置中心点坐标和地图级别

      this.map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
      this.map.addEventListener('click', function(e) {
        console.log(e.point.lng + "," + e.point.lat)
      })
      this.map.setMapStyle({
        styleJson: [{
          "featureType": "water",
          "elementType": "all",
          "stylers": {
            "color": "#042F52"
          }
        }, {
          "featureType": "land",
          "elementType": "all",
          "stylers": {
            "color": "#0A78C5"
          }
        }, {
          "featureType": "boundary",
          "elementType": "geometry",
          "stylers": {
            "color": "#0A78C5"
          }
        }, {
          "featureType": "label",
          "elementType": "labels.text.fill",
          "stylers": {
            "color": "#ffffff",
            "weight": "4",
            "lightness": 2,
            "saturation": -53
          }
        }]
      });
      this._mapShake(dataObj.center);

      this.callback = dataObj.pointCallback;

      this._createCover(dataObj.data.plate,dataObj.bgColor[0]);
      this._createCover(dataObj.data.medSea,dataObj.bgColor[1]);
      this._createCover(dataObj.data.pacificOcean,dataObj.bgColor[2]);
      this._createHeatmapCover(dataObj.data.heatMap,dataObj.bgColor[3]);

      this._addPoint(dataObj.data.point);

    },
    resetMapData:function(dataObj){
      this.map.clearOverlays();
      this._createCover(dataObj.data.plate,dataObj.bgColor[0]);
      this._createCover(dataObj.data.medSea,dataObj.bgColor[1]);
      this._createCover(dataObj.data.pacificOcean,dataObj.bgColor[2]);
      this._createHeatmapCover(dataObj.data.heatMap,dataObj.bgColor[3]);

      this._addPoint(dataObj.data.point);
    },
    _setMapEvent: function() {
      // this.map.disableScrollWheelZoom();
      this.map.enableScrollWheelZoom();
      this.map.enableKeyboard();
      // this.map.disableDragging();
      this.map.enableDragging();
      this.map.disableDoubleClickZoom();
      //this.map.enableDoubleClickZoom()
    },
    _createCover: function(data,color) {
      var positionData = [];
      for(var i=0,len=data.length; i<len; i++){
        positionData.push(new BMap.Point(data[i][0], data[i][1]))
      }
      var polygon = new BMap.Polygon(
        positionData,
       { strokeColor: color, strokeWeight: 1,fillColor:color, fillOpacity: 0.3,strokeOpacity:0.1 }); //创建多边形
      this.map.addOverlay(polygon);
    },
    _createHeatmapCover : function(data,color){
      var heatmapOverlay = new BMapLib.HeatmapOverlay({
        "radius":20,
        gradient:{
          0:color[0],
          1:color[1]
        }
      });
      this.map.addOverlay(heatmapOverlay);
      heatmapOverlay.setDataSet({data:data,max:50});
      heatmapOverlay.show();
    },
    _mapShake:function(data){
      var _this = this;
      setTimeout(function(){
      // _this.map.panTo(new BMap.Point(data[0]-60,data[1]));
      _this.map.panTo(new BMap.Point(data[0]-45,data[1]));
      }, 100)
    },
    _addPoint:function(dataArr){
      for(var index = 0; index < dataArr.length; index++ ){
        var point = new BMap.Point(dataArr[index].position[0],dataArr[index].position[1]);
        var marker = new BMap.Marker(point,{icon:new BMap.Icon("./img/vertex1.png",new BMap.Size(20,25),{
          imageOffset: new BMap.Size(0,0)
        })});
        marker.setZIndex(100)
        var opts = {
          width: 200,
          title: dataArr[index].name,
          enableMessage: false
        };
        var infoWindow = new BMap.InfoWindow(dataArr[index].content,opts);
        this._addClickHandler(marker,this.callback);
        this.map.addOverlay(marker);
      };
    },
    _addClickHandler:function (target,callback){
      target.addEventListener("click",callback);
    }
  }

  return MapHotspot;
}));
