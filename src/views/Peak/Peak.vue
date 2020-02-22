<template>
  <div class="peak-component" id="peak-component"></div>
</template>

<script>
import OrbitControls from "three/examples/js/controls/OrbitControls";
let scene = null;
let camera = null;
let renderer = null;
let controls = null;
export default {
  name: "",
  props: {},
  components: {},
  data() {
    return {
      screenWidth: 0,
      screenHeight: 0
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
      this.initScene();
      this.initLight();
      this.initCamera();
      this.initMesh();
      this.initRenderer();
      this.initControls();
      this.render();
    },
    // 创建场景对象
    initScene() {
      scene = new THREE.Scene();
    },
    // 创建网格模型
    initMesh() {
      // 创建一个Buffer类型的几何对象
      // let geometry = new THREE.BufferGeometry();
      // let vertices = new Float32Array([
      //   0, 0, 0, // 顶点1坐标
      //   50, 0, 0, // 顶点2坐标
      //   0, 100, 0, // 顶点3坐标
      //   0, 0, 10, // 顶点4坐标
      //   0, 0, 100, // 顶点5坐标
      //   50, 0, 100, // 顶点6坐标
      // ]);
      // 创建属性缓冲区对象
      // let attribute = new THREE.BufferAttribute(vertices, 3); // 3个为一组，表示一个顶点的xyz坐标
      // 设置几何体attribute属性的位置属性
      // geometry.attributes.position = attribute;

      // 类型数组创建顶点颜色color数据
      // let colors = new Float32Array([
      //   1, 0, 0, //顶点1颜色
      //   0, 1, 0, //顶点2颜色
      //   0, 0, 1, //顶点3颜色

      //   1, 1, 0, //顶点4颜色
      //   0, 1, 1, //顶点5颜色
      //   1, 0, 1, //顶点6颜色
      // ]);
      // 设置几何体arrtibute属性的颜色color属性
      // geometry.attributes.color = new THREE.BufferAttribute(colors, 3); // 3个为一组,表示一个顶点的颜色数据RGB

      // 三角面（网格）渲染模式
      // let material = new THREE.MeshBasicMaterial({
      //   color: 0x0000ff,
      //   // vertexColors: THREE.VertexColors, //以顶点颜色为准
      //   side: THREE.DoubleSide // 两面可见
      // });
      // 网格模型对象Mesh
      // let mesh = new THREE.Mesh(geometry, material);
      // scene.add(mesh);

      // 点模型
      // let material = new THREE.PointsMaterial({
      //   // 使用顶点颜色数据渲染模型，不需要再定义color属性
      //   // color: 0xff0000,
      //   vertexColors: THREE.VertexColors, //以顶点颜色为准
      //   size: 10.0 // 点对象像素尺寸
      // });
      // let points = new THREE.Points(geometry, material);
      // scene.add(points);

      // 线模型
      // let material = new THREE.LineBasicMaterial({
      //   color: 0xff0000 // 线条颜色
      // });
      // let line = new THREE.Line(geometry, material);
      // scene.add(line);

      // 顶点光照法向量
      this.peakNormal()
      // 顶点索引
      // this.peakIndex()
      // geometry几何体
      // this.initGeometry()
      // 访问几何体对象数据
      // this.geometryData()
      // 几何对象旋转、平移、缩放
      // this.geometryTotate()
      
      // 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
      let axisHelper = new THREE.AxesHelper(250);
      scene.add(axisHelper);
    },
    // 顶点光照法向量
    peakNormal() {
      let geometry = new THREE.BufferGeometry(); //声明一个空几何体对象
      //类型数组创建顶点位置position数据
      let vertices = new Float32Array([
        0, 0, 0, //顶点1坐标
        50, 0, 0, //顶点2坐标
        0, 100, 0, //顶点3坐标

        0, 0, 0, //顶点4坐标
        0, 0, 100, //顶点5坐标
        50, 0, 0, //顶点6坐标
      ]);
      // 创建属性缓冲区对象
      let attribue = new THREE.BufferAttribute(vertices, 3); //3个为一组
      // 设置几何体attributes属性的位置position属性
      geometry.attributes.position = attribue;
      console.log(geometry.attributes)

      let normals = new Float32Array([
        0, 0, 1, //顶点1法向量
        0, 0, 1, //顶点2法向量
        0, 0, 1, //顶点3法向量

        0, 1, 0, //顶点4法向量
        0, 1, 0, //顶点5法向量
        0, 1, 0, //顶点6法向量
      ]);
      // // 设置几何体attributes属性的位置normal属性
      geometry.attributes.normal = new THREE.BufferAttribute(normals, 3); //3个为一组,表示一个顶点的法向量数据

      let material = new THREE.MeshLambertMaterial({
        color: 0x0000ff,
        side: THREE.DoubleSide // 两面可见
      });
      let mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    },
    // 顶点索引
    peakIndex() {
      var geometry = new THREE.BufferGeometry(); //声明一个空几何体对象
      //类型数组创建顶点位置position数据
      var vertices = new Float32Array([
        0, 0, 0, //顶点1坐标
        80, 0, 0, //顶点2坐标
        80, 80, 0, //顶点3坐标
        0, 80, 0, //顶点4坐标
      ]);
      // 创建属性缓冲区对象
      var attribue = new THREE.BufferAttribute(vertices, 3); //3个为一组
      // 设置几何体attributes属性的位置position属性
      geometry.attributes.position = attribue
      var normals = new Float32Array([
        0, 0, 1, //顶点1法向量
        0, 0, 1, //顶点2法向量
        0, 0, 1, //顶点3法向量
        0, 0, 1, //顶点4法向量
      ]);
      // 设置几何体attributes属性的位置normal属性
      geometry.attributes.normal = new THREE.BufferAttribute(normals, 3); //3个为一组,表示一个顶点的xyz坐标
      let material = new THREE.MeshBasicMaterial({
        color: 0x0000ff,
        side: THREE.DoubleSide // 两面可见
      });

      // Unit16Array类型数组创建顶点索引数据
      let indexes = new Uint16Array([
        // 0对应第1个顶点位置数据、第1个顶点法向量数据
        // 1对应第2个顶点位置数据、第2个顶点法向量数据
        // 索引值3个为一组，表示一个三角形的3个顶点
        0, 1, 2,
        0, 2, 3,
      ]);
      // 索引数据赋值给几何体的index属性
      geometry.index = new THREE.BufferAttribute(indexes, 1); //1个为一组
      let mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    },
    // 定义几何体Geometry
    initGeometry() {
      // 声明一个几何体对象Geometry
      let geometry = new THREE.Geometry();
      let p1 = new THREE.Vector3(0, 0, 0); //顶点1坐标
      let p2 = new THREE.Vector3(0, 100, 0); //顶点2坐标
      let p3 = new THREE.Vector3(50, 0, 0); //顶点3坐标
      let p4 = new THREE.Vector3(0, 0, 100); //顶点4坐标

      // 将顶点坐标添加到geometry对象中
      geometry.vertices.push(p1, p2, p3, p4);

      let color1 = new THREE.Color(0x00ff00); //顶点1颜色——绿色
      let color2 = new THREE.Color(0xff0000); //顶点2颜色——红色
      let color3 = new THREE.Color(0x0000ff); //顶点3颜色——蓝色
      // 将顶点颜色数据添加到geometry对象中
      geometry.colors.push(color1, color2, color3);

      // Face3构造函数创建一个三角面
      let face1 = new THREE.Face3(0, 1, 2);
      // 三角面每个顶点的法向量
      let n1 = new THREE.Vector3(0, 0, -1); //三角面Face1顶点1的法向量
      let n2 = new THREE.Vector3(0, 0, -1); //三角面2Face2顶点2的法向量
      let n3 = new THREE.Vector3(0, 0, -1); //三角面3Face3顶点3的法向量
      // 设置三角面Face3三个顶点的法向量
      face1.vertexNormals.push(n1, n2, n3);
      // 三角形1颜色
      // face1.color = new THREE.Color(0xffff00);
      // 设置三角面face1三个顶点的颜色
      // face1.color = new THREE.Color(0xff00ff);

      // face1.vertexColors = [
      //   new THREE.Color(0xffff00),
      //   new THREE.Color(0xff00ff),
      //   new THREE.Color(0x00ffff),
      // ]

      // 三角面2
      let face2 = new THREE.Face3(0, 2, 3);
      // 设置三角面法向量
      face2.normal=new THREE.Vector3(0, -1, 1);

      //三角面face1、face2添加到几何体中
      geometry.faces.push(face1,face2);

      // 材质对象
      let material = new THREE.MeshBasicMaterial({
        // color: 0xffff00,
        vertexColors: THREE.VertexColors, //以顶点颜色为准
        side: THREE.DoubleSide, //两面可见
      });

      // 网格模型对象Mesh
      let mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    },
    // 访问几何体对象数据
    geometryData() {
      let geometry = new THREE.BoxGeometry(100, 100, 100);

      // 遍历几何体的face属性
      geometry.faces.forEach(face => {
        // 设置三角面的三个顶点颜色
        face.vertexColors = [
          new THREE.Color(0xffff00),
          new THREE.Color(0xff00ff),
          new THREE.Color(0x00ffff),
        ]
      });
      geometry.faces.pop();
      geometry.faces.pop();

      let material = new THREE.MeshBasicMaterial({
        vertexColors: THREE.FaceColors,
        side: THREE.DoubleSide
      });

      let mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    },
    // 几何对象旋转、平移、缩放
    geometryTotate() {
      let geometry = new THREE.BoxGeometry(100, 100, 100);
      // 几何体xyz三个方向都放大2倍
      geometry.scale(2, 2, 2);
      // 几何体沿x轴平移50
      geometry.translate(50, 0, 0);
      // 几何体绕着x轴旋转45度
      geometry.rotateX(Math.PI / 4);
      // 居中：偏移的几何体居中
      // geometry.center();

      let material = new THREE.MeshLambertMaterial({
        color: 0x0000ff,
        // side: THREE.DoubleSide // 两面可见
      });

      let mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

    },
    // 创建光源
    initLight() {
      // 环境光 环境光颜色与网格模型的颜色进行RGB进行乘法运算
      let ambient = new THREE.AmbientLight(0x444444);
      scene.add(ambient);
      
      // 点光源
      let point = new THREE.PointLight(0xffffff);
      point.position.set(400, 200, 300)
      scene.add(point);
    },
    // 创建相机
    initCamera() {
      let k = this.screenWidth / this.screenHeight; // 窗口宽高比
      let s = 300; // 三维场景显示范围控制系数，系数越大，显示的范围越大
      camera = new THREE.OrthographicCamera(-s*k, s*k, s, -s, 1, 1000);
      camera.position.set(200, 300, 200); // 设置相机位置
      camera.lookAt(scene.position); // 设置相机方向（指向的场景对象）
    },
    // 初始化渲染器
    initRenderer() {
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(this.screenWidth, this.screenHeight); // 设置渲染区域的宽高
      renderer.setClearColor(0xb9d3ff, 1); // 设置背景颜色
      let box = document.getElementById('peak-component');
      box.appendChild(renderer.domElement); //body元素中插入canvas对象
    },
    // 初始化控制器
    initControls() {
      // 创建控件对象
      controls = new THREE.OrbitControls(camera, renderer.domElement);
    },
    // 渲染函数
    render() {
      renderer.render(scene, camera);
      requestAnimationFrame(this.render)
    }
  }
}
</script>

<style lang="scss">
</style>
