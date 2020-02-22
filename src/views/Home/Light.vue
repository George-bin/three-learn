<template>
  <div class="light-component" id="light-component"></div>
</template>

<script>
import OrbitControls from "three/examples/js/controls/OrbitControls";
let scene = null;
let camera = null;
let renderer = null;
let controls = null;
let mesh1 = null;
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
  destroyed() {
    // scene = null;
    // camera = null;
    // renderer = null;
    // controls = null;
    // mesh1 = null;
  },
  methods: {
    init() {
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
      this.initScene();
      // this.initMesh();
      // this.initLight();
      this.initAxesHelper();
      this.initCamera();
      this.initRenderer();
      this.initControls();
      this.render();
      // 平行光投影
      this.directionalLightProjection();
      // 聚光源投影
      // this.spotLightProjection()
    },
    // 创建场景对象
    initScene() {
      scene = new THREE.Scene();
    },
    // 创建网格模型
    initMesh() {
      // 立体网格模型
      let geometry1 = new THREE.BoxGeometry(100, 100, 100); // 创建一个立方体的几何对象Geometry
      let material1 = new THREE.MeshLambertMaterial({ // 创建一种材质Material
        color: 0x0000ff,
        opacity: 0.4,
        transparent: true
      });
      //材质对象
      let sphereMaterial=new THREE.MeshPhongMaterial({
        color:0x0000ff,
        specular:0x4488ee,
        shininess:12
      });
      mesh1 = new THREE.Mesh(geometry1, sphereMaterial); // 网格模型对象Mesh
      scene.add(mesh1); // 将网格模型添加到场景中

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
      // 环境光 环境光颜色与网格模型的颜色进行RGB进行乘法运算
      let ambient = new THREE.AmbientLight(0x888888);
      scene.add(ambient);
      
      // 点光源
      // let point = new THREE.PointLight(0xffffff);
      // point.position.set(400, 200, 300)
      // scene.add(point);

      // 平行光
      // let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      // directionalLight.position.set(-80, 100, 50);
      // directionalLight.target = mesh1;
      // scene.add(directionalLight);

      // 聚光源
      let spotLight = new THREE.SpotLight(0xffffff);
      spotLight.position.set(200, 200, 200); // 位置
      spotLight.target = mesh1; // 目标对象
      spotLight.angle = Math.PI/6; // 光源发散角度（范围）
      scene.add(spotLight);
    },
    // 平行光投影
    directionalLightProjection() {
      // 创建网格模型
      let geometry = new THREE.BoxGeometry(40, 100, 40);
      let material = new THREE.MeshLambertMaterial({
        color: 0x0000ff
      });
      let mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // 设置产生投影的网格模型
      mesh.castShadow = true;

      // 创建一个平面几何体作为投影面
      let planeGeometry = new THREE.PlaneGeometry(300, 200);
      let planeMaterial = new THREE.MeshLambertMaterial({
        color: 0x999999,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4
      });
      // 平面网格模型作为投影面
      let planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
      scene.add(planeMesh);
      planeMesh.rotateX(-Math.PI / 2); //旋转网格模型
      planeMesh.position.y = -50; //设置网格模型y坐标
      // 设置接收阴影的投影面
      planeMesh.receiveShadow = true;

      // 方向光
      let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      // 设置光源位置
      directionalLight.position.set(60, 100, 40);
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
      // directionalLight.shadow.mapSize.set(1024,1024)
      console.log(directionalLight.shadow.camera);
    },
    // 聚光源投影
    spotLightProjection() {
      // 创建网格模型
      let geometry = new THREE.BoxGeometry(40, 100, 40);
      let material = new THREE.MeshLambertMaterial({
        color: 0x0000ff
      });
      let mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // 设置产生投影的网格模型
      mesh.castShadow = true;

      // 创建一个平面几何体作为投影面
      let planeGeometry = new THREE.PlaneGeometry(300, 200);
      let planeMaterial = new THREE.MeshLambertMaterial({
        color: 0x999999,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4
      });
      // 平面网格模型作为投影面
      let planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
      scene.add(planeMesh);
      planeMesh.rotateX(-Math.PI / 2); //旋转网格模型
      planeMesh.position.y = -50; //设置网格模型y坐标
      // 设置接收阴影的投影面
      planeMesh.receiveShadow = true;

      // 聚光光源
      let spotLight = new THREE.SpotLight(0xffffff);
      // 设置聚光光源位置
      spotLight.position.set(50, 90, 50);
      // 设置聚光光源发散角度
      spotLight.angle = Math.PI /6
      scene.add(spotLight); //光对象添加到scene场景中
      // 设置用于计算阴影的光源对象
      spotLight.castShadow = true;
      // 设置计算阴影的区域，注意包裹对象的周围
      spotLight.shadow.camera.near = 1;
      spotLight.shadow.camera.far = 300;
      spotLight.shadow.camera.fov = 20;
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
      // 打开渲染器的地图阴影
      renderer.shadowMapEnabled = true;
      let box = document.getElementById('light-component');
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
    },
    // 创建辅助坐标系
    initAxesHelper() {
      // 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
      let axisHelper = new THREE.AxesHelper(250);
      scene.add(axisHelper);
    }
  }
}
</script>

<style lang="scss">
</style>
