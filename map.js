(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.Map = factory());
}(this, function() {

  function Map() {
    this.map;
  }

  Map.prototype = {
    init: function(dataObj) {
      this._createMap(dataObj); //创建地图
      this._setMapEvent(); //设置地图事件
    },
    show: function(data) {
      if (data.lineData) {
        this._addlineOverlay(data.lineData);
      }
      if (data.pointData) {
        this._addpointOverlay(data.pointData);
      }
    },
    hide: function() {
      this.map.clearOverlays();
    },
    resize: function() {

    },
    resetMapData: function(data) {
      this.map.clearOverlays();
    },
    _createMap: function(dataObj) {
      var mapType = dataObj.mapType || '',
        firstLat = dataObj.center[0] || 39.821087,
        firstLng = dataObj.center[1] || 116.303299;
      if (!mapType) {
        this.map = new BMap.Map(dataObj.id);
      }
      this.map = new BMap.Map(dataObj.id, { mapType: mapType });
      this.map.centerAndZoom(new BMap.Point(firstLng, firstLat), dataObj.zoom);
    },
    _setMapEvent: function() {
      this.map.enableScrollWheelZoom();
      this.map.enableKeyboard();
      this.map.enableDragging();
      this.map.enableDoubleClickZoom()
    },
    _addlineOverlay: function(dataObj) {
      var points = [],
        dataArr = dataObj.data,
        style = dataObj.style || {},
        curveStyle = {
          strokeColor: style.color || '#01AD37',
          strokeWeight: style.weight || 2,
          strokeStyle: style.style || 'dashed',
          strokeOpacity: style.opacity || 0.8
        };

      for (var index = 0, len = dataArr.length; index < len; index++) {
        points.push(new BMap.Point(dataArr[index][1], dataArr[index][0]))
      }
      points.push(new BMap.Point(dataArr[0][1], dataArr[0][0]))
      var curve = new BMapLib.CurveLine(points, curveStyle);
      this.map.addOverlay(curve);
    },
    _addpointOverlay: function(dataObj) {
      var _this = this,
        dataArr = dataObj.data,
        icons = dataObj.icons;

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
          var marker = new BMap.Marker(point, { icon: icon });

          for (item in dataArr[index]) {
            if (dataArr[index][item] == 'position') continue;
            marker[item] = dataArr[index][item];
          }
          marker.setZIndex(iconIndex);
          marker.addEventListener('click', dataObj.callback);
          this.map.addOverlay(marker);
        }
      }
    },
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
        console.log(dataArr[i].position.lat)
        var horizontalLine = new BMap.Polyline(horPoints, horStyle);
        var verticalLine = new BMap.Polyline(verPoints, verStyle);
        this.map.addOverlay(horizontalLine);
        this.map.addOverlay(verticalLine);
      }
    },
    _circleAnimate: function(iconSrc) {
      var imgs = document.querySelectorAll('div > img[src="' + iconSrc + '"]');
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
  }

  return Map;
}));
