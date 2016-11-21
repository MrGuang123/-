(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.MapStorm = factory());
}(this, function() {

  function MapStorm() {
    this.map;
  }

  MapStorm.prototype = {
    init: function(dataObj) {
      this._createMap(dataObj); //创建地图
      this._setMapEvent(); //设置地图事件
      this._addMapOverlay(dataObj.data); //向地图添加覆盖物
      this._addStorm(dataObj.stormPos);
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
      this._addMapOverlay(data);
    },
    _createMap: function(dataObj) {
      var firstLat = dataObj.center.lat,
        firstLng = dataObj.center.lng;

      //地图类型：，默认是普通地图，BMAP_SATELLITE_MAP是卫星图，BMAP_HYBRID_MAP是混合地图
      //混合地图默认是开启路网的，样式和卫星图一样，路网就是道路城市名称
      this.map = new BMap.Map(dataObj.id, { mapType: BMAP_HYBRID_MAP });
      this.map.centerAndZoom(new BMap.Point(firstLng, firstLat), dataObj.zoom);
      this.map.addEventListener('click', function(event) {
        console.log(event.point.lat, event.point.lng);
      })
    },
    _setMapEvent: function() {
      this.map.enableScrollWheelZoom();
      this.map.enableKeyboard();
      this.map.enableDragging();
      this.map.enableDoubleClickZoom();
    },
    _addStorm: function(data) {
      var point = new BMap.Point(data.lng, data.lat);
      var marker = new BMap.Marker(point, {
        icon: new BMap.Icon("./img/storm.png", new BMap.Size(400, 273), {
          imageOffset: new BMap.Size(0, 0)
        })
      });
      this.map.addOverlay(marker);
    },
    _addMapOverlay: function(dataArr) {

      for (var index = 0; index < dataArr.length; index++) {
        var point = new BMap.Point(dataArr[index].position.lng, dataArr[index].position.lat);
        var marker = new BMap.Marker(point, {
          icon: new BMap.Icon("./img/vertex2.png", new BMap.Size(20, 25), {
            imageOffset: new BMap.Size(-100, 0)
          })
        });

        var opts = {
          width: 200,
          title: dataArr[index].title,
          enableMessage: false
        };

        var content = dataArr[index].content;
        console.log(content.parentNode)
        console.log(content)

        var label = new BMap.Label(content,opts);
        label.setZIndex(10000);
        label.setStyle({
          border:'none',
          background:'transparent'
        })

        var infoWindow = new BMap.InfoWindow(content);
        marker.setLabel(label);
        this.map.addOverlay(marker);
      };

    }
  }

  return MapStorm;
}));
