<template>
  <div class="mesh-component">
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
  created() {},
  mounted() {
    this.initThree()
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
    // 创建网格模型
    createMesh() {
      // 立体网格模型
      let geometry1 = new THREE.BoxGeometry(50, 50, 50); // 创建一个立方体的几何对象Geometry
      let material1 = new THREE.MeshLambertMaterial({ // 创建一种材质Material
        color: 0x0000ff
      });
      let mesh1 = new THREE.Mesh(geometry1, material1); // 网格模型对象Mesh
      mesh1.translateX(30)
      mesh1.translateY(25)
      mesh1.translateZ(30)
      scene.add(mesh1); // 将网格模型添加到场景中

      // 球体网格模型
      let geometry2 = new THREE.SphereGeometry(30, 100, 100);
      let material2 = new THREE.MeshLambertMaterial({
        color: 0xff00ff
      });
      let mesh2 = new THREE.Mesh(geometry2, material2); //网格模型对象Mesh
      mesh2.translateY(90); //球体网格模型沿Y轴正方向平移120
      mesh2.translateZ(30)
      mesh2.translateX(30)
      scene.add(mesh2);

      // 圆柱网格模型
      let geometry3 = new THREE.CylinderGeometry(25, 25, 50, 25);
      let material3 = new THREE.MeshLambertMaterial({
        color: 0xffff00
      });
      let mesh3 = new THREE.Mesh(geometry3, material3); //网格模型对象Mesh
      // mesh3.translateX(120); //球体网格模型沿Y轴正方向平移120
      mesh3.position.set(90,25,30);//设置mesh3模型对象的xyz坐标为120,0,0
      scene.add(mesh3);
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
    }
  }
}
</script>

<style lang="scss">
</style>
