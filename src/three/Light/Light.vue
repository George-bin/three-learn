<template>
  <div class="light-component">
    <canvas id="canvasContext"></canvas>
    <div class="params-control">
      <div class="params-control-item">
        <span class="label">光源</span>
        <el-radio-group v-model="activeLight" @change="handleChangeLight">
          <el-radio
            v-for="(item, index) in lightArr"
            :key="index"
            :label="item.value">{{item.label}}</el-radio>
        </el-radio-group>
      </div>
    </div>
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
      s: 300,
      activeLight: 'directionalLight',
      lightArr: [
        {
          label: '点光源',
          value: 'pointLight'
        },
        {
          label: '平行光',
          value: 'directionalLight'
        },
        {
          label: '聚光源',
          value: 'spotLight'
        },
      ]
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
    activeLight: function(val, oldval) {
      let oldLight = scene.getObjectByName(oldval);
      if (oldLight) {
        let oldLightHelper = scene.getObjectByName(oldval+'Helper');
        scene.remove(oldLight, oldLightHelper)
      }
      switch (val) {
        case 'pointLight':
          this.createPointLight();
          break;
        case 'directionalLight':
          this.createDirectionalLight();
          break;
        case 'spotLight':
          this.createSpotLightProjection();
          break;
        default:
          return undefined;
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
      // 环境光
      let ambient = new THREE.AmbientLight(0x444444);
      scene.add(ambient);
      // 平行光
      this.createDirectionalLight();
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
      // 创建网格模型
      let geometry = new THREE.BoxGeometry(20, 100, 20);
      let material = new THREE.MeshLambertMaterial({
        color: 0x0000ff
      });
      let mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, 50, 0);
      scene.add(mesh);
      // 设置产生投影的网格模型
      mesh.castShadow = true;

      // 球体
      geometry = new THREE.SphereGeometry(20, 32, 32);
      material = new THREE.MeshLambertMaterial({
        color: 0xffff00
      });
      mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, 20, 70);
      scene.add(mesh);
      mesh.castShadow = true;

      // 创建一个平面几何体作为投影面
      let planeGeometry = new THREE.PlaneGeometry(300, 200);
      let planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4
      });
      // 平面网格模型作为投影面
      let planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
      scene.add(planeMesh);
      planeMesh.rotateX(-Math.PI / 2); //旋转网格模型
      // planeMesh.position.y = -50; //设置网格模型y坐标
      // 设置接收阴影的投影面
      planeMesh.receiveShadow = true;
    },
    // 点光源投影
    createPointLight() {
      let pointLight = new THREE.PointLight(0xffffff);
      pointLight.name = 'pointLight';
      scene.add(pointLight); //光对象添加到scene场景中

      let pointLightHelper = new THREE.PointLightHelper( pointLight, 10 );
      pointLightHelper.name = 'pointLightHelper';
      scene.add( pointLightHelper );

      // 设置聚光光源位置
      pointLight.position.set(120, 100, 120);
      // 设置用于计算阴影的光源对象
      pointLight.castShadow = true;
    },
    // 平行光投影
    createDirectionalLight() {
      // 方向光
      let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.name = "directionalLight"
      // 设置光源位置
      directionalLight.position.set(60, 100, 40);
      let helper = new THREE.DirectionalLightHelper( directionalLight, 5 );
      helper.name = "directionalLightHelper"
      scene.add(helper);
      scene.add(directionalLight);
      // 设置用于计算阴影的光源对象
      directionalLight.castShadow = true;
      // 设置计算阴影的区域，最好刚好紧密包围在对象周围
      // 计算阴影的区域过大：模糊  过小：看不到或显示不完整
      directionalLight.shadow.camera.near = 0.5;
      directionalLight.shadow.camera.far = 300;
      directionalLight.shadow.camera.left = -500;
      directionalLight.shadow.camera.right = 50;
      directionalLight.shadow.camera.top = 200;
      directionalLight.shadow.camera.bottom = -100;
      // 设置mapSize属性可以使阴影更清晰，不那么模糊
      directionalLight.shadow.mapSize.set(1024,1024)
      console.log(directionalLight.shadow.camera);
    },
    // 聚光源投影
    createSpotLightProjection() {
      // 聚光光源
      let spotLight = new THREE.SpotLight(0xffffff);
      spotLight.name = "spotLight";
      
      // 设置聚光光源位置
      spotLight.position.set(120, 100, 120);
      // 设置聚光光源发散角度
      spotLight.angle = Math.PI /6
      scene.add(spotLight); //光对象添加到scene场景中

      let spotLightHelper = new THREE.SpotLightHelper( spotLight );
      spotLightHelper.name = "spotLightHelper";
      scene.add( spotLightHelper );
      // 设置用于计算阴影的光源对象
      spotLight.castShadow = true;
      // 设置计算阴影的区域，注意包裹对象的周围
      spotLight.shadow.camera.near = 1;
      spotLight.shadow.camera.far = 300;
      spotLight.shadow.camera.fov = 20;
    },
    // 更换光源
    handleChangeLight(val) {
      console.log('光源:', val)
    }
  }
}
</script>

<style lang="scss">
.light-component {
  .params-control {
    position: fixed;
    top: 10px;
    right: 10px;
    width: 240px;
    padding: 10px;
    font-size: 12px;
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
        .el-radio__label {
          font-size: 12px;
        }
      }
      .el-radio + .el-radio {
        margin-left: 10px;
      }
    }
  }
}
</style>
