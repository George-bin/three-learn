<template>
  <div class="water-drop-sprite-component">
    <canvas id="canvasContext"></canvas>
  </div>
</template>

<script>
import OrbitControls from "three/examples/js/controls/OrbitControls";
import { mapState } from 'vuex';
let waterDropGroup = null;
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
    waterDropGroup = null
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
      window.camera = new THREE.PerspectiveCamera(45, k, 100, 10000);
      camera.position.set(1000, 1000, 1000); // 设置相机位置
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
      waterDropGroup.children.forEach(sprite => {
        // 雨滴的y坐标每次减1
        sprite.position.y -= 1;
        if (sprite.position.y < 0) {
          // 如果雨滴落到地面，重置y，从新下落
          sprite.position.y = 200;
        }
      });
      renderer.render(scene, camera);
      requestAnimationFrame(this.render)
    },
    // 窗口大小变换重新进行绘制
    canvasResize() {
      let s = this.s;
      let width = document.documentElement.clientWidth;
      let height = document.documentElement.clientHeight;
      // 重置渲染器输出画布canvas尺寸
      renderer.setSize(width, height); 
      // 全屏情况下：设置观察范围长宽比aspect为窗口宽高比 
      camera.aspect = width/height;
      // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
      // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
      // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
      camera.updateProjectionMatrix ();
    },
    // 创建网格模型
    createMesh() {
      // 创建一个组表示所有的雨滴
      waterDropGroup = new THREE.Group();
      let textureTree = new THREE.TextureLoader().load('../../../static/img/map/粒子系统/waterDrop.png');
      // 批量创建表示雨滴的精灵模型
      for (let i = 0; i < 400; i++) {
        let spriteMaterial = new THREE.SpriteMaterial({
          map:textureTree,//设置精灵纹理贴图
        });
        // 创建精灵模型对象
        let sprite = new THREE.Sprite(spriteMaterial);
        waterDropGroup.add(sprite);
        // 控制精灵大小,
        sprite.scale.set(8, 10, 1); //// 只需要设置x、y两个分量就可以
        let k1 = Math.random() - 0.5;
        let k2 = Math.random() - 0.5;
        let k3 = Math.random() - 0.5;
        // 设置精灵模型位置，在整个空间上上随机分布
        sprite.position.set(200 * k1, 200*k3, 200 * k2)
      }
      scene.add(waterDropGroup);

      let geometry = new THREE.PlaneGeometry(1000, 1000); //矩形平面
      // 加载草地纹理贴图
      let texture = new THREE.TextureLoader().load("grass.jpg");
      // 设置纹理的重复模式
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      // uv两个方向纹理重复数量
      texture.repeat.set(10, 10);
      let material = new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide,
        color: 0x777700,
        // map:texture,
      });
      let mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
      scene.add(mesh); //网格模型添加到场景中
      mesh.rotateX(-Math.PI/2);
    }
  }
}
</script>

<style lang="scss">
</style>
