
(function(global,factory){
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.MapPoint = factory());
}(this,function(){

  function MapPoint(){
    this.map;
  }

  MapPoint.prototype = {
    init:function(dataObj){
      this._createMap(dataObj);//创建地图
      this._setMapEvent();//设置地图事件
      this._addMapOverlay(dataObj.data);//向地图添加覆盖物
    },
    show:function(){

    },
    hide:function(){
      this.map.clearOverlays();
    },
    resize:function(){

    },
    resetMapData:function(data){
      this.map.clearOverlays();
      this._addMapOverlay(data);
    },
    _createMap:function(dataObj){
      var firstLat = dataObj.data[0].position.lat,
          firstLng = dataObj.data[0].position.lng;
          console.log(firstLat,firstLng);

      //地图类型：，默认是普通地图，BMAP_SATELLITE_MAP是卫星图，BMAP_HYBRID_MAP是混合地图
      //混合地图默认是开启路网的，样式和卫星图一样，路网就是道路城市名称
      this.map = new BMap.Map(dataObj.id,{mapType:BMAP_HYBRID_MAP});
      this.map.centerAndZoom(new BMap.Point(firstLng,firstLat),dataObj.zoom);
    },
    _setMapEvent:function(){
      this.map.enableScrollWheelZoom();
      this.map.enableKeyboard();
      this.map.enableDragging();
      this.map.enableDoubleClickZoom()
    },
    _addMapOverlay:function(dataArr){
      /*var markers = [
        {content:"我的备注",title:"我的标记",imageOffset: {width:0,height:3},position:{lat:39.921087,lng:116.403299}}
      ];*/
      for(var index = 0; index < dataArr.length; index++ ){
        var point = new BMap.Point(dataArr[index].position.lng,dataArr[index].position.lat);
        var marker = new BMap.Marker(point,{icon:new BMap.Icon("./img/vertex2.png",new BMap.Size(20,25),{
          imageOffset: new BMap.Size(0,0)
        })});

        //var label = new BMap.Label(dataArr[index].title,{offset: new BMap.Size(25,5)});
        var opts = {
          width: 200,
          title: dataArr[index].title,
          enableMessage: false
        };
        var infoWindow = new BMap.InfoWindow(dataArr[index].content,opts);
        //marker.setLabel(label);
        this._addClickHandler(marker,infoWindow);
        this.map.addOverlay(marker);
      };
    },
    _addClickHandler:function (target,window){
      target.addEventListener("click",function(){
        target.openInfoWindow(window);
      });
    }
  }

  return MapPoint;
}));