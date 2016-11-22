## 地图组件文档（map.js）
1. 首先需要在页面中引入百度地图，http://api.map.baidu.com/api?v=2.0&ak=GAksItkSpA2HzIVHA0xAbLGVhdHXbKf9。ak后面是一个使用百度地图需要的验证码。不同的地图可能还需要引入其他的百度地图组件文件。
    - 比如http://api.map.baidu.com/library/Heatmap/2.0/src/Heatmap_min.js等等
    - 还有的需要结合echarts2，就需要下载一个echarts2文件，[传送门](http://echarts.baidu.com/echarts2/)
2. 引入map.js文件
3. 接下来就是使用了。

### 使用方法
1. 引入map.js的时候会在全局产生一个Map对象，需要创建一个Map对象的实例，然后使用init方法先初始化地图，init方法中需要传入参数是一个对象。

```javascript
    map.init({
        id: 'map',   //用来防止地图的DOM元素
        center: [39.821087, 116.303299],   //地图显示的中心点
        //地图的类型BMAP_SATELLITE_MAP是卫星图，BMAP_HYBRID_MAP是混合地图，如果不加入这个参数的话，默认是普通地图
        mapType: 'BMAP_HYBRID_MAP',   
        zoom: 9,   //地图显示的缩放级别
    });
```

2. 将地图展示出来，使用实例的show方法，这里详细讲解一下数据参数

```javascript
map.show({
    //生成点的数据格式
    pointData: {
      icons: [{
        iconSrc: './mapComponent2/img/circle.png',
        iconSize: [82, 82],
        iconOffset: [0, 0],
        animate: true //是否有闪烁动画
      }, {
        iconSrc: './mapComponent2/img/vertex2.png', //图片地址
        iconSize: [22, 25], //图片大小
        iconOffset: [0, 0], //背景偏移
        offset: [0, 0.05], //坐标偏移
        //添加crossLine参数可以生成十字标线
        crossLine: {
          color: ['#00D2FF', '#045E95'], //颜色第一个是水平的线条颜色，第二个是竖直的线条的颜色
          weight: 1,//线条粗细
          opacity: 0.6//透明度
        }
      }],
      //点击坐标点时候触发的函数
      callback: function(event) {
        console.log(event)
      },
      //生成所有点的信息，position是必须填写的，其他的属于自定义属性，随意定义
      data: [{
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
    },
    lineData: {
        //线的样式对象，可以不写，有默认样式
      style: {
        color: '#f00',//线条颜色
        weight: 2,  //线条粗细
        style: 'dashed', //solid  线条样式
        opacity: 0.8  //线条透明度
      },
      data: [
        [39.821087, 116.303299],
        [39.971087, 116.473299],
        [39.929087, 116.409299],
        [39.911087, 116.453299]
      ]
    }
  })
```