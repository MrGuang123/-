(function(global,factory){
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.MapCirclePoint = factory());
}(this,function(){

  function MapCirclePoint(){
    this.map;
    this.geoCoord = {};
    this.mapData = [];
    this.BMapExtCase;
    this.map;
    this.option;
    this.flag = true;
    this.timer = null;
  }

  MapCirclePoint.prototype = {
    init : function(data){

      //将获取的数据转换为地图使用的数据
      if(data.data.length <= 0) {
        console.log('传入的数据有误');
        return;
      }

      //设置起始点
      var startPoint = this._startPoint(data.data);



        // 初始化地图
        this.BMapExtCase = new BMapExt(document.getElementById(data.id), BMap, echarts,{
            enableMapClick: false
        });
        //获取到百度地图
        this.map = this.BMapExtCase.getMap();
        //获取到echarts对象
        this.container = this.BMapExtCase.getEchartsContainer();


        //设置百度地图的一些参数
        var point = new BMap.Point(startPoint.x, startPoint.y);
        this.map.centerAndZoom(point, 5);// 展现的位置
        this.map.setMapType(BMAP_HYBRID_MAP); // 地图类型
        this.map.enableScrollWheelZoom(true); //滚轮放大缩小

        this._setMapData(data.data);
        var _this = this;
        setTimeout(function(){
          _this._circleAnimate();
        }, 0)

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
      var _this = this;
      setTimeout(function(){
        _this._circleAnimate();
      }, 0)
    },
    _setMapData:function(data){

      this._addPoint(data);
      this._addCircle(data);

    },
    _startPoint:function(dataArr){
      return  startPoint = {
          x: dataArr[0].position[0],
          y: dataArr[0].position[1]
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
      var dataArr = data;
      /*dataArr = dataArr.forEach(function(item){
        delete item.position;
      })*/
      return dataArr;
    },
    _addCircle:function(dataArr){
      for(var index = 0; index < dataArr.length; index++ ){
        var point = new BMap.Point(dataArr[index].position[0]-0.2,dataArr[index].position[1]);
        var marker = new BMap.Marker(point,{icon:new BMap.Icon("./img/bigCircle.png",new BMap.Size(150,150),{
          imageOffset: new BMap.Size(0,0)
        })});
        var opts = {
          width: 200,
          title: dataArr[index].name,
          enableMessage: false
        };
        marker.id='circle';
        this.map.addOverlay(marker);
      }

    },
    _circleAnimate:function(){
      var imgs = document.querySelectorAll('div > img[src="./img/bigCircle.png"]');
      var _this = this;
      clearInterval(this.timer);
      this.timer = setInterval(function(){
        _this._animate(imgs)
      }, 1000)
    },
    _animate:function(doms){
      if(this.flag){
        for(var i=0,len=doms.length; i<len; i++){
          doms[i].style.transform = 'scale(0.3)';
          doms[i].style.transitionDuration = '1s';
          doms[i].style.transitionTimingFunction = 'ease-in-out';
        }
        this.flag = false;
      }else {
        for(var i=0,len=doms.length; i<len; i++){
          doms[i].style.transform = 'scale(1)';
        }
        this.flag = true;
      }
    },
    _addPoint : function(dataArr){
      /*var overlays = this.map.getOverlays();
      for(var i=0,len=overlays.length; i<len; i++){
        if(overlays[i].id == 'point'){
          this.map.removeOverlay(overlays[i])
        }
      }*/
      this.map.clearOverlays();
      // console.log(overlays);
      for(var index = 0; index < dataArr.length; index++ ){
        var point = new BMap.Point(dataArr[index].position[0],dataArr[index].position[1]+0.6);
        var marker = new BMap.Marker(point,{icon:new BMap.Icon("./img/vertex2.png",new BMap.Size(20,25),{
          imageOffset: new BMap.Size(0,0)
        })});
        marker.setZIndex(10000)
        var opts = {
          width: 200,
          title: dataArr[index].name,
          enableMessage: false
        };
        var infoWindow = new BMap.InfoWindow(dataArr[index].content,opts);
        this._addClickHandler(marker,infoWindow);
        marker.id='point';
        this.map.addOverlay(marker);
      };
    },
    _addClickHandler:function (target,window){
      target.addEventListener("click",function(){
        target.openInfoWindow(window);
      });
    }
  }

return MapCirclePoint;
}));