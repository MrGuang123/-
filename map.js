(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.Map = factory());
}(this, function() {

  function Map() {
    // 地图对象
    this.map;

    // 覆盖物样式
    this.icons = [{
      iconSrc: './mapComponent2/img/circle.png',
      iconSize: [82, 82],
      iconOffset: [0, 0],
      animate: true
    }];
    this.lineStyle = {
      color: '#f00',
      weight: 2,
      style: 'dashed', //solid
      opacity: 0.8
    };
    this.polygonStyle = {
      fillColor: ['#B3DFFC', '#F9DA1F', '#FF7200'],
      fillOpacity: 0.3
    };
    this.heatmapStyle = {
      color: ['#C74D36', '#F02B1A'],
      radius: 20
    };

    // 覆盖物事件
    this.pointClick = null;
    this.pointMouseover = null;
    this.pointMouseout = null;
  }

  Map.prototype = {
    // 初始化方法，包括地图的样式，图标线条等覆盖物样式
    init: function(dataObj) {
      this._createMap(dataObj); //创建地图
      this._setMapEvent(); //设置地图事件
    },
    // 让地图中的覆盖物显示
    show: function(data) {
      if (data.lineData) {
        this._addlineOverlay(data.lineData);
      }
      if (data.pointData) {
        this._addpointOverlay(data.pointData);
      }
      if (data.polygonData) {
        this._addPolygon(data.polygonData)
      }
      if (data.heatmapData) {
        this._addHeatmap(data.heatmapData)
      }
    },
    // 隐藏地图覆盖物
    hide: function() {
      this.map.clearOverlays();
    },
    // 重置大小
    resize: function() {

    },
    // 重置地图数据
    resetMapData: function(data) {
      this.map.clearOverlays();
    },
    //创建地图
    _createMap: function(dataObj) {
      var mapType = dataObj.mapType || '',
        theme = dataObj.theme || '',
        firstLat = dataObj.center[0] || 39.821087,
        firstLng = dataObj.center[1] || 116.303299;
      if (!mapType) {
        this.map = new BMap.Map(dataObj.id);
      } else {
        this.map = new BMap.Map(dataObj.id, {
          mapType: mapType
        });
      }
      if (theme) {
        this.map.setMapStyle(theme);
      }
      if (dataObj.heatmapType && dataObj.zoom <= 4) {
        this._mapShake(dataObj.center);
      }
      this.icons = dataObj.iconsType ? dataObj.iconsType : {};
      this.lineStyle = dataObj.lineType ? dataObj.lineType : {};
      this.polygonStyle = dataObj.polygonType ? dataObj.polygonType : {};
      this.heatmapStyle = dataObj.heatmapType ? dataObj.heatmapType : {};

      this.map.centerAndZoom(new BMap.Point(firstLng, firstLat), dataObj.zoom);
    },
    // 设置地图事件
    _setMapEvent: function() {
      this.map.enableScrollWheelZoom();
      this.map.enableKeyboard();
      this.map.enableDragging();
      this.map.enableDoubleClickZoom()
    },
    setEvent: function(eventList) {
      this.pointClick = eventList.pointClick;
    },
    // 添加线条覆盖物
    _addlineOverlay: function(dataArr) {
      var points = [],
        style = this.lineStyle || {},
        curveStyle = {
          strokeColor: style.color,
          strokeWeight: style.weight,
          strokeStyle: style.style,
          strokeOpacity: style.opacity
        };

      for (var index = 0, len = dataArr.length; index < len; index++) {
        points.push(new BMap.Point(dataArr[index][1], dataArr[index][0]))
      }
      points.push(new BMap.Point(dataArr[0][1], dataArr[0][0]))
      var curve = new BMapLib.CurveLine(points, curveStyle);
      this.map.addOverlay(curve);
    },
    // 添加点覆盖物
    _addpointOverlay: function(dataArr) {
      var _this = this,
        icons = this.icons;

      for (var iconIndex = 0, iconLength = icons.length; iconIndex < iconLength; iconIndex++) {
        var iconSrc = icons[iconIndex].iconSrc || 'http://api.map.baidu.com/lbsapi/createmap/images/icon.png',
          iconx = icons[iconIndex].iconSize ? icons[iconIndex].iconSize[0] : 20,
          icony = icons[iconIndex].iconSize ? icons[iconIndex].iconSize[1] : 25,
          offsetX = icons[iconIndex].offset ? icons[iconIndex].offset[0] : 0,
          offsetY = icons[iconIndex].offset ? icons[iconIndex].offset[1] : 0,
          iconOffsetX = icons[iconIndex].iconOffset ? icons[iconIndex].iconOffset[0] : 0,
          iconOffsetY = icons[iconIndex].iconOffset ? icons[iconIndex].iconOffset[1] : 0,
          icon = new BMap.Icon(iconSrc, new BMap.Size(iconx, icony), {
            imageOffset: new BMap.Size(iconOffsetX, iconOffsetY)
          });

        if (icons[iconIndex].animate) {
          (function(iconSrc) {
            setTimeout(function() {
              _this._circleAnimate(iconSrc);
            }, 0)
          })(iconSrc)
        }

        if (icons[iconIndex].crossLine) {
          this._addCrossLine(icons[iconIndex].crossLine, dataArr);
        }

        for (var index = 0; index < dataArr.length; index++) {
          var point = new BMap.Point(dataArr[index].position[1] + offsetX, dataArr[index].position[0] + offsetY);
          var marker = new BMap.Marker(point, {
            icon: icon
          });

          marker.dataInfo = dataArr[index];
          marker.setZIndex(iconIndex);
          marker.addEventListener('click', this.pointClick);
          this.map.addOverlay(marker);
        }
      }
    },
    // 添加十字线覆盖物
    _addCrossLine: function(style, dataArr) {
      var lines = [],
        horStyle = {
          strokeColor: style.color[0],
          strokeWeight: style.weight,
          strokeOpacity: style.opacity,
        },
        verStyle = {
          strokeColor: style.color[1],
          strokeWeight: style.weight,
          strokeOpacity: style.opacity,
        };

      for (var i = 0, len = dataArr.length; i < len; i++) {
        var horPoints = [
          new BMap.Point(-180, dataArr[i].position[0]),
          new BMap.Point(180, dataArr[i].position[0]),
        ];
        var verPoints = [
          new BMap.Point(dataArr[i].position[1], -62),
          new BMap.Point(dataArr[i].position[1], 280),
        ];
        var horizontalLine = new BMap.Polyline(horPoints, horStyle);
        var verticalLine = new BMap.Polyline(verPoints, verStyle);
        this.map.addOverlay(horizontalLine);
        this.map.addOverlay(verticalLine);
      }
    },
    // 添加不规则覆盖物
    _addPolygon: function(dataArr) {
      this.polygonStyle.fillColor = colorArr(this.polygonStyle.fillColor, dataArr.length);
      for (var i = 0, len = dataArr.length; i < len; i++) {
        var points = baiduPoint(dataArr[i]);
        var polygon = new BMap.Polygon(points, {
          strokeColor: this.polygonStyle.fillColor[i],
          strokeWeight: 1,
          fillColor: this.polygonStyle.fillColor[i],
          fillOpacity: this.polygonStyle.fillOpacity,
          strokeOpacity: 0.1
        }); //创建多边形
        this.map.addOverlay(polygon);
      }
    },
    // 添加热力图覆盖物
    _addHeatmap: function(dataArr) {
      var colors = {},
        max = this.heatmapStyle.max,
        color = this.heatmapStyle.color,
        radius = this.heatmapStyle.radius;

      for (var m = 0, length = color.length; m < length; m++) {
        colors[m] = color[m];
      }

      var heatmapOverlay = new BMapLib.HeatmapOverlay({
        "radius": radius,
        gradient: colors
      });
      this.map.addOverlay(heatmapOverlay);
      heatmapOverlay.setDataSet({ data: dataArr, max: max });
      heatmapOverlay.show();
    },
    // 点闪动方法
    _circleAnimate: function(iconSrc) {
      var imgs = document.querySelectorAll('div > img[src="' + iconSrc + '"]');
      var _this = this;
      clearInterval(this.timer);
      this.timer = setInterval(function() {
        _this._animate(imgs)
      }, 1000)
    },
    // 点闪动方法调用的运动函数
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
    // 为了解决热点图出现时候点不齐问题，让地图加载后移动一下到指定位置
    _mapShake: function(data) {
      var _this = this;
      setTimeout(function() {
        // _this.map.panTo(new BMap.Point(data[0]-60,data[1]));
        _this.map.panTo(new BMap.Point(data[0] - 45, data[1]));
      }, 100)
    },
  }

  // 为了让颜色数组的数量和数据数量保持一致的函数，颜色缺少重新循环
  function colorArr(colorArr, dataLength) {
    var arr = [].concat(colorArr),
      count = Math.ceil(dataLength / arr.length);
    for (var i = 0, len = count.length; i < len; i++) {
      arr = arr.concat(arr);
    }
    return arr;
  }

  // 传入一个点数组，返回一个百度地图点数组
  function baiduPoint(dataArr) {
    var points = [];
    for (var i = 0, len = dataArr.length; i < len; i++) {
      points.push(new BMap.Point(dataArr[i][0], dataArr[i][1]));
    }
    return points;
  }

  return Map;
}));
