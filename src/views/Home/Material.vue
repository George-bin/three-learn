<template>
  <div class="mesh-component" id="mesh-component"></div>
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
      // 点材质
      // this.pointMetarial()
      // 线材质
      // this.lineMetarial()
      // 网格材质
      this.meshMaterial()
      // 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
      let axisHelper = new THREE.AxesHelper(250);
      scene.add(axisHelper);
    },
    // 点材质
    pointMetarial() {
      // 立体网格模型
      let geometry = new THREE.BoxGeometry(100, 100, 100); // 创建一个立方体的几何对象Geometry
      let material = new THREE.PointsMaterial({ // 创建一种材质Material
        color: 0x0000ff,
        size: 5
      });
      let point = new THREE.Points(geometry, material); // 网格模型对象Mesh
      scene.add(point); // 将网格模型添加到场景中
    },
    // 线材质
    lineMetarial() {
      let geometry = new THREE.SphereGeometry(100, 25, 25);
      // 实线材质
      let material = new THREE.LineBasicMaterial({
        color: 0x0000ff
      });
      let line = new THREE.Line(geometry, material);
      scene.add(line);

      let geometry2 = new THREE.SphereGeometry(100, 25, 25);
      // 虚线材质
      let material2 = new THREE.LineDashedMaterial({
        color: 0x0000ff,
        dashSize: 10, // 显示线段的大小。默认为3。
        gapSize: 5 // 间隙大小，默认为1
      });
      let line2 = new THREE.Line(geometry2, material2);
      line2.position.set(200, 100, 100);
      //  computeLineDistances方法  计算LineDashedMaterial所需的距离数组
      line2.computeLineDistances();
      scene.add(line2);
    },
    // 网格材质
    meshMaterial() {
      // 方体网格模型
      let geometry = new THREE.BoxGeometry(100, 100, 100);
      let material = new THREE.MeshBasicMaterial({
        color: 0xff00ff
      });
      let mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // 球体网格模型
      let geometry2 = new THREE.SphereGeometry(60, 40, 40);
      let material2 = new THREE.MeshLambertMaterial({
        color: 0xff00ff
      });
      let mesh2 = new THREE.Mesh(geometry2, material2); //网格模型对象Mesh
      mesh2.translateY(120); //球体网格模型沿Y轴正方向平移120
      scene.add(mesh2);

      // 圆柱网格模型
      let geometry3 = new THREE.CylinderGeometry(50, 50, 100, 25);
      let material3 = new THREE.MeshLambertMaterial({
        color: 0xffff00
      });
      let mesh3 = new THREE.Mesh(geometry3, material3); //网格模型对象Mesh
      // mesh3.translateX(120); //球体网格模型沿Y轴正方向平移120
      mesh3.position.set(120,0,0);//设置mesh3模型对象的xyz坐标为120,0,0
      scene.add(mesh3);
    },
    // 创建光源
    initLight() {
      // 点光源
      let point = new THREE.PointLight(0xffffff);
      point.position.set(400, 200, 300);
      scene.add(point);

      // 环境光
      let ambient = new THREE.AmbientLight(0x444444);
      scene.add(ambient);
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
      let box = document.getElementById('mesh-component');
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
