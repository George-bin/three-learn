<template>
  <div class="curve-pipeline-component">
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
      // 曲线路径管道
      // 1、创建管道成型的路径(3D样条曲线)
      let path2 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-10, -50, -50),
        new THREE.Vector3(10, 0, 0),
        new THREE.Vector3(8, 50, 50),
        new THREE.Vector3(-5, 0, 100)
      ]);
      // LineCurve3创建直线段路径
      let path = new THREE.LineCurve3(new THREE.Vector3(0, 100, 0), new THREE.Vector3(0, 0, 0));

      // path:路径   40：沿着轨迹细分数  2：管道半径   25：管道截面圆细分数
      let geometry = new THREE.TubeGeometry(path, 40, 8, 8, false);

      let material = new THREE.MeshBasicMaterial({
        color: 0x00ff00
      });
      let mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // 多段路径生成管道
      // 创建多段线条的顶点数据
      let p1 = new THREE.Vector3(-85.35, -35.36)
      let p2 = new THREE.Vector3(-50, 0, 0);
      let p3 = new THREE.Vector3(0, 50, 0);
      let p4 = new THREE.Vector3(50, 0, 0);
      let p5 = new THREE.Vector3(85.35, -35.36);
      // 创建线条一：直线
      let line1 = new THREE.LineCurve3(p1,p2);
      // 重建线条2：三维样条曲线
      let curve = new THREE.CatmullRomCurve3([p2, p3, p4]);
      // 创建线条3：直线
      let line2 = new THREE.LineCurve3(p4,p5);
      let CurvePath = new THREE.CurvePath();// 创建CurvePath对象
      CurvePath.curves.push(line1, curve, line2);// 插入多段线条
      //通过多段曲线路径创建生成管道
      //通过多段曲线路径创建生成管道，CCurvePath：管道路径
      let geometry2 = new THREE.TubeGeometry(CurvePath, 100, 5, 25, false);

      let material2 = new THREE.MeshBasicMaterial({
        color: 0x00ff00
      });
      let mesh2 = new THREE.Mesh(geometry2, material2);
      mesh2.translateZ(100)
      scene.add(mesh2);
    }
  }
}
</script>

<style lang="scss">
.curve-pipeline-component {
}
</style>
