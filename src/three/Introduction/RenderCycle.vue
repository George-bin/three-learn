<template>
  <div class="render-cycle-component">
    <!-- 参数控制 -->
    <section class="params-control-section">
      <div class="params-control-item">
        <span class="label">速度</span>
        <input
          style="flex: 1"
          v-model="speed"
          type="range"
          :step="0.01"
          :min="0"
          :max="0.5"
          @input="handleChangeRotateSpeed" />
      </div>
      <div class="params-control-item">
        <span class="label">方向</span>
        <el-radio-group v-model="direction">
          <el-radio label="left">Left</el-radio>
          <el-radio label="right">Right</el-radio>
        </el-radio-group>
      </div>
    </section>
    <canvas id="canvasContext"></canvas>
  </div>
</template>

<script>
import * as THREE from 'three';
import { mapState } from 'vuex';
let mesh = null;
export default {
  name: "",
  props: {},
  components: {},
  data() {
    return {
      s: 300,
      width: 0,
      height: 0,
      speed: 0.01,
      direction: 'right'
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
  methods: {
    initThree() {
      this.initScene();
      this.initLight();
      this.initCamera();
      this.initRenderer();
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
      let width = window.innerWidth;
      let height = window.innerHeight;
      let k = width / height; // 窗口宽高比
      let s = 300; // 三维场景显示范围控制系数，系数越大，显示的范围越大
      window.camera = new THREE.OrthographicCamera(-s*k, s*k, s, -s, 1, 1000);
      camera.position.set(200, 300, 200); // 设置相机位置
      camera.lookAt(scene.position); // 设置相机方向（指向的场景对象）
    },
    // 4、创建渲染器
    initRenderer () {
      let width = window.innerWidth;
      let height = window.innerHeight;
      window.renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('canvasContext')
      });
      renderer.setSize(width, height); // 设置渲染区域的宽高
      renderer.setClearColor(0xb9d3ff, 0.5); // 设置背景颜色
    },
    createMesh () {
      let geometry = new THREE.BoxGeometry(100, 100, 100); // 创建一个立方体的几何对象Geometry
      let material = new THREE.MeshLambertMaterial({ // 创建一种材质Material
        color: 0x00ff00
      });
      mesh = new THREE.Mesh(geometry, material); // 网格模型对象Mesh
      scene.add(mesh); // 将网格模型添加到场景中
    },
    // 执行渲染
    render () {
      let speed = this.speed;
      if (this.direction === 'left') {
        speed = -speed
      }
      renderer.render(scene, camera);
      mesh.rotateY(speed);
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
    // 控制旋转速度
    handleChangeRotateSpeed () {}
  }
}
</script>

<style lang="scss">
.render-cycle-component {
  .params-control-section {
    position: fixed;
    top: 10px;
    right: 10px;
    width: 240px;
    padding: 10px;
    font-size: 14px;
    color: white;
    background: rgba(68, 68, 68, 0.4);
    border-radius: 4px;
    .params-control-item {
      display: flex;
      align-items: center;
      .label {
        margin-right: 10px;
      }
      .el-radio {
        color: white;
      }
    }
    .params-control-item + .params-control-item {
      margin-top: 10px;
    }
  }
}
</style>
