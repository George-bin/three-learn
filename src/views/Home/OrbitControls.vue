<template>
  <div class="orbitControls-component" id="orbitControls-component"></div>
</template>

<script>
import OrbitControls from "three/examples/js/controls/OrbitControls";
let scene = null;
let camera = null;
let renderer = null;
let controls = null;
let mesh = null;
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
      this.initMesh();
      this.initLight();
      this.initCamera();
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
      let geometry = new THREE.BoxGeometry(100, 100, 100); // 创建一个立方体的几何对象Geometry
      let material = new THREE.MeshLambertMaterial({ // 创建一种材质Material
        color: 0x00ff00
      });
      mesh = new THREE.Mesh(geometry, material); // 网格模型对象Mesh
      scene.add(mesh); // 将网格模型添加到场景中
    },
    // 创建光源
    initLight() {
      // 点光源
      let point = new THREE.AmbientLight(0xffffff);
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
      let box = document.getElementById('orbitControls-component');
      box.appendChild(renderer.domElement); //body元素中插入canvas对象
    },
    // 初始化控制器
    initControls() {
      // 创建控件对象
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.addEventListener('change', this.render)

    },
    // 渲染函数
    render() {
      renderer.render(scene, camera);
      // mesh.rotateY(0.01); // 每次绕y轴旋转0.01弧度
      // requestAnimationFrame(this.render)
    }
  }
}
</script>

<style lang="scss">
</style>
