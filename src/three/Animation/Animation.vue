<template>
  <div class="animation-component">
    <canvas id="canvasContext"></canvas>
    <!-- 参数控制 -->
    <div class="params-control">
      <div class="params-control-item">
        <span class="label">动画</span>
        <el-radio-group v-model="animationStatus">
          <el-radio label="starting">开始</el-radio>
          <el-radio label="stop">暂停</el-radio>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<script>
import OrbitControls from "three/examples/js/controls/OrbitControls";
import { mapState } from 'vuex';
let mixer = null;
let AnimationAction = null;
export default {
  name: "",
  props: {},
  components: {},
  data() {
    return {
      s: 300,
      animationStatus: 'starting'
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
    },
    animationStatus: function(val, oldval) {
      if (AnimationAction.paused) {
      // 如果是播放状态，设置为暂停状态
        AnimationAction.paused = false;
      } else {
        // 如果是暂停状态，设置为播放状态
        AnimationAction.paused = true;
      }
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
      renderer.render(scene, camera);
      requestAnimationFrame(this.render)
      //clock.getDelta()方法获得两帧的时间间隔
      // 更新混合器相关的时间
      mixer.update(clock.getDelta());
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
      let group = new THREE.Group();
      scene.add(group);
      let geometry = new THREE.SphereGeometry(25, 50, 50);
      let material = new THREE.MeshLambertMaterial({
        color: 0xff0000
      });
      let mesh = new THREE.Mesh(geometry, material);
      mesh.name = 'Sphere';
      group.add(mesh);

      let geometry2 = new THREE.BoxGeometry(70, 15, 15);
      let material2 = new THREE.MeshLambertMaterial({
        color: 0x0000ff
      });
      let mesh2 = new THREE.Mesh(geometry2, material2);
      mesh2.name = 'Box';
      mesh2.translateX(80);
      group.add(mesh2);

      // 编辑group子对象网格模型mesh1和mesh2的帧动画数据
      let times = [0, 20]; //关键帧时间数组，离散的时间点序列
      let values = [0, 0, 0, 150, 0, 0]; //与时间点对应的值组成的数组
      // 创建位置关键帧对象：0时刻对应位置0, 0, 0   10时刻对应位置150, 0, 0
      let posTrack = new THREE.KeyframeTrack('Box.position', times, values);
      // 创建颜色关键帧对象：10时刻对应颜色1, 0, 0   20时刻对应颜色0, 0, 1
      let colorKF = new THREE.KeyframeTrack('Box.material.color', [10, 20], [1, 0, 0, 0, 0, 1]);
      // 创建名为Sphere对象的关键帧数据  从0~20时间段，尺寸scale缩放3倍
      let scaleTrack = new THREE.KeyframeTrack('Sphere.scale', [0, 20], [1, 1, 1, 3, 3, 3]);

      // duration决定了默认的播放时间，一般取所有帧动画的最大时间
      // duration偏小，帧动画数据无法播放完，偏大，播放完帧动画会继续空播放
      let duration = 20;
      // 多个帧动画作为元素创建一个剪辑clip对象，命名"default"，持续时间20
      let clip = new THREE.AnimationClip("default", duration, [posTrack, colorKF, scaleTrack]);

      /**
       * 播放编辑好的关键帧数据
       */
      // group作为混合器的参数，可以播放group中所有子对象的帧动画
      mixer = new THREE.AnimationMixer(group);
      // 剪辑clip作为参数，通过混合器clipAction方法返回一个操作对象AnimationAction
      AnimationAction = mixer.clipAction(clip);
      //通过操作Action设置播放方式
      AnimationAction.timeScale = 5;//默认1，可以调节播放速度
      // AnimationAction.loop = THREE.LoopOnce; //不循环播放
      // AnimationAction.clampWhenFinished = true; //暂停在最后一帧播放的状态
      
      // 设置播放区间10~18   关键帧数据总时间是20
      // AnimationAction.time = 10; //操作对象设置开始播放时间
      // clip.duration = 20;//剪辑对象设置播放结束时间
      AnimationAction.play();//开始播放
      
      // 创建一个时钟对象Clock
      window.clock = new THREE.Clock();
      
    }
  }
}
</script>

<style lang="scss">
.animation-component {
  .params-control {
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
        margin-right: 0;
        color: white;
      }
      .el-radio + .el-radio {
        margin-left: 10px;
      }
    }
    .params-control-item + .params-control-item {
      margin-top: 10px;
    }
  }
}
</style>
