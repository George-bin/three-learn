<template>
  <div class="group-component" id="group-component"></div>
</template>

<script>
import OrbitControls from "three/examples/js/controls/OrbitControls";
let scene = null;
let camera = null;
let renderer = null;
let controls = null;
let group = null;
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
  created() {
    scene = null;
    camera = null;
    renderer = null;
    controls = null;
    group = null;
  },
  mounted() {
    this.init()
  },
  destroyed() {
  },
  methods: {
    init() {
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
      this.initScene();
      // this.initMesh();
      this.initLight();
      // this.initAxesHelper();
      this.initCamera();
      this.initRenderer();
      this.initControls();
      this.render();
      // this.findNode();
      // this.worldPosition()
      this.drawAxes();
    },
    // 创建场景对象
    initScene() {
      scene = new THREE.Scene();
    },
    // 创建网格模型
    initMesh() {
      group = new THREE.Group();
      // 立体网格模型
      let geometry1 = new THREE.BoxGeometry(100, 100, 100); // 创建一个立方体的几何对象Geometry
      let material1 = new THREE.MeshLambertMaterial({ // 创建一种材质Material
        color: 0x0000ff,
        opacity: 0.4,
        transparent: true
      });
      let mesh1 = new THREE.Mesh(geometry1, material1); // 网格模型对象Mesh

      // 球体网格模型
      let geometry2 = new THREE.SphereGeometry(60, 40, 40);
      let material2 = new THREE.MeshLambertMaterial({
        color: 0xff00ff
      });
      let mesh2 = new THREE.Mesh(geometry2, material2); //网格模型对象Mesh
      mesh2.translateY(120); //球体网格模型沿Y轴正方向平移120

      // 圆柱网格模型
      let geometry3 = new THREE.CylinderGeometry(50, 50, 100, 25);
      let material3 = new THREE.MeshLambertMaterial({
        color: 0xffff00
      });
      let mesh3 = new THREE.Mesh(geometry3, material3); //网格模型对象Mesh
      // mesh3.translateX(120); //球体网格模型沿Y轴正方向平移120
      mesh3.position.set(120,0,0);//设置mesh3模型对象的xyz坐标为120,0,0
      
      group.add(mesh1, mesh2, mesh3);
      scene.add(group);
      // group.rotateX(-Math.PI/4)
      // group.position.set(300, 0, 0)
      // console.log(group.children)
      // console.log(scene.children)
      // setTimeout(() => {
      //   group.remove(mesh1);
      // }, 5000)
    },

    // 创建光源
    initLight() {
      // 环境光 环境光颜色与网格模型的颜色进行RGB进行乘法运算
      let ambient = new THREE.AmbientLight(0x888888);
      scene.add(ambient);
      
      // 点光源
      let point = new THREE.PointLight(0xffffff);
      point.position.set(400, 200, 300)
      scene.add(point);

      // 平行光
      // let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      // directionalLight.position.set(-80, 100, 50);
      // directionalLight.target = mesh1;
      // scene.add(directionalLight);

      // 聚光源
      // let spotLight = new THREE.SpotLight(0xffffff);
      // spotLight.position.set(200, 200, 200); // 位置
      // spotLight.target = mesh1; // 目标对象
      // spotLight.angle = Math.PI/6; // 光源发散角度（范围）
      // scene.add(spotLight);
    },
    // 查找节点
    findNode() {
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
      // renderer.setClearColor(0xb9d3ff, 1); // 设置背景颜色
      // 打开渲染器的地图阴影
      renderer.shadowMapEnabled = true;
      let box = document.getElementById('group-component');
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
