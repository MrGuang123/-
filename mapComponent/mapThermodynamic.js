(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.MapThermodynamic = factory());
}(this, function() {

  function MapThermodynamic() {
    this.map;
    this.options = {
      size: 2,
      shape: BMAP_POINT_SHAPE_CIRCLE,
      color: '#F2B002'
    }
  }

  MapThermodynamic.prototype = {
    init: function(data) {
      if (data.color) {
        this.options.color = data.color;
      }

      this._createMap(data); //创建地图
      this._setMapEvent(); //设置地图事件
      this._addPoint(data.data);
    },
    show: function() {

    },
    hide: function() {
      this.map.clearOverlays();
    },
    resize: function() {

    },
    resetMapData: function(data) {
      this.map.clearOverlays();
      this._addPoint(data);
    },
    moveToShip: function(dataObj) {
      //每次渲染添加船只的时候先删除地图上的船只
      var dataArr = dataObj.data,
        iconX = dataObj.iconSize[0] || 20,
        iconY = dataObj.iconSize[1] || 25,
        offsetX = dataObj.iconOffset[0] || 0,
        offsetY = dataObj.iconOffset[0] || 0,
        centerPoint = new BMap.Point(dataObj.moveTo[1] || dataArr[0][1], dataObj.moveTo[0] || dataArr[0][0]),
        icon = new BMap.Icon(dataObj.iconSrc, new BMap.Size(iconX, iconY), {
          imageOffset: new BMap.Size(offsetX, offsetY)
        }),
        overlays = this.map.getOverlays();
      console.log(centerPoint)
      for (var i = 0, len = overlays.length; i < len; i++) {
        if (overlays[i].id == 'ship') {
          this.map.removeOverlay(overlays[i]);
        }
      }

      //添加船只坐标
      for (var j = 0, length = dataArr.length; j < length; j++) {
        var point = new BMap.Point(dataArr[j].position[1], dataArr[j].position[0]);
        var marker = new BMap.Marker(point, { icon: icon });
        marker.id = 'ship';
        for (item in dataArr[j]) {
          if (item == 'position') continue;
          marker[item] = dataArr[j][item];
        }
        this.map.addOverlay(marker);
        marker.addEventListener('click', dataObj.shipCallback);
      }

      this.map.setZoom(8);
      this.map.panTo(centerPoint);

    },
    _startPoint: function(dataArr) {
      return startPoint = {
        x: dataArr[0].position[0],
        y: dataArr[0].position[1]
      }
    },
    _createMap: function(dataObj) {
      var firstLat = dataObj.data[0][0],
        firstLng = dataObj.data[0][1];

      //地图类型：，默认是普通地图，BMAP_SATELLITE_MAP是卫星图，BMAP_HYBRID_MAP是混合地图
      //混合地图默认是开启路网的，样式和卫星图一样，路网就是道路城市名称
      this.map = new BMap.Map(dataObj.id, { mapType: BMAP_SATELLITE_MAP });
      this.map.centerAndZoom(new BMap.Point(firstLat, firstLng), dataObj.zoom);
    },
    _setMapEvent: function() {
      this.map.enableScrollWheelZoom();
      this.map.enableKeyboard();
      this.map.enableDragging();
      this.map.enableDoubleClickZoom()
    },
    _addPoint: function(data) {
      var points = []; // 添加海量点数据
      for (var i = 0; i < data.length; i++) {
        points.push(new BMap.Point(data[i][0], data[i][1]));
      }

      var pointCollection = new BMap.PointCollection(points, this.options); // 初始化PointCollection
      /*pointCollection.addEventListener('click', function (e) {
        //alert('单击点的坐标为：' + e.point.lng + ',' + e.point.lat);  // 监听点击事件
      });*/
      this.map.addOverlay(pointCollection); // 添加Overlay
    }
  }

  return MapThermodynamic;
}));
