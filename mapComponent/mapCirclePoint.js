(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.MapCirclePoint = factory());
}(this, function() {

  function MapCirclePoint() {
    this.map;
    this.geoCoord = {};
    this.mapData = [];
    this.BMapExtCase;
    this.map;
    this.option;
    this.flag = true;
    this.timer = null;
    this.jktimer;
    this.time = 0;
  }

  MapCirclePoint.prototype = {
    init: function(data) {

      //将获取的数据转换为地图使用的数据
      if (data.data.length <= 0) {
        console.log('传入的数据有误');
        return;
      }
      // 初始化地图
      this.BMapExtCase = new BMapExt(document.getElementById(data.id), BMap, echarts, {
        enableMapClick: false
      });
      //获取到百度地图
      this.map = this.BMapExtCase.getMap();
      //获取到echarts对象
      this.container = this.BMapExtCase.getEchartsContainer();


      //设置百度地图的一些参数
      var point = new BMap.Point(data.center[0], data.center[1]);
      this.map.centerAndZoom(point, data.zoom); // 展现的位置
      this.map.setMapType(BMAP_HYBRID_MAP); // 地图类型
      this.map.enableScrollWheelZoom(true); //滚轮放大缩小

      this.map.addEventListener('click', function(event) {
        console.log(event.point.lng, event.point.lat);
      })

      this._setMapData(data.data);
      var _this = this;
      setTimeout(function() {
        _this._circleAnimate();
      }, 0)

    },
    show: function() {

    },
    hide: function() {
      this.map.clearOverlays();
    },
    resize: function() {

    },
    addTurtle: function(data) {
      var points = [];
      var startPoint = new BMap.Point(data[0][0], data[0][1]);
      var turtleMarker = new BMap.Marker(startPoint, {
        icon: new BMap.Icon("./img/ship.png", new BMap.Size(68, 48), {
          imageOffset: new BMap.Size(0, 0)
        })
      });
      this.map.addOverlay(turtleMarker);
      turtleMarker.setZIndex(10);
      turtleMarker.id = 'turtle';
      for (var i = 0, len = data.length - 1; i < len; i++) {
        points = points.concat(this._getStep(data[i], data[i + 1]));
      }
      this._turtleAnimate(turtleMarker, points);

    },
    _turtleAnimate: function(marker, points) {
      var _this = this;
      _this.time++;
      setTimeout(function() {

        marker.setPosition(points[_this.time]);
        if (_this.time >= 50) {
          _this.time = 0;
          var overlays = _this.map.getOverlays();
          for (var x = 0, leng = overlays.length; x < leng; x++) {
            if (overlays[x].id == 'turtle') {
              _this.map.removeOverlay(overlays[x]);
            }
          }
          return;
        }
        _this._turtleAnimate(marker, points);
      }, 100)
    },
    _getStep: function(begin, end) {
      var count = 10;
      var points = [];
      var horDistance = (end[0] - begin[0]) / 10;
      var verDistance = (end[1] - begin[1]) / 10;
      // console.log(horDistance, begin[0])
      while (count--) {
        points.push(new BMap.Point(begin[0] + horDistance * (10 - count), begin[1] + verDistance * (10 - count)))
      }
      return points;
    },
    resetMapData: function(data) {
      this._setMapData(data);
      var _this = this;
      setTimeout(function() {
        _this._circleAnimate();
      }, 0)
    },
    _setMapData: function(data) {

      this._addPoint(data);
      this._addCircle(data);
      this._addCurve(data);
    },
    _startPoint: function(dataArr) {
      return startPoint = {
        x: dataArr[0].position[0],
        y: dataArr[0].position[1]
      }
    },
    _convertGeoData: function(data) {
      var innerObj = {};
      for (var i = 0, len = data.length; i < len; i++) {
        innerObj[data[i].name] = data[i].position;
      }
      return innerObj;

    },
    _convertMapData: function(data) {
      var dataArr = data;
      /*dataArr = dataArr.forEach(function(item){
        delete item.position;
      })*/
      return dataArr;
    },
    _addCurve: function(data) {
      var points = [],
        curveStyle = {
          strokeColor: "#01AD37",
          strokeWeight: 2,
          strokeStyle: 'dashed',
          strokeOpacity: 0.8
        };
      for (var i = 0, len = data.length; i < len; i++) {
        points.push(new BMap.Point(data[i].position[0], data[i].position[1]));
      }
      points.push(new BMap.Point(data[0].position[0], data[0].position[1]))
      var curve = new BMapLib.CurveLine(points, curveStyle);
      this.map.addOverlay(curve);
      // curve.enableEditing();
    },
    _addCircle: function(dataArr) {
      for (var index = 0; index < dataArr.length; index++) {
        var point = new BMap.Point(dataArr[index].position[0] - 0.2, dataArr[index].position[1]);
        var marker = new BMap.Marker(point, {
          icon: new BMap.Icon("./img/bigCircle.png", new BMap.Size(150, 150), {
            imageOffset: new BMap.Size(0, 0)
          })
        });
        var opts = {
          width: 200,
          title: dataArr[index].name,
          enableMessage: false
        };
        marker.id = 'circle';
        this.map.addOverlay(marker);
      }

    },
    _circleAnimate: function() {
      var imgs = document.querySelectorAll('div > img[src="./img/bigCircle.png"]');
      var _this = this;
      clearInterval(this.timer);
      this.timer = setInterval(function() {
        _this._animate(imgs)
      }, 1000)
    },
    _animate: function(doms) {
      if (this.flag) {
        for (var i = 0, len = doms.length; i < len; i++) {
          doms[i].style.transform = 'scale(0.3)';
          doms[i].style.transitionDuration = '1s';
          doms[i].style.transitionTimingFunction = 'ease-in-out';
        }
        this.flag = false;
      } else {
        for (var i = 0, len = doms.length; i < len; i++) {
          doms[i].style.transform = 'scale(1)';
        }
        this.flag = true;
      }
    },
    _addPoint: function(dataArr) {
      /*var overlays = this.map.getOverlays();
      for(var i=0,len=overlays.length; i<len; i++){
        if(overlays[i].id == 'point'){
          this.map.removeOverlay(overlays[i])
        }
      }*/
      this.map.clearOverlays();
      // console.log(overlays);
      for (var index = 0; index < dataArr.length; index++) {
        var point = new BMap.Point(dataArr[index].position[0] - 0.15, dataArr[index].position[1] + 0.2);
        var marker = new BMap.Marker(point, {
          icon: new BMap.Icon("./img/vertex2.png", new BMap.Size(20, 25), {
            imageOffset: new BMap.Size(0, 0)
          })
        });
        var opts = {
          width: 200,
          title: dataArr[index].name,
          enableMessage: false
        };
        var infoWindow = new BMap.InfoWindow(dataArr[index].content, opts);
        this._addClickHandler(marker, infoWindow);
        marker.id = 'point';
        this.map.addOverlay(marker);
      };
    },
    _addClickHandler: function(target, window) {
      target.addEventListener("click", function() {
        target.openInfoWindow(window);
      });
    }
  }

  return MapCirclePoint;
}));
