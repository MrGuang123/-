(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.EchartLineHot = factory());
}(this, function() {

  function EchartLineHot() {
    this.map;
  }

  EchartLineHot.prototype = {
    init: function(data) {
      var domElement = document.getElementById(data.id);
      this.map = echarts.init(domElement);
      this._createMap(data.data);
    },
    resetMapData:function(data){
      this.option.series[0].data = data.hotspotData.data;
      this.option.series[1].data = data.lineData;
      this.map.setOption(this.option);
    },
    _createMap: function(data) {
      // 获取线 的数据
      function getAirportCoord(idx) {
        return [data.lineData.airports[idx][3], data.lineData.airports[idx][4]];
      }
      var routes = data.lineData.routes.map(function(airline) {
        return [
          getAirportCoord(airline[1]),
          getAirportCoord(airline[2])
        ];
      });

      //获取热点数据
      var hotspot = this._getHospot(data.hotspotData);


      this.option = {
        backgroundColor: '#002865',
        tooltip: {
          /*formatter: function(param) {
            var route = data.lineData.routes[param.dataIndex];
            return data.lineData.airports[route[1]][1] + ' > ' + data.lineData.airports[route[2]][1];
          }*/
        },
        visualMap: {
          show: false,
          min: hotspot.domain[0],
          max: hotspot.domain[1],
          splitNumber: 5,
          inRange: {
            color: hotspot.rangeColor.reverse()
          },
          textStyle: {
            color: '#fff'
          }
        },
        geo: {
          map: 'world',
          left: 0,
          right: 0,
          silent: true,
          itemStyle: {
            normal: {
              borderColor: '#0F92E4',
              color: '#0F92E4'
            }
          }
        },
        series: [
        {
          type: 'heatmap',
          coordinateSystem: 'geo',
          zlevel:1,
          data:hotspot.data
        },
        {
          type: 'lines',
          coordinateSystem: 'geo',
          zlevel:2,
          data: routes,
          large: true,
          largeThreshold: 100,
          lineStyle: {
            normal: {
              color: '#52F7F7',
              opacity: 0.05,
              width: 0.5,
              curveness: 0.3
            }
          },
          // 设置混合模式为叠加
          blendMode: 'lighter'
        }, ]
      }

      this.map.setOption(this.option);
    },
    _getHospot: function(data) {
      return {
        rangeColor: data.rangeColor,
        domain: data.domain,
        data:data.data
      }
    }
  }

  return EchartLineHot;
}))
