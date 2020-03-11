<template>
  <div class="stretch-forming-component">
    <canvas id="canvasContext"></canvas>
  </div>
</template>

<script>
import OrbitControls from "three/examples/js/controls/OrbitControls";
import { mapState } from 'vuex';
export default {
  name: "",
  props: {},
  components: {},
  data() {
    return {
      s: 300
    }
  },
  computed: {
    ...mapState({
      screenWidth: state => state.home.screenWidth,
      screenHeight: state => state.home.screenHeight
    })
  },
  watch: {
    screenHeight: function(val, oldval) {
      this.canvasResize()
    },
    screenWidth: function(val, oldval) {
      this.canvasResize()
    }
  },
  created() {
    window.renderer = null;
    window.scene = null;
    window.camera = null;
    window.controls = null;
  },
  mounted() {
    this.initThree()
  },
  destroyed() {
  },
  methods: {
    initThree() {
      this.initScene();
      this.initLight();
      this.initCamera();
      this.initRenderer();
      this.initControls();
      this.initAxesHelper();
      this.createMesh();
      this.render();
    },
    // 1、初始化场景
    initScene () {
      window.scene = new THREE.Scene();
    },
    // 2、初始化灯光
    initLight () {
      // 点光源
      let point = new THREE.PointLight(0xffffff);
      point.position.set(400, 200, 300); //点光源位置
      scene.add(point); //点光源添加到场景中
      // 环境光
      let ambient = new THREE.AmbientLight(0x444444);
      scene.add(ambient);
    },
    // 3、初始化相机
    initCamera () {
      let k = this.screenWidth / this.screenHeight; // 窗口宽高比
      let s = 300; // 三维场景显示范围控制系数，系数越大，显示的范围越大
      window.camera = new THREE.OrthographicCamera(-s*k, s*k, s, -s, 1, 1000);
      camera.position.set(200, 300, 200); // 设置相机位置
      camera.lookAt(scene.position); // 设置相机方向（指向的场景对象）
    },
    // 4、创建渲染器
    initRenderer () {
      window.renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('canvasContext')
      });
      renderer.setSize(this.screenWidth, this.screenHeight); // 设置渲染区域的宽高
      renderer.setClearColor(0xb9d3ff, 0.5); // 设置背景颜色
      renderer.shadowMap.enabled = true; // 渲染器开启阴影渲染
    },
    // 初始化控制器
    initControls() {
      // 创建控件对象
      window.controls = new THREE.OrbitControls(camera, renderer.domElement);
      // controls.addEventListener('change', this.render)
    },
    // 初始化辅助坐标系
    initAxesHelper () {
      // 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
      let axisHelper = new THREE.AxesHelper(250);
      scene.add(axisHelper);
    },
    // 执行渲染
    render () {
      renderer.render(scene, camera);
      requestAnimationFrame(this.render)
    },
    // 窗口大小变换重新进行绘制
    canvasResize() {
      let s = this.s;
      let width = document.documentElement.clientWidth;
      let height = document.documentElement.clientHeight;
      // 重新渲染canvas尺寸
      renderer.setSize(width, height);
      // 重置相机投影的相关参数
      let k = width/height; // 窗口宽高比
      camera.left = -s*k;
      camera.right = s*k;
      camera.top = s;
      camera.bottom = -s;
      // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
      // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
      // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
      camera.updateProjectionMatrix ();
    },
    createMesh() {
      let shape = new THREE.Shape();
      /**四条直线绘制一个矩形轮廓*/
      shape.moveTo(0,0); // 起点
      shape.lineTo(0,100); // 第2点
      shape.lineTo(100,100); // 第3点
      shape.lineTo(100,0); // 第4点
      shape.lineTo(0,0); // 第5点
      //拉伸造型
      let geometry = new THREE.ExtrudeGeometry(
        shape,//二维轮廓
        //拉伸参数
        {
          depth:120,//拉伸长度
          bevelEnabled:false//无倒角
        }
      );
      let material = new THREE.MeshLambertMaterial({
        color: 0xff0000
      });
      let mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // 点模型渲染
      let geometry2 = new THREE.ExtrudeGeometry(
        shape,//二维轮廓
        //拉伸参数
        {
          depth: 120,//拉伸长度
          bevelEnabled: false//无倒角
        }
      );
      let material2 = new THREE.PointsMaterial({
        color:0x0000ff,
        size:5.0//点对象像素尺寸
      });//材质对象
      let mesh2 = new THREE.Points(geometry, material2);//点模型对象
      scene.add(mesh2);//点模型添加到场景中

      // 扫描
      let shape3 = new THREE.Shape();
      /**四条直线绘制一个矩形轮廓*/
      shape3.moveTo(0,0);//起点
      shape3.lineTo(0,10);//第2点
      shape3.lineTo(10,10);//第3点
      shape3.lineTo(10,0);//第4点
      shape3.lineTo(0,0);//第5点
      /**创建轮廓的扫描轨迹(3D样条曲线)*/
      let curve = new THREE.SplineCurve3([
        new THREE.Vector3( -10, -50, -50 ),
        new THREE.Vector3( 10, 0, 0 ),
        new THREE.Vector3( 8, 50, 50 ),
        new THREE.Vector3( -5, 0, 100)
      ]);
      let geometry3 = new THREE.ExtrudeGeometry(//拉伸造型
        shape3,//二维轮廓
        //拉伸参数
        {
          bevelEnabled:false,//无倒角
          extrudePath:curve,//选择扫描轨迹
          steps:50//扫描方向细分数
        }
      );
      let material3 = new THREE.MeshLambertMaterial({
        color: 0xff0000
      });
      let mesh3 = new THREE.Mesh(geometry3, material3);
      mesh3.translateX(200);
      scene.add(mesh3); 
    },
  }
}
</script>

<style lang="scss">
.stretch-forming-component {
}
</style>
