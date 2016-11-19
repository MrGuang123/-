(function(global,factory){
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.MapEmpty = factory());
}(this,function(){

  function MapEmpty(){
    this.map;
    this.geoCoord = {};
    this.mapData = [];
    this.BMapExtCase;
    this.map;
    this.option;
  }

  MapEmpty.prototype = {
    init : function(data){
      this._createMap(data);//创建地图
      this._setMapEvent();//设置地图事件
    },
    show:function(){

    },
    hide : function(){
      this.map.clearOverlays();
    },
    resize:function(){

    },
    _startPoint:function(dataArr){
      return  startPoint = {
          x: dataArr[0].position[0],
          y: dataArr[0].position[1]
      }
    },
    _createMap:function(dataObj){
      var firstLat = dataObj.data.position[0],
          firstLng = dataObj.data.position[1];
          console.log(firstLat,firstLng);

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
  }

return MapEmpty;
}));