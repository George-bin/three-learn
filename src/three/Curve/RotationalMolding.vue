<template>
  <div class="rotation-molding-component">
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
      // 旋转成型
      let points = [
        new THREE.Vector2(50,60),
        new THREE.Vector2(25,0),
        new THREE.Vector2(50,-60)
      ];
      let geometry = new THREE.LatheGeometry(points, 30);
      let material = new THREE.MeshPhongMaterial({
        color:0x0000ff, // 三角面颜色
        side:THREE.DoubleSide // 两面可见
      });//材质对象
      material.wireframe = true;//线条模式渲染(查看细分数)
      let mesh = new THREE.Mesh(geometry,material);//旋转网格模型对象
      scene.add(mesh);//旋转网格模型添加到场景中

      // 样条曲线插值计算
      let shape = new THREE.Shape();//创建Shape对象
      let points2 = [//定位定点
        new THREE.Vector2(50,60),
        new THREE.Vector2(25,0),
        new THREE.Vector2(50,-60)
      ];
      shape.splineThru(points);//顶点带入样条插值计算函数
      let splinePoints = shape.getPoints(20);//插值计算细分数20
      let geometry2 = new THREE.LatheGeometry(splinePoints,30);//旋转造型

      let material2 = new THREE.MeshPhongMaterial({
        color:0x0000ff, // 三角面颜色
        side:THREE.DoubleSide // 两面可见
      });//材质对象
      // material2.wireframe = true;//线条模式渲染(查看细分数)
      let mesh2 = new THREE.Mesh(geometry2, material2);//旋转网格模型对象
      mesh2.translateX(100);
      scene.add(mesh2);//旋转网格模型添加到场景中
    }
  }
}
</script>

<style lang="scss">
.rotation-molding-component {
}
</style>
