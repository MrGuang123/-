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
    this.specialPointStyle = [{
      iconSrc: './mapComponent1/img/plain.png',
      iconSize: [59, 60],
      iconOffset: [0, 0],
      rotate: 0
    }];
    this.ThermodynamicStyle = {
      size: 2,
      shape: BMAP_POINT_SHAPE_CIRCLE,
      color: '#F2B002'
    }

    // 覆盖物事件
    this.pointClick = null;
    this.pointMouseover = null;
    this.pointMouseout = null;

    //参数
    this.time = 0;
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
      if (data.specialPointData) {
        this._addSpecialPoint(data.specialPointData)
      }
      if (data.ThermodynamicData) {
        this._addThermodynamic(data.ThermodynamicData);
      }
    },
    // 隐藏地图覆盖物
    hide: function() {
      this.map.clearOverlays();
    },
    // 重置地图数据
    resetMapData: function(data) {
      this.map.clearOverlays();
    },
    //创建地图
    _createMap: function(dataObj) {
      var mapType = dataObj.mapType || '',
        theme = dataObj.theme || '',
        firstLng = dataObj.center[0] || 116.303299,
        firstLat = dataObj.center[1] || 39.821087;
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
        // this._mapShake(dataObj.center);
      }
      this.icons = dataObj.iconsType ? dataObj.iconsType : this.icons;
      this.lineStyle = dataObj.lineType ? dataObj.lineType : this.lineStyle;
      this.polygonStyle = dataObj.polygonType ? dataObj.polygonType : this.polygonStyle;
      this.heatmapStyle = dataObj.heatmapType ? dataObj.heatmapType : this.heatmapStyle;
      this.specialPointStyle = dataObj.specialPointType ? dataObj.specialPointType : this.specialPointStyle;
      this.ThermodynamicStyle = dataObj.ThermodynamicType ? dataObj.ThermodynamicType : this.ThermodynamicStyle;

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
      this.specialPointClick = eventList.specialPointClick;
      this.pointMouseover = eventList.pointMouseover;
      this.pointMouseout = eventList.pointMouseout;
    },
    // 加载海量点
    _addThermodynamic: function(dataArr) {
      var points = []; // 添加海量点数据
      var style = this.ThermodynamicStyle;
      for (var i = 0; i < dataArr.length; i++) {
        points.push(new BMap.Point(dataArr[i][0], dataArr[i][1]));
      }

      var pointCollection = new BMap.PointCollection(points, style); // 初始化PointCollection
      /*pointCollection.addEventListener('click', function (e) {
        //alert('单击点的坐标为：' + e.point.lng + ',' + e.point.lat);  // 监听点击事件
      });*/
      this.map.addOverlay(pointCollection); // 添加Overlay
    },
    // 添加特殊点覆盖物
    _addSpecialPoint: function(dataArr) {
      var style = this.specialPointStyle;
      console.log(style)
      for (var i = 0, len = style.length; i < len; i++) {
        var iconsrc = style[i].iconSrc,
          iconx = style[i].iconSize[0],
          icony = style[i].iconSize[1],
          offsetx = style[i].iconOffset[0],
          offsety = style[i].iconOffset[1],
          icon = new BMap.Icon(iconsrc, new BMap.Size(iconx, icony), {
            imageOffset: new BMap.Size(offsetx, offsety)
          });
        if (dataArr[i]) {
          var point = new BMap.Point(dataArr[i][0], dataArr[i][1]);
          var marker = new BMap.Marker(point, { icon: icon });
          marker.setRotation(style.rotate);
          marker.id = 'special';
          marker.dataInfo = dataArr[i];
          marker.addEventListener('click', this.specialPointClick);
          this.map.addOverlay(marker);
        }
      }
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
      curve.id = 'curve';
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
        if (icons[iconIndex].mouseChange && icons[iconIndex].mouseChange.change) {
          var iconflag = true,
            ionSrc = icons[iconIndex].mouseChange.iconSrc,
            iconx = icons[iconIndex].mouseChange.iconSize[0],
            icony = icons[iconIndex].mouseChange.iconSize[1],
            offsetx = icons[iconIndex].mouseChange.iconOffset[0],
            offsety = icons[iconIndex].mouseChange.iconOffset[1],
            exicon = new BMap.Icon(ionSrc, new BMap.Size(iconx, icony), {
              imageOffset: new BMap.Size(offsetx, offsety),
              //anchor:new BMap.Size(15,15)
            });
        }

        if (icons[iconIndex].label && icons[iconIndex].label.show) {
          var opts = {
            width: icons[iconIndex].label.width,
            enableMessage: false
          };
          var labelFlag = true;
        }

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
          marker.id = 'point';
          marker.setZIndex(iconIndex);
          marker.addEventListener('click', this.pointClick);

          if (labelFlag) {
            var content = dataArr[index].label || '';
            var label = new BMap.Label(content, opts);
            label.setZIndex(10);
            label.setStyle({
              border: 'none',
              background: 'transparent'
            })
            console.log(label);
            label.addEventListener('mouseover', function() {
              this.setZIndex(10000);
              // this['V'].style.zIndex = 1000;
            });
            label.addEventListener('mouseout', function() {
              this.setZIndex(10);
              // this['V'].style.zIndex = 10;
            })

            marker.setLabel(label);
          }

          marker.addEventListener('mouseover', function(event) {
            if (iconflag) {
              this.setIcon(exicon)
            }
            _this.pointMouseover(event);
          })
          marker.addEventListener('mouseout', function(event) {
            if (iconflag) {
              this.setIcon(icon)
            }
            _this.pointMouseout(event);
          })
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
        horizontalLine.id = 'cross';
        verticalLine.id = 'cross';
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
        polygon.id = 'polygon';
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
      heatmapOverlay.id = 'heatmapOverlay';
      this.map.addOverlay(heatmapOverlay);
      heatmapOverlay.setDataSet({ data: dataArr, max: max });
      heatmapOverlay.show();
    },
    // 添加一个覆盖物沿着给定路线走的方法
    addTurtle: function(data) {
      var points = [],
        style = data.style,
        dataArr = data.data;
      var startPoint = new BMap.Point(dataArr[0][0], dataArr[0][1]);
      var turtleMarker = new BMap.Marker(startPoint, {
        icon: new BMap.Icon(style.iconSrc, new BMap.Size(style.iconSize[0] || 20, style.iconSize[1] || 25), {
          imageOffset: new BMap.Size(style.iconOffset[0] || 0, style.iconOffset[1] || 0)
        })
      });
      this.map.addOverlay(turtleMarker);
      turtleMarker.setZIndex(style.zIndex || 10);
      turtleMarker.id = 'turtle';
      for (var i = 0, len = dataArr.length - 1; i < len; i++) {
        points = points.concat(getStep(dataArr[i], dataArr[i + 1]));
      }
      this._turtleAnimate(turtleMarker, points);
    },
    // 移动到指定坐标并且将地图缩放到指定级别
    moveToTarget: function(data) {
      var centerPoint = new BMap.Point(data.moveTo[0], data.moveTo[1]);
      this.map.setZoom(data.zoom);
      this.map.panTo(centerPoint);
    },
    // 运动方法
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
    _addMouseHandler: function(target) {
      target.addEventListener('mouseover', function() {
        target.setIcon(new BMap.Icon("./img/circle1.png", new BMap.Size(50, 50), {
          imageOffset: new BMap.Size(0, 0),
          //anchor:new BMap.Size(25,25)
        }))
      })
      target.addEventListener('mouseout', function() {
        target.setIcon(new BMap.Icon("./img/circle2.png", new BMap.Size(30, 30), {
          imageOffset: new BMap.Size(0, 0),
          //anchor:new BMap.Size(15,15)
        }))
      })
    }
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

  //将每个坐标点之间分成十步走
  function getStep(begin, end) {
    var count = 10;
    var points = [];
    var horDistance = (end[0] - begin[0]) / 10;
    var verDistance = (end[1] - begin[1]) / 10;
    // console.log(horDistance, begin[0])
    while (count--) {
      points.push(new BMap.Point(begin[0] + horDistance * (10 - count), begin[1] + verDistance * (10 - count)))
    }
    return points;
  }

  return Map;
}));
