(function(global,factory){
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.MapThermodynamic = factory());
}(this,function(){

  function MapThermodynamic(){
    this.map;
    this.options = {
            size: 2,
            shape: BMAP_POINT_SHAPE_CIRCLE,
            color: '#F2B002'
        }
  }

  MapThermodynamic.prototype = {
    init : function(data){
      if(data.color){
        this.options.color = data.color;
      }

      this._createMap(data);//创建地图
      this._setMapEvent();//设置地图事件
      this._addPoint(data.data);
    },
    show:function(){

    },
    hide : function(){
      this.map.clearOverlays();
    },
    resize:function(){

    },
    resetMapData:function(data){
      this.map.clearOverlays();
      this._addPoint(data);
    },
    _startPoint:function(dataArr){
      return  startPoint = {
          x: dataArr[0].position[0],
          y: dataArr[0].position[1]
      }
    },
    _createMap:function(dataObj){
      var firstLat = dataObj.data[0][0],
          firstLng = dataObj.data[0][1];

      //地图类型：，默认是普通地图，BMAP_SATELLITE_MAP是卫星图，BMAP_HYBRID_MAP是混合地图
      //混合地图默认是开启路网的，样式和卫星图一样，路网就是道路城市名称
      this.map = new BMap.Map(dataObj.id,{mapType:BMAP_SATELLITE_MAP});
      this.map.centerAndZoom(new BMap.Point(firstLat,firstLng),dataObj.zoom);
    },
    _setMapEvent:function(){
      this.map.enableScrollWheelZoom();
      this.map.enableKeyboard();
      this.map.enableDragging();
      this.map.enableDoubleClickZoom()
    },
    _addPoint : function(data){
      var points = [];  // 添加海量点数据
        for (var i = 0; i < data.length; i++) {
          points.push(new BMap.Point(data[i][0], data[i][1]));
        }

        var pointCollection = new BMap.PointCollection(points, this.options);  // 初始化PointCollection
        /*pointCollection.addEventListener('click', function (e) {
          //alert('单击点的坐标为：' + e.point.lng + ',' + e.point.lat);  // 监听点击事件
        });*/
        this.map.addOverlay(pointCollection);  // 添加Overlay
    }
  }

return MapThermodynamic;
}));