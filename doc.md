## 地图组件文档（map.js）
1. 首先需要在页面中引入百度地图，http://api.map.baidu.com/api?v=2.0&ak=GAksItkSpA2HzIVHA0xAbLGVhdHXbKf9。ak后面是一个使用百度地图需要的验证码。不同的地图可能还需要引入其他的百度地图组件文件。
    - 比如http://api.map.baidu.com/library/Heatmap/2.0/src/Heatmap_min.js等等
    - 还有的需要结合echarts2，就需要下载一个echarts2文件，[传送门](http://echarts.baidu.com/echarts2/)
2. 引入map.js文件
3. 接下来就是使用了。

### 使用方法
1. 引入map.js的时候会在全局产生一个Map对象，需要创建一个Map对象的实例，然后使用init方法先初始化地图，init方法中需要传入参数是一个对象。只使用init方法的时候会呈现一个空的地图,（覆盖物有默认样式，如果不填写覆盖物样式将使用默认样式）

```javascript
    map.init({
        id: 'map',   //用来防止地图的DOM元素
        center: [39.821087, 116.303299],   //地图显示的中心点
        //地图的类型BMAP_SATELLITE_MAP是卫星图，BMAP_HYBRID_MAP是混合地图，如果不加入这个参数的话，默认是普通地图
        mapType: 'BMAP_HYBRID_MAP',   
        zoom: 9,   //地图显示的缩放级别
        //设置地图主题，以百度地图API为准
        theme: {
          styleJson: [{
            "featureType": "water",
            "elementType": "all",
            "stylers": {
              "color": "#042F52"
            }
          }, {
            "featureType": "land",
            "elementType": "all",
            "stylers": {
              "color": "#0A78C5"
            }
          }, {
            "featureType": "boundary",
            "elementType": "geometry",
            "stylers": {
              "color": "#0A78C5"
            }
          }, {
            "featureType": "label",
            "elementType": "labels.text.fill",
            "stylers": {
              "color": "#ffffff",
              "weight": "4",
              "lightness": 2,
              "saturation": -53
            }
          }]
        },
        //point数据中使用的图标参数，有两个图标对象就会所有点都生成两个图标
        iconsType: [{
          iconSrc: './mapComponent2/img/circle.png',
          iconSize: [82, 82],
          iconOffset: [0, 0],
          animate: true
        }, {
          iconSrc: './mapComponent2/img/vertex2.png',
          iconSize: [22, 25],
          iconOffset: [0, 0], //背景偏移
          offset: [0, 0.01], //坐标偏移
          crossLine: {
            color: ['#00D2FF', '#045E95'], //颜色第一个是水平的线条颜色，第二个是竖直的线条的颜色
            weight: 1,
            opacity: 0.6
          },
          //添加触摸更换图标效果
          mouseChange: {
            change: true, //只有为true的时候才会更换图标
            iconSrc: './mapComponent2/img/circle.png',
            iconSize: [82, 82],
            iconOffset: [0, 0],
          }

        }],
        //生成线条的样式，包括实线和虚线
        lineType: {
          color: '#f00',//线条颜色
          weight: 2,  //线条粗细
          style: 'dashed', //solid  线条样式
          opacity: 0.8  //线条透明度
        },
        //生成不规则覆盖物的样式
        polygonType: {
          //polygon的填充色，当数据超过颜色数量的时候会重新以第一个颜色开始向后排
          fillColor: ['#B3DFFC', '#F9DA1F', '#FF7200'],
          fillOpacity: 0.3
        },
        heatmapType: {
          color: ['#C74D36', '#F02B1A'],//热点图对应的颜色，可以定义多个
          radius: 20, //热力点大小
          max: 50 //热力点最大值，对应的count最大不能超过50
        },
        //特殊点样式，可以有多个样式，但是每个样式对应一个点的数据
        specialPointType: [{
          iconSrc: './mapComponent2/img/circle.png',
          iconSize: [82, 82],
          iconOffset: [0, 0],
          rotate: 45
        }],
        //海量点的样式
        ThermodynamicType: {
          color: '#F2B002', //点的颜色
          size: 2, //点的大小
          shape: BMAP_POINT_SHAPE_CIRCLE //点的形状
        }
    });
```

2. 将地图展示出来，使用实例的show方法，这里详细讲解一下数据参数

***生成点覆盖物数据格式***

```javascript
map.show({
    //生成点的数据格式,生成所有点的信息，position是必须填写的，其他的属于自定义属性，随意定义
    pointData: [{
        content: "我的备注1",
        title: "黑龙江",
        position: [39.821087, 116.303299]
      }, {
        content: "我的备注2",
        title: "好吧",
        position: [39.971087, 116.473299]
      }, {
        content: "我的备注3",
        title: "北京",
        position: [39.929087, 116.409299]
      }, {
        content: "我的备注4",
        title: "添加",
        position: [39.911087, 116.453299]
      }]
  })
```

***特殊点数据格式***

```javascript
//每哥特殊样式对应一个特殊点，一定是写一个特殊点的样式，写一个特殊点的数据，所有特殊点使用一个click事件
    map.show({
      specialPointData: [
        [167.673174, 63.230556],
      ]
    })
```

***线条的数据格式***

```javascript
map.show({
    lineData: [
      [39.821087, 116.303299],
      [39.971087, 116.473299],
      [39.929087, 116.409299],
      [39.911087, 116.453299]
    ]
  })
```

***不规则覆盖物的数据格式***

```javascript
    map.show({
    //不规则覆盖物数据格式
    polygonData: [
      [
        [167.673174, 63.230556],
        [173.854666, 65.766347],
        [179.447444, 67.74226],
        [177.975661, 62.829509],
        [174.737736, 47.779483],
        [169.733672, 33.769461],
        [155.604548, 24.481045],
        [134.410862, 18.140735],
        [149.128699, -0.807757],
        [151.189196, -4.359866],
        [164.140893, -14.574909],
        [162.963466, -17.704316],
        [144.124634, -22.704511],
        [132.350364, -14.861422],
        [115.866387, -15.433287],
        [104.975187, 9.520205],
        [120.281738, 35.952953],
        [137.060072, 60.158079],
      ],
      [
        [-5.702951, 35.472801],
        [10.48667, 44.296032],
        [15.785092, 45.550748],
        [35.801351, 44.296032],
        [42.865913, 35.952953],
        [49.341761, 34.259724],
        [51.696615, 11.559165],
        [46.69255, 7.174929],
        [29.914216, 17.294358],
        [22.555297, 26.086814],
        [4.599535, 33.52326],
      ],
      [
        [-67.517868, -53.296053],
        [-70.167079, -15.433287],
        [-75.759857, 4.817345],
        [-99.602754, 23.670224],
        [-111.671381, 32.031245],
        [-114.909305, 44.296032],
        [-127.566645, 56.115499],
        [-142.873196, 60.304473],
        [-148.465974, 58.503944],
        [-147.582904, 55.284353],
        [-139.046559, 48.762034],
        [-130.215856, 36.430179],
        [-121.385154, 20.377128],
        [-111.377024, -1.104077],
        [-103.429392, -2.28898],
        [-94.893046, -1.400368],
        [-89.005911, -5.245781],
        [-85.767987, -13.713132],
        [-82.235706, -17.139127],
        [-78.409068, -24.871422],
        [-81.058279, -31.389879],
        [-82.235706, -42.678271],
        [-73.993717, -55.192062],
      ],
    ]
  })
```

***热力图覆盖物的数据格式***

```javascript
    map.show({
    //热力图覆盖物数据格式
    heatmapData: [{
      "lng": 6.53104,//经度
      "lat": 42.643258,//纬度
      "count": 50//对应的热力值
    }, {
      "lng": 12.123818,
      "lat": 44.987485,
      "count": 50
    }, {
      "lng": 51.567623,
      "lat": 24.289664,
      "count": 50
    }, {
      "lng": 8.29718,
      "lat": 41.98785,
      "count": 50
    }, {
      "lng": 11.535105,
      "lat": 41.98785,
      "count": 50
    }, {
      "lng": 15.656099,
      "lat": 40.880245,
      "count": 40
    }]
  })
```

***海量点的数据格式***

```javascript
[
  [74.438,39.006,1],
  [74.932,38.382,1],
]
```















3. 通过调用实例的setEvent方法来给点设置回调函数,暂时只有click事件，后期会根据需要添加
```javascript
    map.setEvent({
      pointClick: function(event) {
        console.log(event)
      },
      //特殊点的点击事件
      specialPointClick: function(event) {
      console.log(event);
      },
      //点的触摸事件
      pointMouseover: function(event) {
        console.log(event);
      },
      //点的触摸离开事件
      pointMouseout: function(event) {
        console.log(event);
      },
    })

    //触发方法会在地图上添加一个覆盖物沿着指定路线走，最后消失
    map.addTurtle({
        //添加的覆盖物的样式
      style: {
        iconSrc: './mapComponent2/img/circle.png',
        iconSize: [82, 82],
       iconOffset: [0, 0],
        zIndex: 10
      },
      //开始动画的起点默认是数组的第一组坐标
      data: [
        [116.90227, 20.521737],
        [115.485679, 19.0939],
        [117.362203, 15.185398],
        [114.400238, 15.809815],
        [111.677438, 17.988319],
        [113.167619, 20.035646]
      ]
    })

    //将地图的位置移动到指定的坐标和缩放到指定级别
    map.moveToTarget({
      zoom: 10,  //地图缩放级别
      moveTo: [138.736552, 56.704801] //经度和纬度
    })
```