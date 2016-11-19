
(function(global,factory){
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.MapLinePoint = factory());
}(this,function(){

  function MapLinePoint(){
    this.map;
    this.callback;
  }

  MapLinePoint.prototype = {
    init:function(dataObj){
      this.callback = dataObj.callback;
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
      var firstLat = dataObj.center.lat,
          firstLng = dataObj.center.lng;

      //地图类型：，默认是普通地图，BMAP_SATELLITE_MAP是卫星图，BMAP_HYBRID_MAP是混合地图
      //混合地图默认是开启路网的，样式和卫星图一样，路网就是道路城市名称
      this.map = new BMap.Map(dataObj.id,{mapType:BMAP_HYBRID_MAP});
      this.map.centerAndZoom(new BMap.Point(firstLng,firstLat),dataObj.zoom);

    },
    _setMapEvent:function(){
      this.map.enableScrollWheelZoom();
      this.map.enableKeyboard();
      this.map.disableDragging();
      this.map.enableDragging();
      this.map.enableDoubleClickZoom()
    },
    _addMapOverlay:function(dataArr){

      for(var index = 0; index < dataArr.length; index++ ){
        var point = new BMap.Point(dataArr[index].position.lng,dataArr[index].position.lat);
        var marker = new BMap.Marker(point,{icon:new BMap.Icon("./img/circle1.png",new BMap.Size(50,50),{
          imageOffset: new BMap.Size(0,0)
        })});

        var verStyle = {
          strokeColor:'#045E95',
          strokeWeight:1,
          strokeOpacity:0.6,
        };
        var horStyle = {
          strokeColor:'#00D2FF',
          strokeWeight:1,
          strokeOpacity:0.6,
        };

        var horPoints = [
          new BMap.Point(-180,dataArr[index].position.lat),
          new BMap.Point(180,dataArr[index].position.lat),
        ];
        var verPoints = [
          new BMap.Point(dataArr[index].position.lng,-62),
          new BMap.Point(dataArr[index].position.lng,280),
        ];

        var horizontalLine = new BMap.Polyline(horPoints,horStyle);
        var verticalLine = new BMap.Polyline(verPoints,verStyle);

        var opts = {
          width: 200,
          title: dataArr[index].title,
          enableMessage: false
        };
        marker.title = dataArr[index].title;
        marker.content = dataArr[index].content;
        marker.src = dataArr[index].src;
        // var infoWindow = new BMap.InfoWindow(dataArr[index].content,opts);
        this._addClickHandler(marker,this.callback);
        this.map.addOverlay(horizontalLine);
        this.map.addOverlay(verticalLine);
        this.map.addOverlay(marker);
      };
    },
    _addClickHandler:function (target,callback){
      target.addEventListener("click",callback);
    }
  }

  return MapLinePoint;
}));