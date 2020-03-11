<template>
  <div class="group-component">
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
      console.log(scene.children);
    },
    // 1、初始化场景
    initScene () {
      window.scene = new THREE.Scene();
    },
    // 2、初始化灯光
    initLight () {
      // 点光源
      let point = new THREE.PointLight(0xffffff);
      point.name = 'pointLight'
      point.position.set(400, 200, 300); //点光源位置
      scene.add(point); //点光源添加到场景中
      // 环境光
      let ambient = new THREE.AmbientLight(0x444444);
      scene.add(ambient);
      // scene.remove(scene.getObjectByName('pointLight'))
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
    // 查找节点
    createMesh() {
      // 头部网格模型和组
      let headMesh = sphereMesh(10, 0, 0, 0);
      headMesh.name = '脑壳';
      let leftEyeMesh = sphereMesh(1, 8, 5, 4);
      leftEyeMesh.name = '左眼';
      let rightEyeMesh = sphereMesh(1, 8, 5, -4);
      rightEyeMesh.name = '右眼';
      let headGroup = new THREE.Group();
      headGroup.name = '头部';
      headGroup.add(headMesh, leftEyeMesh, rightEyeMesh);

      // 身体网格模型和组
      let neckMesh = cylinderGeometry(3, 10, 0, -15, 0);
      neckMesh.name = '脖子';
      let bodyMesh = cylinderGeometry(14, 30, 0, -35, 0);
      bodyMesh.name = '腹部';
      let leftLegMesh = cylinderGeometry(4, 60, 0, -80, -7);
      leftLegMesh.name = '左腿';
      let rightLegMesh = cylinderGeometry(4, 60, 0, -80, 7);
      rightLegMesh.name = '右腿';
      let legGroup = new THREE.Group();
      legGroup.name = '腿';
      legGroup.add(leftLegMesh, rightLegMesh);

      let bodyGroup = new THREE.Group();
      bodyGroup.name = '身体';
      bodyGroup.add(neckMesh, bodyMesh, legGroup);

      // 人Group
      let personGroup = new THREE.Group();
      personGroup.name = '人';
      personGroup.add(headGroup, bodyGroup);
      personGroup.translateY(50);
      scene.add(personGroup);

      scene.traverse(function (obj) {
        if (obj.type === 'Group') {
          console.log('组对象:', obj.name)
        }
        if (obj.type === 'Mesh') {
          console.log('模型:', obj.name)
          obj.material.color.set(0xffff00);
        }
        if (obj.name === '左眼' || obj.name === '右眼') {
          obj.material.color.set(0x000000);
        }
        // 打印id属性
        // console.log(obj);
        // 打印该对象的父对象
        // console.log(obj.parent);
        // 打印该对象的子对象
        // console.log(obj.children);
      });

      let leftLeg = scene.getObjectByName('左腿');
      leftLeg.material.color.set(0xff0000);


      // 球体网格模型创建函数
      function sphereMesh(R, x, y, z) {
        let geometry = new THREE.SphereGeometry(R, 25, 25);
        let material = new THREE.MeshPhongMaterial({
          color: 0xffffff
        });
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        return mesh;
      }

      // 圆柱体网格模型创建函数
      function cylinderGeometry(R, h, x, y, z) {
        let geometry = new THREE.CylinderGeometry(R, R, h, 25, 25);
        let material = new THREE.MeshPhongMaterial({
          color: 0xffffff
        });
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        return mesh;
      }
    },
    // 世界坐标系
    worldPosition() {
      let geometry = new THREE.BoxGeometry(50, 100, 50);
      let material = new THREE.MeshLambertMaterial({
        color: 0x000000
      });
      let mesh = new THREE.Mesh(geometry, material);
      // 设置本地坐标系
      mesh.position.set(50, 0, 0);

      let group = new THREE.Group();
      group.position.set(50, 0, 0);
      group.add(mesh);
      scene.add(group);
      console.log('本地坐标', mesh.position);

      //该语句默认在threejs渲染的过程中执行,如果渲染之前想获得世界矩阵属性、世界位置属性等属性，需要通过代码更新
      scene.updateMatrixWorld(true);
      let worldPosition = new THREE.Vector3();
      mesh.getWorldPosition(worldPosition);
      console.log('世界坐标', worldPosition);
    },
    drawAxes() {
      let gridGroup = new THREE.Group();
      let gridXZ = new THREE.GridHelper(80, 10, 0xEED5B7, 0xEED5B7);
      gridXZ.position.set( 40,0,40 );
      // scene.add(gridXZ);
      let gridXY = new THREE.GridHelper(80, 10, 0xEED5B7, 0xEED5B7);
      gridXY.position.set( 40,40,0 );
      gridXY.rotation.x = Math.PI/2;
      // scene.add(gridXY);
      let gridYZ = new THREE.GridHelper(80, 10, 0xEED5B7, 0xEED5B7);
      gridYZ.position.set( 0,40,40 );
      gridYZ.rotation.z = Math.PI/2;
      // scene.add(gridYZ);
      gridGroup.add(gridXZ, gridXY, gridYZ);
      scene.add(gridGroup);
    },
  }
}
</script>

<style lang="scss">
</style>
